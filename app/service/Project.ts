import { Service } from 'egg';
import { TWENTY_TWO, TWO_HOURS_MS, ZERO, USER_ADMIN, USER_VIEW } from '../config/constValue';

const crypto = require('crypto');
const { Op } = require("sequelize");

/**
 * Create Service
 */
export default class Project extends Service {

  /**
   * --- 查询项目 ---
   * @param { String } app_key
   * @returns Object
   */
  public async getProject(app_key: string) {
    const option: any = {
      where: {
        app_key: app_key,
      },
      raw: true,
    };
    const data = await this.ctx.model.Project.findOne(option);
    
    return data;
  }

  /**
   * --- 创建项目 ---
   * @param name - project name
   */
  public async createProject(name: string, user_id: number) {
    // -- 生成随机数 创建项目 --
    const app_key = crypto.randomBytes(12).toString('hex').slice(ZERO, TWENTY_TWO);

    // -- 检查 name 是否已经存在 --
    let option: any = {
      where: {
        app_key: app_key,
      },
      raw: true,
    };
    let result = await this.ctx.model.Project.findOne(option);
    if (result) {
      return 110
    }

    const data = await this.ctx.model.Project.create({
      name: name,
      app_key: app_key,
    });

    await this.ctx.app.redis.set(app_key, app_key);

    const project_id: number = data.dataValues.id;
    
    // ---- 创建权限 ----
    await this.addProjectRule(user_id, project_id, "admin")

    return app_key
  }

  /**
   * --- 添加项目权限 ---
   * @param user_id
   * @param project_id 
   * @param rule
   */
  public async addProjectRule(
    user_id: number,
    project_id: number,
    rule: string
  ) {
    let code = `project_${project_id}_${rule}`

    await this.ctx.model.RuleRoles.create({
      user_id: user_id,
      code: code,
    });
    
    // ---- 创建项目详细权限 ----
    if (rule === USER_ADMIN) {
      let arr: any = [];
      let rule_arr = ["R", "U", "D"];
      rule_arr.forEach((item: any) => {
        arr.push({
          project_id: project_id,
          role_code: code,
          operation: item,
        });
      });
      await this.ctx.model.RulePermission.bulkCreate(arr);
    } else if (rule === USER_VIEW) {
      await this.ctx.model.RulePermission.create({
        project_id: project_id,
        role_code: code,
        operation: "R",
      });
    }
    
    return true;
  }

  /**
   * --- 查询项目列表 ---
   * @param id
   */
  public async getProjectList(name?: string) {
    // ---- 找到 user_id 对应的权限 ----
    const user_role_list = await this.ctx.service.common.getUserRoleList();
    const role_code_array = user_role_list.map((item: any) => {
      return {
        role_code: item.code,
      }
    })
    // ---- 根据权限找到 project ----
    const option: any = {
      where: {
        [Op.or]: role_code_array,
        operation: "R",
      },
      attributes: ['project_id'],
      group: "project_id"
    };
    const result = await this.ctx.model.RulePermission.findAll(option);

    // ---- 返回 project List ----
    const array = await this.getProjectDetailList(result, name || "");

    return array
  }

  /**
   * --- 根据项目 ID 返回项目详情列表 ---
   * @param project_list { Array<string> }
   * @return project_list
   */
  public async getProjectDetailList(project_list: Array<any>, name: string) {
    const project_array = project_list.map((item: any) => {
      return item.project_id
    })
    const option: any = {
      where: {
        id: project_array,
        name: {
          [Op.like]: `${name}%`
        }
      },
    };
    const result = await this.ctx.model.Project.findAll(option);
    return result
  }

  /**
   * --- 设置项目配置 ---
   * @param app_key string
   * @param name    string
   * @param serverOpenRecord boolean
   * @return project
   */
  public async setProjectConfig(
    app_key: string,
    name: string,
    serverOpenRecord: boolean,
  ) {
    const config = {
      name: name,
    };
    const option: any = {
      where: {
        app_key: app_key,
      },
    };
    await this.ctx.model.Project.update(config, option);

    // ------ 记录 Crash 两小时 ------
    if (serverOpenRecord) {
      await this.app.redis.set(`serverOpenRecord-${app_key}`, "true", "px", TWO_HOURS_MS);
    }

    return {
      code: 200,
      result: 'success',
      msg: 'success',
      serverOpenRecord: serverOpenRecord,
    }
  }
}

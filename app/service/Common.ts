import { Service } from 'egg';
import { COOKIE_NAME, ZERO } from '../config/constValue';


const { Op, literal, fn } = require("sequelize");

export default class Common extends Service {

  /**
   * @description 查询用户 email
   * @returns email { string }
   */
  public async getUserEmail() {
    const { ctx } = this;
    // --- 获取 cookie ---
    let cookie: any = ctx.cookies.get(COOKIE_NAME, {
      signed: true,
      encrypt: true,
    });
    console.log(1111111, cookie);
    cookie = cookie?.split("#") || [];
    const email = cookie[ZERO] || "";
    if (email) {
      return email
    }
    
    return false
  }

  /**
   * @description 查询用户 ID
   * @param email { String }
   * @returns id { number }
   */
  public async getUserId(email: string) {
    // -- 检查 用户名/邮箱 是否已经存在 --
    const option: any = {
      where: {
        email: email,
      },
    };
    const result = await this.ctx.model.User.findOne(option);
    if (!result) {
      return false;
    }

    return result.id
  }

  /**
   * @description 查询用户全部信息
   * @returns user 
   */
  public async getUser() {
    const email = await this.getUserEmail();
    if (!email) { return false }

    const userId = await this.getUserId(email);
    
    if (userId) {
      return {
        id: userId,
        email: email,
      }
    }
  }

  /**
   * @description 获取用户的权限角色
   * @param user_id { String }
   * @return role_list
   */
  public async getUserRoleList() {
    const email = await this.ctx.service.common.getUserEmail();
    if (!email) { return false }

    const userId =  await this.getUserId(email);
    const option: any = {
      where: {
        user_id: userId,
      },
    };
    const result = await this.ctx.model.RuleRoles.findAll(option);
    if (!result) {
      return [];
    }

    return result || []
  }

  /**
   * 根据 appKey 判断是否有权限
   * @param appKey { String }
   */
  public async validateHasPermission(id: string) {
    // ---- 找到用户有的权限列表 ---
    const userRoleList = await this.ctx.service.common.getUserRoleList() || [];
    const roleCodeArray = userRoleList?.map((item: any) => {
      return {
        role_code: item.code,
      }
    });
    const option: any = {
      where: {
        [Op.or]: roleCodeArray,
        operation: "R",
        project_id: id,
      },
      raw: true,
      attributes: ['project_id'],
      group: "project_id"
    };
    const result = await this.ctx.model.RulePermission.findOne(option);
    if (result) {
      return true
    }
    return false;
  }


  /**
   * --- 根据 hash 查询 url ---
   * --- 根据 newGroupBy groupby 两个参数 ---
   */
   public async getUrlByHash(
    app_key: any,
    model: string,
    key: string,
    asKey: string,
    startTime?: any,
    endTime?: any,
    option?: any,
    newGroupBy?: any,
  ) {

    let options: any = {
      where: {
        app_key: app_key,
        createdAt: {
          [Op.between]: [
            startTime,
            endTime,
          ],
        },
        ...option,
      },
      raw: true,
      attributes: [
        [key, asKey],
        [fn('COUNT', '*'), 'num'],
      ],
      order: literal('num DESC'),
      group: asKey,
    };
    // ----- 当有新 group by 条件的时候使用新的条件 -----
    if (newGroupBy) {
      options = {
        where: {
          app_key: app_key,
          createdAt: {
            [Op.between]: [
              startTime,
              endTime,
            ],
          },
          ...option,
        },
        raw: true,
        attributes: [
          [key, asKey],
          [newGroupBy, newGroupBy],
          [fn('COUNT', '*'), 'num'],
        ],
        order: literal('num DESC'),
        group: [asKey, newGroupBy],
      };
    }

    let result = await this.ctx.model[model].findAll(options);

    return result
  }
}

import BaseController from './BaseController';

/**
 * get report error msg Array<error>
 * @param error
 */
export default class ProjectController extends BaseController {

  /**
   * --- 创建项目 ---
   * @param { String } name
   */
  public async create() {
    const { ctx } = this;
    const { name } = ctx.request.body;
    // --- 获取 cookie ---
    const email = await ctx.service.common.getUserEmail();
    if (email) {
      const id =  await ctx.service.common.getUserId(email);
      const data = await ctx.service.project.createProject(name, id);

      // this.ctx.body
      this.error(data);
    }
  }

  /**
   * --- 查询项目 ---
   * @param { String } app_key
   */
  public async getProject() {
    const { ctx } = this;
    const { app_key } = ctx.request.query;
    const data: any = await ctx.service.project.getProject(app_key);
    // --- 新增 rrweb 开关 redis 中保存 ---
    let redisData: any = await this.app.redis.get(`serverOpenRecord-${app_key}`);
    if (redisData) {
      ctx.body = {
        code: 200,
        data: {
          ...data,
          serverOpenRecord: true,
        },
        msg: 'success',
      };
    } else {
      ctx.body = {
        code: 200,
        data: data,
        msg: 'success',
      };
    }
  }


  /**
   * --- 查询用户项目列表 ---
   */
  public async getUserProjectList() {
    const { ctx } = this;
    const { name } = ctx.request.query;
    const data = await ctx.service.project.getProjectList(name);
    
    this.success(data);
  }


  /**
   * --- 设置项目 ---
   * @param { String } name
   */
  public async set() {
    const { ctx } = this;
    const { app_key, name, serverOpenRecord } = ctx.request.body;
    // --- 获取 cookie ---
    ctx.body = await ctx.service.project.setProjectConfig(app_key, name, serverOpenRecord);
  }
}

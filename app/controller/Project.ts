import BaseController from './BaseController';

/**
 * @controller ProjectController
 */
export default class ProjectController extends BaseController {

  /**
   * @summary 创建项目
   * @router post api/create/project
   * @request query string name 项目名称
   * @response 200 SuccessBody 返回结果
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
   * @summary 查询项目
   * @router get /api/get/project
   * @request query string app_key 项目 app_key
   * @response 200 SuccessBody 返回结果
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
   * @summary 查询用户项目列表
   * @router get /api/get/project/list
   * @request query string name 项目名称
   * @response 200 SuccessBody 返回结果
   */
  public async getUserProjectList() {
    const { ctx } = this;
    const { name } = ctx.request.query;
    const data = await ctx.service.project.getProjectList(name);
    
    this.success(data);
  }


  /**
   * @summary 设置项目
   * @router post /api/project/set
   * @request query string name 项目名称
   * @request query string app_key 项目 app_key
   * @request query boolean serverOpenRecord 是否开启 rrweb 录屏
   * @response 200 SuccessBody 返回结果
   */
  public async set() {
    const { ctx } = this;
    const { app_key, name, serverOpenRecord } = ctx.request.body;
    // --- 获取 cookie ---
    ctx.body = await ctx.service.project.setProjectConfig(app_key, name, serverOpenRecord);
  }
}

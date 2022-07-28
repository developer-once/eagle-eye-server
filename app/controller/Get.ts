import BaseController from './BaseController';

/**
 * get report error msg Array<error>
 * @param error
 */
export default class SaveController extends BaseController {

  /**
   * 查询项目
   * @param { String } app_key
   */
  public async getProject() {
    const { ctx } = this;
    const { app_key } = ctx.request.query;
    const data = await ctx.service.project.getProject(app_key);
    
    this.success(data);
  }

  /**
   * 查询 PV/UV 数据
   * @param { String } app_key
   */
  public async getPageUv() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    ctx.body = await ctx.service.get.getUvList(app_key, startTime, endTime);
  }

  /**
   * 查询用户项目列表
   */
  public async getUserProjectList() {
    const { ctx } = this;
    // --- 获取 cookie ---
    const user = await ctx.service.common.getUser();
    if (user) {}
  }
}

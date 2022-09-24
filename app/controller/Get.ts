import BaseController from './BaseController';

/**
 * @controller SaveController
 */
export default class SaveController extends BaseController {

  /**
   * @summary 查询项目
   * @router get /api/get/project
   * @request query string appkey 项目 appkey
   * @response 200 SuccessBody 返回结果
   */
  public async getProject() {
    const { ctx } = this;
    const { app_key } = ctx.request.query;
    const data = await ctx.service.project.getProject(app_key);
    
    this.success(data);
  }

  /**
   * @summary 查询 UV 数据
   * @router get /api/get/page/uv
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getPageUv() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    ctx.body = await ctx.service.get.getUvList(app_key, startTime, endTime);
  }
}

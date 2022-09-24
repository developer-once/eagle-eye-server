import BaseController from './BaseController';

/**
 * @controller ErrorController
 */
export default class ErrorController extends BaseController {
  /**
   * @summary 查询报错
   * @router get /api/get/error
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @request query string currentPage 翻页
   * @response 200 SuccessBody 返回结果
   */
  public async getError() {
    const { ctx } = this;
    const { app_key, startTime, endTime, currentPage } = ctx.request.query;
    const data = await ctx.service.error.getErrorList(app_key, startTime, endTime, currentPage);

    this.success(data);
  }

  /**
   * @summary 查询页面 crash
   * @router get /api/get/error/crash
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getReportCrash() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.error.getPageCrash(app_key, startTime, endTime);

    this.success(data);
  }
}

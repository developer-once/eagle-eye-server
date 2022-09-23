import BaseController from './BaseController';

/**
 * @controller ErrorController
 */
export default class ErrorController extends BaseController {
  /**
   * 查询报错
   * @param { String } app_key
   */
  public async getError() {
    const { ctx } = this;
    const { app_key, startTime, endTime, currentPage } = ctx.request.query;
    const data = await ctx.service.error.getErrorList(app_key, startTime, endTime, currentPage);

    this.success(data);
  }

  /**
   * 查询页面 crash
   * @param { String } app_key
   */
  public async getReportCrash() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.error.getPageCrash(app_key, startTime, endTime);

    this.success(data);
  }
}

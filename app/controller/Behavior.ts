import BaseController from './BaseController';

/**
 * save report error msg to MYSQL
 * @controller BehaviorController
 */
export default class BehaviorController extends BaseController {

  /**
   * @summary 获取点击事件数据
   * @router get /api/get/dashboard/click
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getClickDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;

    const data = await ctx.service.behavior.getClickDashboard(app_key, startTime, endTime);
    this.success(data);
  }

  /**
   * @summary 根据 url 聚合页面点击事件
   * @router get /api/get/dashboard/url
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
   public async getClickEventGroupByUrl() {
    const { ctx } = this;
    const { app_key, url, limit = 30, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.behavior.getClickEventGroupByUrl(app_key, url, limit, startTime, endTime);
    
    this.success(data);
  }
}

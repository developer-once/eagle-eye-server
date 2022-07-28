import BaseController from './BaseController';

/**
 * --- Behavior ---
 */
export default class BehaviorController extends BaseController {
  /**
   * --- 查询点击事件 ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
  public async getClickDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;

    const data = await ctx.service.behavior.getClickDashboard(app_key, startTime, endTime);
    this.success(data);
  }

  /**
   * --- 根据 url 聚合页面点击事件 ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
   public async getClickEventGroupByUrl() {
    const { ctx } = this;
    const { app_key, url, limit = 30, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.behavior.getClickEventGroupByUrl(app_key, url, limit, startTime, endTime);
    
    this.success(data);
  }
}

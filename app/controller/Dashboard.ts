import BaseController from './BaseController';

/**
 * get report error msg Array<error>
 * @param error
 */
export default class SaveController extends BaseController {

  /**
   * --- 查询总 PV、UV ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
  public async getDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.dashboard.getDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 查询UV ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
  public async getUvDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.dashboard.getUvDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 查询PV ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
  public async getPvDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.dashboard.getPvDashboard(app_key, startTime, endTime);

    this.success(data);
  }

   /**
   * --- 查询PV ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
  public async getErrorDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.error.getErrorDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 查询页面聚合 PV/UV ---
   */
  public async getGroupPageDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.dashboard.getGroupPageDashboard(app_key, startTime, endTime);

    this.success(data);
  }
}


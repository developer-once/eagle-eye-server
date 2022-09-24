import BaseController from './BaseController';

/**
 * * --- DashboardController ---
 * @controller DashboardController
 */
export default class DashboardController extends BaseController {

  /**
   * @summary 查询总 PV、UV
   * @router get /api/get/dashboard
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
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
   * @summary 查询错误
   * @router get /api/get/dashboard/error
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getErrorDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.error.getErrorDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * @summary 查询页面聚合 PV/UV
   * @router get /api/get/group/dashboard
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getGroupPageDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.dashboard.getGroupPageDashboard(app_key, startTime, endTime);

    this.success(data);
  }
}


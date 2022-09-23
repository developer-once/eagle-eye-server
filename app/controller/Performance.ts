import BaseController from './BaseController';

/**
 * @controller PerformanceController
 */
export default class PerformanceController extends BaseController {

  // ------------------------------- 整站 -------------------------------
  /**
   * --- 查询总 Res 、API ---
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
   public async getDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getPerformanceDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 查询资源加载缓慢 ---
   * @param { String } app_key
   */
  public async getPerformanceResDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getPerformanceResDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 查询资源加载缓慢 ---
   * @param { String } app_key
   */
  public async getPerformanceApiDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getPerformanceApiDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  
  // ------------------------------- 接口聚合 -------------------------------
  /**
   * --- 接口聚合 资源、API ---
   */
  public async getGroupPerformanceAll() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getGroupPerformanceAll(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 接口聚合 API ---
   */
  public async getGroupPerformanceApi() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getGroupPerformanceApi(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * --- 接口聚合 API ---
   */
   public async getGroupPerformanceRes() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data  = await ctx.service.performance.getGroupPerformanceRes(app_key, startTime, endTime);
    
    this.success(data);
  }
}

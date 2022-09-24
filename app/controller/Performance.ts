import BaseController from './BaseController';

/**
 * @controller PerformanceController
 */
export default class PerformanceController extends BaseController {

  // ------------------------------- 整站 -------------------------------
  /**
   * @summary 查询总 Res 、API
   * @router get /api/get/dashboard/performance
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
   public async getDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getPerformanceDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * @summary 查询资源加载缓慢
   * @router get /api/get/dashboard/performance/res
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getPerformanceResDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getPerformanceResDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * @summary 查询接口缓慢
   * @router get /api/get/dashboard/performance/api
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getPerformanceApiDashboard() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getPerformanceApiDashboard(app_key, startTime, endTime);

    this.success(data);
  }

  
  // ------------------------------- 接口聚合 -------------------------------
  /**
   * @summary 接口聚合 资源、API
   * @router get /api/get/group/performance
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getGroupPerformanceAll() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getGroupPerformanceAll(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * @summary 查询性能 API
   * @router get /api/get/group/performance/api
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getGroupPerformanceApi() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.performance.getGroupPerformanceApi(app_key, startTime, endTime);

    this.success(data);
  }

  /**
   * @summary 查询性能 res
   * @router get /api/get/group/performance/res
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
   public async getGroupPerformanceRes() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data  = await ctx.service.performance.getGroupPerformanceRes(app_key, startTime, endTime);
    
    this.success(data);
  }
}

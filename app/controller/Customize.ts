import BaseController from './BaseController';

/**
 * * --- Customize ---
 * 根据 App_key 返回配置信息
 * save report error msg to MYSQL
 * @controller CustomizeController
 */
export default class CustomizeController extends BaseController {

  /**
   * @summary 查询用户自定义上报数据
   * @router get /api/get/customize/report
   * @request query string appkey 项目 appkey
   * @request query string startTime 开始时间
   * @request query string endTime 结束时间
   * @response 200 SuccessBody 返回结果
   */
  public async getCustomizeReportList() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.customize.getCustomizeReportList(app_key, startTime, endTime);
    
    this.success(data);
  }
}

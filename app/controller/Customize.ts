import BaseController from './BaseController';

/**
 * * --- Customize ---
 * 根据 App_key 返回配置信息
 * save report error msg to MYSQL
 * @controller 上报 Controller
 */
export default class CustomizeController extends BaseController {

  /**
   * 查询用户自定义上报数据
   * @param { String } app_key
   * @param { String } startTime
   * @param { String } endTime
   */
  public async getCustomizeReportList() {
    const { ctx } = this;
    const { app_key, startTime, endTime } = ctx.request.query;
    const data = await ctx.service.customize.getCustomizeReportList(app_key, startTime, endTime);
    
    this.success(data);
  }
}

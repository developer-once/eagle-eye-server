import BaseController from './BaseController';

/**
 * * --- Config ---
 * 根据 App_key 返回配置信息
 * save report error msg to MYSQL
 * @controller ConfigController
 */
export default class ConfigController extends BaseController {
  /**
   * @summary 获取 appkey 配置
   * @router post /api/get/config
   * @request query string appkey 项目 appkey
   * @response 200 SuccessBody 返回结果
   */
  public async geAppConfig() {
    const { ctx } = this;
    const { app_key } = ctx.request.body;
    const data = await ctx.service.config.geAppConfig(app_key);

    // ---- 开启 rrweb ----
    if (data) {
      this.success({}, true);
      return
    }
    
    this.success({});
  }
}

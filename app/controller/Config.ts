import BaseController from './BaseController';

/**
 * * --- Config ---
 * 根据 App_key 返回配置信息
 * save report error msg to MYSQL
 * @controller 上报 Controller
 */
export default class ConfigController extends BaseController {
  /**
   * --- 获取配置 ---
   * @param { String } app_key
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

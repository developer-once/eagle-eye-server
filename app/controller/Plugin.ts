import BaseController from './BaseController';

/**
 * @controller PluginController
 */
export default class PluginController extends BaseController {
  /**
   * @summary 创建 Chrome Plugin key
   * @router post /api/create/plugin/key
   * @request query string appkey 项目 appkey
   * @response 200 SuccessBody 返回结果
   */
  public async createPluginKey() {
    const { ctx } = this;
    const { app_key } = ctx.request.body;
    const data = await ctx.service.plugin.createPluginKey(app_key);
    
    this.success(data);
  }

  /**
   * @summary 验证 Chrome Plugin key
   * @router get /api/plugin/key
   * @request query string appkey 项目 appkey
   * @request query string plugin_key 项目 plugin_key
   * @response 200 SuccessBody 返回结果
   */
  public async validatePluginKey() {
    const { ctx } = this;
    const { app_key, plugin_key } = ctx.request.query;
    const data = await ctx.service.plugin.validatePluginKey(app_key, plugin_key);

    this.success(data);
  }

  /**
   * @summary 获取 plugin_key by app_key
   * @router get /api/get/plugin/key
   * @request query string appkey 项目 appkey
   * @response 200 SuccessBody 返回结果
   */
  public async getPluginKeyByAppKey() {
    const { ctx } = this;
    const { app_key } = ctx.request.body;

    const data = await ctx.service.plugin.getPluginKeyByAppKey(app_key);

    this.success(data);
  }
}
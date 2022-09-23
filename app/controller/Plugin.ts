import BaseController from './BaseController';

/**
 * @controller Chrome Plugin Extension
 */
export default class PluginController extends BaseController {
  /**
   * --- 创建 Chrome Plugin key ---
   */
  public async createPluginKey() {
    const { ctx } = this;
    const { app_key } = ctx.request.body;
    const data = await ctx.service.plugin.createPluginKey(app_key);
    
    this.success(data);
  }

  /**
   * --- 验证 Chrome Plugin key ---
   */
  public async validatePluginKey() {
    const { ctx } = this;
    const { app_key, plugin_key } = ctx.request.query;
    const data = await ctx.service.plugin.validatePluginKey(app_key, plugin_key);

    this.success(data);
  }

  /**
   * --- 获取 plugin_key by app_key
   */
  public async getPluginKeyByAppKey() {
    const { ctx } = this;
    const { app_key } = ctx.request.body;

    const data = await ctx.service.plugin.getPluginKeyByAppKey(app_key);

    this.success(data);
  }
}
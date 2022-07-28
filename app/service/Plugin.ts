import { Service } from 'egg';
import { createHash } from '../utils/createHash';
import { ONE_YEAR_MS } from '../config/constValue';
import { checkIsInRedis } from '../utils/checkRedis';


const crypto = require('crypto');

/**
 * Plugin Service
 */
export default class Plugin extends Service {
  /**
   * ----- 创建 plugin -----
   * @returns plugin_key
   */
  public async createPluginKey(app_key: string) {

    const has_plugin_key = this.getPluginKeyByAppKey(app_key);

    if (has_plugin_key) {
      return has_plugin_key;
    }

    const plugin_key = "plugin_" + createHash(crypto.randomBytes(8));

    await this.ctx.model.Plugin.create({
      app_key: app_key,
      plugin_key: plugin_key,
    });


    // ---- 缓存一年 ----
    // ---- 单独的 app_key redis 标记 ----
    await this.ctx.app.redis.set(`plugin-${app_key}`, plugin_key, "px", ONE_YEAR_MS);

    return plugin_key;
  }

  /**
   * 
   */


  /**
   * ----- 校验 权限 -----
   * @param key 
   */
  public async validatePluginKey(app_key: string, plugin_key: string) {

    const options: any = {
      where: {
        app_key: app_key,
        plugin_key: plugin_key,
      },
      raw: true,
      attributes: ["plugin_key"],
    };

    let data: any = await checkIsInRedis(this.ctx, this.app, "plugin", app_key, "Plugin", options, false);
    
    return data;
  }

  /**
   * ----- 根据 app_key 返回 plugin_key -----
   * @param app_key
   * @returns plugin_key
   */
  public async getPluginKeyByAppKey(app_key: string) {
    const options: any = {
      where: {
        app_key: app_key
      },
      raw: true,
      attributes: ["plugin_key"],
    };

    let data: any = await checkIsInRedis(this.ctx, this.app, "plugin", app_key, "Plugin", options, false);

    return data;
  }
}
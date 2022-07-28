import { Service } from 'egg';

export default class Config extends Service {
  /**
   * --- 查询 App_key 的配置信息 ---
   * @param { String } app_key
   */
  public async geAppConfig(
    app_key: any,
  ) {

    // --- TODO ---
    // --- 新增记录 接口上报数据 开关 ---
    let redisData: any = await this.app.redis.get(`serverOpenRecord-${app_key}`);

    if (redisData) {
      return true;
    }

    return false
  }
}
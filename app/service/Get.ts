// ------ TODO ------
// ---- 页面大改 ----

import { Service } from 'egg';
import { formatStartTime, formatEndTime } from '../utils/formatDate';
// import { TEN, ONE, PAGE_SIZE, PAGE_OFFSET, LIMIT } from '../config/constValue';


const { Op } = require("sequelize");


/**
 * Get Error msg
 * @returns Array<errorMsg>
 */
export default class Get extends Service {

  /**
   * --- 查询 uv 列表 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns Object<Array>
   */
  public async getUvList(
    app_key: any,
    startTime?: any,
    endTime?: any,
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "uv",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ]
        }
      },
      raw: true,
      offset: ((currentPage - 1 || 0) * pageSize) || 0,
      limit: pageSize || 10,
      order: [[ 'createdAt', 'desc' ]],
    };
    let result: any;
    let redisData = await this.app.redis.get(`getUvList-${app_key}-${startTimeStr}-${endTimeStr}`);
    if (redisData) {
      result = redisData;
      result = JSON.parse(result);
    } else {
      result = await this.ctx.model.Page.findAndCountAll(options);
      // --- 设置 redis 缓存 px 为毫秒级的过期设置
      //     ex ：为键设置秒级过期时间。等同于setex
      //     px ：为键设置毫秒级过期时间。
      //     setMode（模式设置）：
      //     nx：键不存在，才可以设置成功，用于添加。等同于setnx
      //     xx：键存在，才可以设置成功，用于更新。
      await this.app.redis.set(`getUvList-${app_key}-${startTimeStr}-${endTimeStr}`, JSON.stringify(result), "px", 1000 * 60 * 5);
    }
    // let result = await this.ctx.model.Page.findAndCountAll(options);
    return {
      code: 200,
      result: result,
      msg: 'success',
    };
  }

  /**
   * --- 查询 pv 列表 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns Object<Array>
   */
  public async getPvList(
    app_key: any,
    startTime?: any,
    endTime?: any,
    pageSize: number = 10,
    currentPage: number = 1,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "pv",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ]
        }
      },
      raw: true,
      offset: ((currentPage - 1 || 0) * pageSize) || 0,
      limit: pageSize || 10,
      order: [[ 'createdAt', 'desc' ]],
    };
    let result: any;
    let redisData = await this.app.redis.get(`getPvList-${app_key}-${startTimeStr}-${endTimeStr}`);
    if (redisData) {
      result = redisData;
      result = JSON.parse(result);
    } else {
      result = await this.ctx.model.Page.findAndCountAll(options);
      // --- 设置 redis 缓存 px 为毫秒级的过期设置
      //     ex ：为键设置秒级过期时间。等同于setex
      //     px ：为键设置毫秒级过期时间。
      //     setMode（模式设置）：
      //     nx：键不存在，才可以设置成功，用于添加。等同于setnx
      //     xx：键存在，才可以设置成功，用于更新。
      await this.app.redis.set(`getUvList-${app_key}-${startTimeStr}-${endTimeStr}`, JSON.stringify(result), "px", 1000 * 60 * 5);
    }
    // let result = await this.ctx.model.Page.findAndCountAll(options);
    return {
      code: 200,
      result: result,
      msg: 'success',
    };
  }
}

import { Service } from 'egg';
import { fillDateData, aggregateData } from '../utils/index';
import { checkIsInRedis } from '../utils/checkRedis';
import { formatStartTime, formatEndTime, getDateRange } from '../utils/formatDate';
import { LIMIT, PAGE_OFFSET } from '../config/constValue';

const { Op, fn, col, literal } = require("sequelize");

/**
 * Get Dashboard data in home
 * @returns { Object }
 */
export default class Dashboard extends Service {

  // ------------------------------- 整站 -------------------------------
  /**
   * --- 获取站点统计数据 ---
   * --- 默认统计当天的 PV / UV ---
   * --- 默认统计当天的错误分布按地图区域分布 ---
   * --- 默认统计接口成功率 ---
   * --- 默认统计页面接口错误上升趋势 ---
   * --- 默认统计页面资源加载错误数 ---
   * --- redis 缓存 5min 数据 ---
   * --- app_key 命中缓存数据 ---
   * @param { String } app_key
   * @param { number } startTime
   * @param { number } endTime
   */
  public async getDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
  ) {
    let uv_data = await this.getUvDashboard(app_key, startTime, endTime);
    let pv_data = await this.getPvDashboard(app_key, startTime, endTime);

    let data = aggregateData(uv_data, pv_data);
    
    return data;
  }

  /**
   * --- 统计全站点的 UV 总合 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getUvDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);
    const dateRange = getDateRange(endTimeStr, startTimeStr);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "uv",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ],
        }
      },
      raw: true,
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d'), 'days'],
        [fn('COUNT', col('createdAt')), 'nums'],
      ],
      group: "days"
    };

    let result: any = await checkIsInRedis(this.ctx, this.app, "getUvDashboard", app_key, "Page", options, true, startTimeStr, endTimeStr);

    // --- 填充数据 ---
    result = result.reverse();
    let data = fillDateData(result, endTime, dateRange);
    
    return data;
  }

  /**
   * --- 统计全站点的 PV 总合 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getPvDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);
    const dateRange = getDateRange(endTimeStr, startTimeStr);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "pv",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ],
        }
      },
      raw: true,
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d'), 'days'],
        [fn('COUNT', col('createdAt')), 'nums'],
      ],
      group: "days"
    };

    let result: any = await checkIsInRedis(this.ctx, this.app, "getPvDashboard", app_key, "Page", options, true, startTimeStr, endTimeStr);

    // --- 填充数据 ---
    result = result.reverse();
    let data = fillDateData(result, endTime, dateRange);
    return data;
  }

  // ------------------------------- 接口聚合 -------------------------------
  /**
   * --- 查询由页面聚合的 PV/UV ---
   * --- 默认查询站点访问前 10 的路由 ---
   */
  public async getGroupPageDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
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
          ],
        }
      },
      raw: true,
      attributes: [
        ['referrer_hash', 'hash'],
        ['referrer', 'url'],
        [fn('COUNT', '*'), 'num'],
      ],
      order: literal('num DESC'),
      offset: PAGE_OFFSET,
      limit: LIMIT,
      group: ["hash", 'url'],
    };

    const data = await this.ctx.model.Page.findAll(options);

    return data;
  }

}
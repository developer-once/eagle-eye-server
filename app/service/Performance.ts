import { Service } from 'egg';
import { fillDateData, aggregatePerformanceData, aggregateGroupPerformance } from '../utils/index';
import { checkIsInRedis } from '../utils/checkRedis';
import { formatStartTime, formatEndTime, getDateRange } from '../utils/formatDate';
import { LIMIT, PAGE_OFFSET } from '../config/constValue';

const { Op, fn, col, literal } = require("sequelize");

export default class Performance extends Service {

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
  public async getPerformanceDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
  ) {
    let res_data = await this.getPerformanceResDashboard(app_key, startTime, endTime);
    let api_data = await this.getPerformanceApiDashboard(app_key, startTime, endTime);

    let data = aggregatePerformanceData(res_data, api_data);
    
    return data
  }

  // --------------------------- 资源 ---------------------------
  /**
   * --- 统计期七天的慢请求 - 资源 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getPerformanceResDashboard(
    app_key: string,
    startTime: string,
    endTime: string,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);
    const dateRange = getDateRange(endTimeStr, startTimeStr);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "slow",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ],
        }
      },
      attributes: [
        [fn('DATE_FORMAT', col('createdAt'), '%Y-%m-%d'), 'days'],
        [fn('COUNT', col('createdAt')), 'nums'],
      ],
      group: "days"
    };

    let result: any = await checkIsInRedis(this.ctx, this.app, "getPerformanceResDashboard", app_key, "Resource", options, true, startTimeStr, endTimeStr);
    
    // --- 填充数据 ---
    result = result.reverse();
    let data = fillDateData(result, endTime, dateRange);
    
    return data
  }

  /**
   * --- 统计慢请求 资源 的列表 ---
   * @param app_key
   * @param startTime
   * @param endTime
   * @returns 
   */
  public async getPerformanceResList() {
    
  }

  // --------------------------- API ---------------------------
  /**
   * --- 统计期七天的慢请求 - API ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getPerformanceApiDashboard(
    app_key: string,
    startTime: string,
    endTime: string,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);
    const dateRange = getDateRange(endTimeStr, startTimeStr);

    let options: any = {
      where: {
        app_key: app_key,
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
    let result: any = await checkIsInRedis(this.ctx, this.app, "getPerformanceApiDashboard", app_key, "ResourceApi", options, true, startTimeStr, endTimeStr);
    
    // --- 填充数据 ---
    result = result.reverse();
    
    let data = fillDateData(result, endTime, dateRange);

    return data;
  }

  /**
   * --- 统计慢请求 API 的列表 ---
   */
  public async getPerformanceApiList() {}


  // ------------------------------- 接口聚合 -------------------------------
  // --------------------------- 聚合统计慢请求次数 ---------------------------

  /**
   * --- 聚合统计慢请求次数 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getGroupPerformanceAll(
    app_key: string,
    startTime: string,
    endTime: string,
  ) {
    let res_data = await this.getGroupPerformanceApi(app_key, startTime, endTime);
    let api_data = await this.getGroupPerformanceRes(app_key, startTime, endTime);

    let res_array = res_data.data;
    let api_array = api_data.data;
    let data = aggregateGroupPerformance(res_array, api_array);
    
    return data;
  }

  /**
   * --- 聚合统计慢请求 API 出现的次数 ---
   */
  public async getGroupPerformanceApi(
    app_key: string,
    startTime: string,
    endTime: string,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "ajaxSlow",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ],
        }
      },
      raw: true,
      attributes: [
        ['response_url_hash', 'hash'],
        ['response_url', 'url'],
        [fn('COUNT', '*'), 'num'],
      ],
      order: literal('num DESC'),
      offset: PAGE_OFFSET,
      limit: LIMIT,
      group: ["hash", "url"],
    };

    let data: any = await checkIsInRedis(this.ctx, this.app,"getGroupPerformanceApi", app_key, "ResourceApi", options, true, startTimeStr, endTimeStr);

    return data;
  }

  /**
   * --- 聚合统计慢请求 资源 出现的次数 ---
   */
  public async getGroupPerformanceRes(
    app_key: string,
    startTime: string,
    endTime: string,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "slow",
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ],
        }
      },
      raw: true,
      attributes: [
        ['resource_url_hash', 'hash'],
        ['resource_url', 'url'],
        [fn('COUNT', '*'), 'num'],
      ],
      order: literal('num DESC'),
      offset: PAGE_OFFSET,
      limit: LIMIT,
      group: ["hash", "url"],
    };

    let data: any = await checkIsInRedis(this.ctx, this.app, "getGroupPerformanceRes", app_key, "Resource", options, true, startTimeStr, endTimeStr);

    return data;
  }
}
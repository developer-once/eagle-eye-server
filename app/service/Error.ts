import { Service } from 'egg';
import { fillDateData, aggregateCrash } from '../utils/index';
import { checkIsInRedis } from '../utils/checkRedis';
import { formatStartTime, formatEndTime, getDateRange } from '../utils/formatDate';
import { TEN, ONE, PAGE_SIZE, PAGE_OFFSET, LIMIT } from '../config/constValue';


const { Op, fn, col } = require("sequelize");

export default class Error extends Service {
  /**
   * --- dashboard ---
   * --- 统计七天的 Error 总合 ---
   * 以一周为维度避免查询数据因周末而波动
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getErrorDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "error",
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

    let result: any = await checkIsInRedis(this.ctx, this.app, "getErrorDashboard", app_key, "Error", options, true, startTimeStr, endTimeStr);

    // --- 填充数据 ---
    result = result.reverse();
    let data = fillDateData(result, endTime);
    
    return data;
  }

  /**
   * --- 查询错误列表 ---
   * --- 默认请求 7 天的数据 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns Object<Array>
   */
  public async getErrorList(
    app_key: any,
    startTime?: any,
    endTime?: any,
    currentPage: string = "1",
    pageSize: number = PAGE_SIZE,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ]
        }
      },
      raw: true,
      offset: ((+currentPage - ONE || PAGE_OFFSET) * pageSize) || PAGE_OFFSET,
      limit: pageSize || LIMIT,
      order: [[ 'createdAt', 'desc' ]],
    };
    const data = await this.ctx.model.Error.findAndCountAll(options);
    
    return data;
  }

  /**
   * --- 查询页面 crash ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns Object<Array>
   */
  public async getPageCrash(
    app_key: any,
    startTime?: any,
    endTime?: any,
    pageSize: number = TEN,
    currentPage: number = ONE,
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
          ]
        }
      },
      raw: true,
      offset: ((currentPage - ONE || PAGE_OFFSET) * pageSize) || PAGE_OFFSET,
      limit: pageSize || LIMIT,
      order: [[ 'createdAt', 'desc' ]],
    };

    let result: any = await checkIsInRedis(this.ctx, this.app, "getPageCrash", app_key, "Crash", options, true, startTimeStr, endTimeStr);

    // --- 填充数据 ---
    result = result.reverse();
    let data: any = fillDateData(result, endTime, dateRange);
    data = aggregateCrash(data);
    
    return data;
  }
}
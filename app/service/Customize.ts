import { Service } from 'egg';
import { checkIsInRedis } from '../utils/checkRedis';
import { formatStartTime, formatEndTime } from '../utils/formatDate';
import { PAGE_OFFSET, ONE, PAGE_SIZE, LIMIT } from '../config/constValue';

const { Op } = require("sequelize");

export default class Customize extends Service {
  /**
   * --- 查询自定义上报列表 ---
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @param { Number } pageSize
   * @param { Number } currentPage
   * @returns Object<Array>
   */
  public async getCustomizeReportList(
    app_key: any,
    startTime?: any,
    endTime?: any,
    pageSize: number = PAGE_SIZE,
    currentPage: number = ONE,
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
      offset: ((currentPage - ONE || PAGE_OFFSET) * pageSize) || PAGE_OFFSET,
      limit: pageSize || LIMIT,
      order: [[ 'createdAt', 'desc' ]],
    };

    let result: any = await checkIsInRedis(this.ctx, this.app, "getCustomizeReportList", app_key, "Report", options, true, startTimeStr, endTimeStr);

    return result;
  }
}
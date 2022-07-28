import { Service } from 'egg';
import { checkIsInRedis } from '../utils/checkRedis';
import { fillDateData } from '../utils/index';
import { createHash } from '../utils/createHash';
import { getDataInArray, contactResultHashInArray } from '../utils/getDataInArray';
import { formatStartTime, formatEndTime } from '../utils/formatDate';
import { THIRTY, PAGE_OFFSET, LIMIT } from '../config/constValue';

const { Op, fn, col, literal } = require("sequelize");

export default class Behavior extends Service {
  /**
   * --- 统计七天的 Click 总合 ---
   * 以一周为维度避免查询数据因周末而波动
   * @param { String } app_key
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getClickDashboard(
    app_key: any,
    startTime?: any,
    endTime?: any,
  ) {
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "click",
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

    let result: any = await checkIsInRedis(this.ctx, this.app, "getClickDashboard", app_key, "Click", options, true, startTimeStr, endTimeStr);
    
    // --- 填充数据 ---
    result = result.reverse();

    let data = fillDateData(result, endTime);

    return data
  }

  /**
   *  --- 根据 url 聚合页面点击事件 ---
   * @param { String } app_key
   * @param { String } url
   * @param { Number } limit
   * @param { Number } startTime
   * @param { Number } endTime
   * @returns { Object } response
   */
  public async getClickEventGroupByUrl (
    app_key: string,
    url: string,
    limit: string | number = THIRTY,
    startTime?: any,
    endTime?: any,
  ) {
    const referrer_hash = createHash(url);
    const startTimeStr = formatStartTime(startTime);
    const endTimeStr = formatEndTime(endTime);

    let options: any = {
      where: {
        app_key: app_key,
        event_type: "click",
        referrer_hash: referrer_hash,
        createdAt: {
          [Op.between]: [
            startTimeStr,
            endTimeStr,
          ],
        }
      },
      raw: true,
      attributes: [
        ['click_hash', 'hash'],
        [fn('COUNT', '*'), 'num'],
      ],
      order: literal('num DESC'),
      offset: PAGE_OFFSET,
      limit: limit || LIMIT,
      group: "hash"
    };
    
    let result: any = await checkIsInRedis(this.ctx, this.app, "getClickEventByUrl", app_key, "Click", options, true, startTimeStr, endTimeStr);
    
    const array = getDataInArray(result, 'hash');
    
    const click_dom = await this.ctx.service.common.getUrlByHash(
      app_key,
      "Click",
      "click_dom",
      "click_dom",
      startTimeStr,
      endTimeStr,
      // --- option ---
      {
        event_type: "click",
        click_hash: array,
        referrer_hash: referrer_hash,
      },
      // --- newGroupBy ---
      'click_type'
    );
    
    const contact_dom = contactResultHashInArray(click_dom, result);

    return contact_dom
  }

}
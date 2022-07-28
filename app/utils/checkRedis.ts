const moment = require("moment");
import { ONE_MINUTE_MS, SIXTY } from "../config/constValue";

/**
 * 检查数据是否存在 Redis 中
 * @param { any } ctx 
 * @param { any } app 
 * @param { String } type 
 * @param { String } app_key 
 * @param { String } model 
 * @param { any } options 
 * @param { String } startTimeStr 
 * @param { String } endTimeStr 
 * @returns 
 */
export const checkIsInRedis = async (
  ctx: any,
  app: any,
  type: string,
  app_key: string,
  model: string,
  options: any,
  isAll: boolean,
  startTimeStr?: string,
  endTimeStr?: string,
) => {
  let result: any;
  let isRequestOneMin: any;

  let redisData: any = await app.redis.get(`${type}-${app_key}`);

  if (startTimeStr && endTimeStr) {
    isRequestOneMin = checkUserRequestOneMin(startTimeStr, endTimeStr, redisData);
  }
  // ----- 如果 redis 中有数据 且是在 「1min」 直接使用 -----
  if (redisData && isRequestOneMin) {
    let data = JSON.parse(redisData);
    return data.result;
  }

  // ---- 插件是特殊的缓存，所以 redis 中有数据的情况下可以直接返回
  if (type === "plugin" && redisData) {
    let data = JSON.parse(redisData);
    return data.result
  }

  if (isAll) {
    result = await ctx.model[model].findAll(options);
  } else {
    result = await ctx.model[model].findOne(options);
  }

  // --- 设置 redis 缓存 px 为毫秒级的过期设置
  //     ex ：为键设置秒级过期时间。等同于setex
  //     px ：为键设置毫秒级过期时间。
  //     setMode（模式设置）：
  //     nx：键不存在，才可以设置成功，用于添加。等同于setnx
  //     xx：键存在，才可以设置成功，用于更新。
  await app.redis.set(`${type}-${app_key}`, JSON.stringify({
    result: result,
    startTimeStr: startTimeStr,
    endTimeStr: endTimeStr,
  }), "px", ONE_MINUTE_MS);

  return result;
};


/**
 * --- 检查请求是否在 1min 内避免消耗性能 ---
 * @param { String } startTime 
 * @param { String } endTime 
 * @param { any } redisData 
 * @returns 
 */
export const checkUserRequestOneMin = (
  startTime: string,
  endTime: string,
  redisData: string,
) => {
  if (!redisData) { return false }
  const data = JSON.parse(redisData) || {};
  const startTimeDiff = moment(startTime).diff(moment(data.startTimeStr), "seconds");
  const endTimeDiff = moment(endTime).diff(moment(data.endTimeStr), "seconds");
  if (startTimeDiff < SIXTY && endTimeDiff < SIXTY) {
    return true
  }
  return false;
};
// @ts-nocheck
const moment = require("moment");
import { ignoreRouter } from '../config/ignoreRouter';
import { FORMAT_TIME_STR } from '../config/constValue';
import errorCode from '../config/errorCode';

const appKeyList = new Set();
// --- 不存在的 App_Key ---
const errorAppKeyList = new Set();

/**
 * --- 检查参数 ---
 * --- 必须参数 app_key ---
 * --- 检查时间是否符合要求 ---
 */
module.exports = options => {
  return async function validateParams(ctx, next) {

    const { path } = ctx.request;
    if (ignoreRouter.indexOf(path) !== -1) {
      await next();
      return
    }

    // -- 1. 首先检查是否有 app_key 参数 ---
    const app_key = (ctx.request?.body?.app_key || ctx.request?.query?.app_key);
    if (!app_key) {
      ctx.logger.error(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query, "msg: 缺少 app_key");
      
      ctx.body = errorCode[100]();
      return ctx.body;
    }

    // --------- TODO 待优化 ---------
    // --------- 1. 内存缓存 会在重启之后丢失 ---------
    // --------- 2. 处理 appKeyList size 问题 ---------
    // --------- 3. 删除 appKey 之后内存释放 ---------
    // --------- 4. 数据一致性问题 mysql 删除表之后 redis 中还有数据 ---------
    // --------- 5. 数据过期问题，避免被恶意塞入非法 AppKey 内存溢出 ---------
    if (errorAppKeyList.has(app_key)) {
      ctx.logger.error(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query, "msg: app_key 不合法");

      ctx.body = errorCode[101]();
      return ctx.body;
    }

    // ---- appKeyList 中不含 app_key ----
    if (!appKeyList.has(app_key)) {
      let redisData = await ctx.app.redis.get(app_key);
      if (!redisData) {
        let data = await ctx.service.project.getProject(app_key);
        if (!data) {
          ctx.logger.error(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query, "msg: app_key 不合法");

          errorAppKeyList.add(app_key);
          ctx.body = errorCode[101]();
          return ctx.body;
        } else {
          await ctx.app.redis.set(app_key, app_key);
        }
      }
      appKeyList.add(app_key);
    }

    // -- 打印请求日志 --
    // ctx.logger.info(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query);

    // -- 检查参数是否合法 --

    // -- 过滤非法参数 --

    // 支持 options.threshold
    // if (options.threshold && ctx.length < options.threshold) return;
    await next();
  };
};
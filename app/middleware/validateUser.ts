// @ts-nocheck
const moment = require("moment");

import { FORMAT_TIME_STR } from '../config/constValue';
import { checkRouter } from '../config/ignoreRouter';
import errorCode from '../config/errorCode';

module.exports = options => {
  return async function validateUser(ctx, next) {

    const { path } = ctx.request;
    if (checkRouter.indexOf(path) === -1) {
      await next();
      return
    }

    // -- 检查 cookie 是否携带 --
    let cookie = ctx.cookies.get('eagle-eye', {
      signed: true,
      encrypt: true,
    });
    if (!cookie) {
      ctx.logger.error(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query, "msg: 请重新登录");
      ctx.body = errorCode[300]();
      
      return ctx.body;
    }
    
    // -- 查询 cookie 的内容是否正确 --
    cookie = cookie?.split("#") || [];
    const email = cookie[0] || "";
    const data = cookie[1] || "";
    const redisData = await ctx.app.redis.get(`cookie-${email}`);
    // --- 检查 redis 中是否有项目信息 ---
    if (redisData !== data) {
      ctx.logger.error(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query, "msg: 请重新登录");
      
      ctx.body = errorCode[300]();
      return ctx.body;
    }
    await next();
  };
};
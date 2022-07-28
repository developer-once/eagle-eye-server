// @ts-nocheck
const moment = require("moment");
import { ignoreRouterPermission } from '../config/ignoreRouter';
import { FORMAT_TIME_STR } from '../config/constValue';
import errorCode from '../config/errorCode';

module.exports = options => {
  return async function validatePermission(ctx, next) {
    const { path } = ctx.request;
    if (ignoreRouterPermission.indexOf(path) !== -1) {
      return next();
    }

    const app_key = (ctx.request?.body?.app_key || ctx.request?.query?.app_key);

    // ---- 获取用户 ID ----
    const data = await ctx.service.project.getProject(app_key);
    const id = data ? data?.id: "";
    if (!data || !id) {
      ctx.body = errorCode[102]();
      
      return ctx.body;
    }

    // ----- 缓存校验结果 -----
    let redisData = await ctx.app.redis.get(`${id}-${app_key}`);
    if (!redisData) {
      const hasPermission = await ctx.service.common.validateHasPermission(id);
      if (!hasPermission) {
        ctx.logger.error(`---- Api - ${path} -- log: [${moment(new Date()).format(FORMAT_TIME_STR)}]`, "params = :" , ctx.request?.body?.data || ctx.request?.query, "msg: 无权限");
        
        ctx.body = errorCode[102]();
        return ctx.body;
      } else {
        await ctx.app.redis.set(`${id}-${app_key}`, `${id}-${app_key}`);
      }
    }
    
    await next();
  };
}
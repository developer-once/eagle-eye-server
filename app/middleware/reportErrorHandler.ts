/**
 * ----------- report 上报接口错误记录 -----------
 */
// @ts-nocheck
const moment = require("moment");

import { FORMAT_TIME_STR } from '../config/constValue';

/**
 * ----------- 错误处理中间件 -----------
 */
module.exports = options => {
  return async function reportErrorHandler(ctx, next) {
    try {
      await next();
    } catch (err: any) {
      const { app } = ctx;
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      // app.emit('error', err, ctx);
      ctx.logger.error(`---- Error -- log: [${moment(new Date()).format(formatTime)}]`, err, "未捕获 JS error");

      const status = err.status || 500;

      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message;

      // 仅供参考，需按自己的业务逻辑处理。
      ctx.body = { error };
      ctx.status = status;
    }
    await next();
  };
};
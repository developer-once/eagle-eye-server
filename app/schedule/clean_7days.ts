// @ts-nocheck
const Subscription = require('egg').Subscription;
const moment = require("moment");
const { Op } = require("sequelize");

const formatTimeStr = "YYYY-MM-DD 00:00:00";

class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1d', // 1 天间隔
      type: 'all', // 指定所有的 worker 都需要执行
      immediate: true, // 启动的时候立即执行一次
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // ----- 删除 7 天前的数据 -----
    const startTimeStr = moment(new Date().getTime() - 86400 * 1000 * 7).format(formatTimeStr);
    let options: any = {
      where: {
        createdAt: {
          [Op.lt]: startTimeStr
        }
      },
    };
    this.ctx.model.Resource.destroy(options);
    this.ctx.model.ResourceApi.destroy(options);
  }
}

module.exports = UpdateCache;
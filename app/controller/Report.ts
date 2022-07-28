import BaseController from './BaseController';

/**
 * save report error msg to MYSQL
 * @param error
 */
export default class ReportController extends BaseController {
  // --- save user report ---
  public async report() {
    const { ctx } = this;
    const { userSubTable } = ctx.app.config;

    if (userSubTable) {
      this.userSubTableSave();
      return
    }
    /**
     *  直接上报，不分表
     */
    const data = ctx.request.body;
    const ip = ctx.request.ip;
    ctx.body = await ctx.service.save.saveReport(data, ip);
  }

  public async userSubTableSave() {
    const { ctx } = this;
    /**
     * 区分 PV/UV、用户上报、报错
     */
    const body = ctx.request.body;
    const ip = ctx.request.ip;
    let data: any;

    switch (body.event_type) {
      case "error":
      case "unhandledrejection":
        data = await ctx.service.save.saveError(body, ip);
        break
      case "ajaxLoad":
      case "fetchError":
      case "ajaxSlow":
        data = await ctx.service.save.savePageAjaxApi(body, ip);
        break
      case "resource":
        data = await ctx.service.save.savePageResource(body, ip);
        break
      case "uv":
      case "pv":
        data = await ctx.service.save.savePageUV(body, ip);
        break
      case "click":
        data = await ctx.service.save.savePageClick(body, ip);
        break
      default:
        data = await ctx.service.save.saveReport(body, ip);
        break;
    }

    this.success(data);
  }

  // --- save page crash ---
  public async reportCrash() {
    const { ctx } = this;
    const body = ctx.request.body;
    const data = await ctx.service.save.savePageCrash(body);
    
    this.success(data);
  }
}

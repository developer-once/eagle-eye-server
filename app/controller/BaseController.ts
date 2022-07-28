import { Controller } from 'egg';
import errorCode from '../config/errorCode';

/**
 * --- BaseController ---
 */
export default class BaseController extends Controller {

  /**
   * ----- success -----
   * @parmas data { any }
   */
  public async success(data: any, serverOpenRecord?: boolean) {
    this.ctx.body = {
      code: 200,
      data,
      msg: 'success',
      serverOpenRecord,
    };
  }

  /**
   * ----- fail -----
   * @parmas error { String }
   */
  public async fail(error: any) {
    this.ctx.body = {
      code: 500,
      msg: error || "server error",
    };
  }

  /**
   * ----- error -----
   * @param code { number }
   */
  public async error(code: any, data?: any) {
    // --- FIXME ---
    if (typeof code !== "number") {
      return this.success(code);
    }
    this.ctx.body = errorCode[code || 500](data);
  }
}

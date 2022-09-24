import BaseController from './BaseController';

/**
 * --- Create project ---
 * @controller UserController
 */
export default class UserController extends BaseController {

  /**
   * @summary Get user
   * @router post /api/get/user
   * @request query string email email
   * @request query string password password
   * @response 200 SuccessBody 返回结果
   */
  public async getUser() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;
    const data = await ctx.service.user.getUser(email, password);

    this.error(data);
  }

  // ---------------- TODO ----------------
  // 禁止注册
  // 用户数 > 1 return false=
  /**
   * @summary Create user
   * @router post /api/create/user
   * @request query string name name
   * @request query string email email
   * @request query string password password
   * @response 200 SuccessBody 返回结果
   */
  public async createUser() {
    const { ctx } = this;
    const { name, email, password } = ctx.request.body;
    const data = await ctx.service.user.createUser(name, email, password);

    this.error(data);
  }
}

import BaseController from './BaseController';

/**
 * --- Create project ---
 * @controller UserController
 */
export default class UserController extends BaseController {

  /**
   * --- Get user ---
   * @param { String } email
   * @param { String } password
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
   * --- Create user ---
   * @param { String } name
   */
  public async createUser() {
    const { ctx } = this;
    const { name, email, password } = ctx.request.body;
    const data = await ctx.service.user.createUser(name, email, password);

    this.error(data);
  }
}

import { Service } from 'egg';
import {
  COOKIE_NAME,
  ZERO,
  ONE,
  FOUR,
  FIVE,
  TWELVE,
  TWENTY_TWO,
  FIVE_MINUTE_MS,
  SEVEN_DAY_MS,
} from '../config/constValue';

const { Op } = require("sequelize");
const crypto = require('crypto');

/**
 *  User service
 */
export default class User extends Service {

  /**
   * --- 获取用户信息 ---
   * @param { string } name - user name
   * @param { string } email - user email
   * @param { string } password - user password
   */
  public async getUser(
    email: string,
    password: string,
  ) {
    let result = await this.checkUserMessage(email, password);
    
    // --- 未找到用户 或账号密码不对 ---
    if (!result) {
      return 301
    }

    await this.setUserCookie(email)
    
    return {
      email: result.result,
      name: result.name,
      id: result.id,
    }
  }

  /**
   * --- 确认用户信息 ---
   * @param email 
   * @param password 
   */
  public async checkUserMessage(
    email: string,
    password: string,
  ) {

    // ----- 5 分钟之内登录尝试超过5次则静默 5 分钟 -----
    let times: any = await this.app.redis.get(`login-${email}`);
    if (times) {
      times = parseInt(times);
    }

    if (times >= FIVE) {
      return false;
    }

    // -- 检查 用户名/邮箱 是否已经存在 --
    const option: any = {
      where: {
        email: email,
      },
    };
    const result = await this.ctx.model.User.findOne(option);
    if (!result) {
      this.app.redis.set(`login-${email}`, (times + ONE) || ONE, "px", FIVE_MINUTE_MS);

      return false;
    }
    const salt = result.salt;
    const db_hash = result.password;
    const md5 = crypto.createHash('md5');
    md5.update(password + salt);

    if (!(md5.digest('hex') === db_hash)) {

      this.app.redis.set(`login-${email}`, (times + ONE) || ONE, "px", FIVE_MINUTE_MS);

      return false;
    }

    return result;
  }

  /**
   * --- 设置用户信息进入 cookie ---
   * @param { string } email - user email
   * @param { string } password - user password
   */
  public async setUserCookie(
    email: string,
  ) {
    let cookie = crypto.randomBytes(TWELVE).toString('hex').slice(ZERO, TWENTY_TWO);
    this.ctx.cookies.set(COOKIE_NAME, `${email}#${cookie}`, {
      httpOnly: true,
      // 加密传输
      encrypt: true,
      // 登录 cookie 7 天有效
      maxAge: new Date()?.getTime() + SEVEN_DAY_MS,
      overwrite: true,
      signed: true,
    });
    await this.app.redis.set(`cookie-${email}`, cookie, "px", SEVEN_DAY_MS);
  }

  /**
   * --- 设置用户信息进入 cookie ---
   * @param { string } email - user email
   * @param { string } password - user password
   */
  public async cleanUserCookie() {
    this.ctx.cookies.set(COOKIE_NAME, "", {
      maxAge: ONE,
    });
  }

  /**
   * --- 创建用户 ---
   * @param { string } name - user name
   * @param { string } email - user email
   * @param { string } password - user password
   */
  public async createUser(
    name: string,
    email: string,
    password: string,
  ) {
    // -- 检查 用户名/邮箱 是否已经存在 --
    let option: any = {
      where: {
        [Op.or]: [
          {
            name: name,
          },
          {
            email: email,
          }
        ],        
      },
      raw: true,
    };
    const result = await this.ctx.model.User.count(option);
    if (result) {
      return 110;
    }
    
    const salt = crypto.randomBytes(FOUR).toString('hex');
    const md5 = crypto.createHash('md5');
    md5.update(password + salt);

    await this.ctx.model.User.create({
      name: name,
      email: email,
      password: md5.digest('hex'),
      salt: salt,
    });
    await this.setUserCookie(email)

    return 200;
  }
}

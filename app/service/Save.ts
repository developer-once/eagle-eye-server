import { Service } from 'egg';
import { createHash } from '../utils/createHash';
import { ZERO, MAX_SAVE_DB_NUMBER } from '../config/constValue';

let PV_ARRAY: any = [];
let ERROR_ARRAY: any = [];
let REPORT_ARRAY: any = [];
let CLICK_ARRAY: any = [];
let RESOURCE_ARRAY: any = [];
let AJAX_ARRAY: any = [];

export default class Save extends Service {
  /**
   * @description 页面 Error 上报
   * @param error FE error
   * @returns result
   */
  public async saveError(data: any, ip: string) {
    if (data.resourceLoading?.length) {
      this.savePerformance(data.resourceLoading, data.app_key);
    }
    const referrer_hash = createHash(data.url);

    ERROR_ARRAY.push({
      // ---- Base ----
      event_type: data.event_type,
      app_key: data.app_key,
      uuid: data.uuid,
      ip: ip,
      record: JSON.stringify(data.record),

      // ---- Error ----
      error_msg_filename: data?.error?.filename,
      error_msg_line: data?.error?.line,
      error_msg_message: data?.error?.message,
      error_stack: data?.error?.stack,
      error_fingerprint: data?.error.fingerprint,

      // ---- Browser ----
      referrer: data.url,
      referrer_hash: referrer_hash,
      user_agent: data.userAgent,
      platform: data.platform,
      language: data.language,
      app_name: data.appName,
      app_version: data.appVersion,
      
      // ---- User ----
      user_id: data.user_id,
    });

    if (ERROR_ARRAY.length >= MAX_SAVE_DB_NUMBER) {
      this.ctx.model.Error.bulkCreate(ERROR_ARRAY);
      
      ERROR_ARRAY.splice(ZERO, ERROR_ARRAY?.length);
    }

    return 200
  }

  /**
   * @description 保存用户自定义上报
   * @param data user report data
   * @returns result
   */
  public async saveReport(data: any, ip: string) {
    if (data.resourceLoading?.length) {
      this.savePerformance(data.resourceLoading, data.app_key);
    }
    const referrer_hash = createHash(data.url);

    REPORT_ARRAY.push({
      // ---- Base ----
      event_type: data.event_type,
      app_key: data.app_key,
      uuid: data.uuid,
      ip: ip,

      // ---- Report ----
      data: JSON.stringify(data?.detail || {}),

      // ---- Browser ----
      referrer: data.url,
      referrer_hash: referrer_hash,
      user_agent: data.userAgent,
      platform: data.platform,
      language: data.language,
      app_name: data.appName,
      app_version: data.appVersion,

      // ---- User ----
      user_id: data.user_id,
    });

    if (REPORT_ARRAY.length >= 5) {
      this.ctx.model.Report.bulkCreate(REPORT_ARRAY);

      REPORT_ARRAY.splice(ZERO, REPORT_ARRAY?.length);
    }

    return 200
  }
  
  /**
   * @description 用户页面点击事件
   * @param data user report data
   * @returns result
   */
  public async savePageClick(data: any, ip: string) {

    data?.data?.map((item: any) =>  {
      const referrer_hash = createHash(item.referrer);
      const click_hash = createHash(`${item.click?.dom?.type}-${item.click?.dom?.id}`);

      CLICK_ARRAY.push({
        // ---- Base ----
        event_type: item.event_type,
        app_key: item.app_key,
        uuid: item.uuid,
        ip: ip,

        // ---- Click ----
        click_dom: item.click?.dom?.id,
        click_type: item.click?.dom?.type,
        click_hash: click_hash,

        // ---- Browser ----
        referrer: item.referrer,
        referrer_hash: referrer_hash,
        
        // ---- User ----
        user_id: item.user_id,
      });
    })

    if (CLICK_ARRAY.length >= 10) {
      this.ctx.model.Click.bulkCreate(CLICK_ARRAY);

      CLICK_ARRAY.splice(ZERO, CLICK_ARRAY?.length);
    }
    
    return 200
  }

  /**
   * @description 页面 PV/UV 统计
   * @param data user report data
   * @returns result
   */
  public async savePageUV(data: any, ip: string) {
    if (data.resourceLoading?.length) {
      this.savePerformance(data.resourceLoading, data.app_key);
    }

    const app_version_hash = createHash(data.appVersion);
    const referrer_hash = createHash(data.url);
    const user_agent_hash = createHash(data.userAgent);

    PV_ARRAY.push({
      // ---- Base ----
      event_type: data.event_type,
      app_key: data.app_key,
      ip: ip,
      uuid: data.uuid,

      // ---- Pages ----
      view_type: data.view?.type,

      // ---- Browser ----
      referrer: data.url,
      referrer_hash: referrer_hash,
      user_agent: data.userAgent,
      user_agent_hash: user_agent_hash,
      platform: data.platform,
      language: data.language,
      app_name: data.appName,
      app_version: data.appVersion,
      app_version_hash: app_version_hash,
      
      // ---- User ----
      user_id: data.user_id,
    });

    if (PV_ARRAY.length >= MAX_SAVE_DB_NUMBER) {
      this.ctx.model.Page.bulkCreate(PV_ARRAY);

      PV_ARRAY.splice(ZERO, PV_ARRAY?.length);
    }

    return 200
  }

  /**
   * @description 页面资源加载错误
   * @param data user report data
   * @returns result
   */
  public async savePageResource(data: any, ip: string) {

    const resource_url_hash = createHash(data.resource?.src);
    const referrer_hash = createHash(data.url);

    RESOURCE_ARRAY.push({
      // ---- Base ----
      event_type: data.event_type,
      app_key: data.app_key,
      uuid: data.uuid,
      ip: ip,

      // ---- Resource ----
      resource_url: data.resource?.src,
      resource_url_hash: resource_url_hash,

      // ---- Browser ----
      referrer: data.url,
      referrer_hash: referrer_hash,
      user_agent: data.userAgent,
      platform: data.platform,
      language: data.language,
      app_name: data.appName,
      app_version: data.appVersion,
    });

    if (RESOURCE_ARRAY.length >= MAX_SAVE_DB_NUMBER) {
      this.ctx.model.Resource.bulkCreate(RESOURCE_ARRAY);

      RESOURCE_ARRAY.splice(ZERO, RESOURCE_ARRAY?.length);
    }
    
    
    return 200
  }

  /**
   * @description 页面接口请求错误
   * @param data user report data
   * @returns result
   */
   public async savePageAjaxApi(data: any, ip: string) {
     
    const response_url_hash = createHash(data?.ajax?.responseUrl);
    const referrer_hash = createHash(data.url);

    AJAX_ARRAY.push({
      // ---- Base ----
      event_type: data.event_type,
      app_key: data.app_key,
      uuid: data.uuid,
      ip: ip,

      // ---- ResourceApi ----
      response_url: data?.ajax?.responseUrl,
      response_url_hash: response_url_hash,
      api_cost: data?.ajax?.apiCost,
      api_method: data?.ajax?.method,
      api_response: data?.ajax?.response,
      api_status: data?.ajax?.status,

      // ---- Browser ----
      referrer: data.url,
      referrer_hash: referrer_hash,
      user_agent: data.userAgent,
      platform: data.platform,
      language: data.language,
      app_name: data.appName,
      app_version: data.appVersion,
    });

    if (AJAX_ARRAY.length >= MAX_SAVE_DB_NUMBER) {
      this.ctx.model.ResourceApi.bulkCreate(AJAX_ARRAY);

      AJAX_ARRAY.splice(ZERO, AJAX_ARRAY?.length);
    }
    
    return 200
  }

  /**
   * @description 慢资源加载上报
   * @param performance { Object }
   * @returns result
   */
  public async savePerformance(data: any, app_key: string) {
    
    // ---- 遍历找出需要保存的慢资源 ----
    data.forEach((item: any) => {
      // ---- 慢资源加载 ----
      if (item.initiatorType !== 'xmlhttprequest' && item.initiatorType !== 'fetch') {
        item.app_key = app_key;
        RESOURCE_ARRAY.push(item);
      } else {
        // ---- 慢请求 ----
        item.app_key = app_key;
        AJAX_ARRAY.push(item);
      }
    });

    // ---- 慢资源 ----
    if (RESOURCE_ARRAY.length >= MAX_SAVE_DB_NUMBER) {
      this.ctx.model.Resource.bulkCreate(RESOURCE_ARRAY);

      RESOURCE_ARRAY.splice(ZERO, RESOURCE_ARRAY?.length);
    }

    // ---- 慢请求 ----
    if (AJAX_ARRAY.length >= MAX_SAVE_DB_NUMBER) {
      this.ctx.model.ResourceApi.bulkCreate(AJAX_ARRAY);

      AJAX_ARRAY.splice(ZERO, AJAX_ARRAY?.length);
    }

    return 200
  }

  /**
   * @description 页面崩溃记录
   * @param performance { Object }
   * @returns result
   */
  public async savePageCrash(data: any) {
    this.ctx.model.Crash.create({
      app_key: data.app_key,
      origin: data.origin,
    });
    return 200
  }
}

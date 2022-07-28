const moment = require("moment");

/**
 * --- 填充数据 ---
 */
export const fillDateData = (result: any, endTime: any, dateRange: number = 0) => {
  const arrayTimeStr = "YYYY-MM-DD";
  let current = 0;
  
  let data = new Array((dateRange + 1) || 7).fill({}).map((item: any, index: number) => {
    let days = moment(new Date(endTime).getTime() - 86400 * 1000 * index).format(arrayTimeStr);
    if (days === result[current]?.days || days === result[current]?.days) {
      current += 1;
      return result[current - 1] || result[current - 1]
    }
    return  {
      days: moment(new Date(endTime).getTime() - 86400 * 1000 * index).format(arrayTimeStr),
      nums: 0,
      ...item,
    }
  }).reverse();
  return data;
};

/**
 * --- UV/PV 聚合 ---
 */
export const aggregateData = (uv_data: any, pv_data: any) => {
  let date: any = [];
  let pv: any = [];
  let uv: any = [];
  uv_data.forEach((item: any, index: number) => {
    date.push(item.days);
    uv.push(item.nums);
    pv.push(pv_data[index].nums);
  });
  return {
    date: date,
    pv: pv,
    uv: uv,
  }
};

/**
 * --- 整站 Res/API 慢请求聚合 ---
 */
export const aggregatePerformanceData = (res_data: any, api_data: any) => {
  let date: any = [];
  let res: any = [];
  let api: any = [];
  res_data.forEach((item: any, index: number) => {
    date.push(item.days);
    res.push(item.nums);
    api.push(api_data[index].nums);
  });
  return {
    date: date,
    res: res,
    api: api,
  }
};

/**
 * --- Crash 聚合 ---
 */
export const aggregateCrash = (res_data: any) => {
  let date: any = [];
  let res: any = [];
  res_data.forEach((item: any) => {
    date.push(item.days);
    res.push(item.nums);
  });
  return {
    date: date,
    res: res,
  }
};

/**
 * --- 接口聚合 Res/API 慢请求 ---
 */
export const aggregateGroupPerformance = (
  res_data: any,
  api_data: any
) => {
  let max = Math.max(res_data?.length, api_data?.length);
  let res: any = [];
  let api: any = [];
  for (let i = 0; i < max; i++) {
    res.push({
      url: res_data[i]?.url || "",
      num: res_data[i]?.num || 0,
    });
    api.push({
      url: api_data[i]?.url || "",
      num: api_data[i]?.num || 0
    });
  }
  return {
    res: res,
    api: api,
  }
}
import { SIXTY_DAY_MS, FORMAT_TIME_STR } from '../config/constValue';

const moment = require("moment");

// ------ 获取开始时间 -----
export const formatStartTime = (startTime: string) => {
  return moment(startTime  || new Date().getTime() - SIXTY_DAY_MS).format(FORMAT_TIME_STR);
};

// ------ 获取结束时间 -----
export const formatEndTime = (endTime: string) => {
  return moment(endTime || new Date()).format(FORMAT_TIME_STR);
}

// ------ 获取时间范围 -----
export const getDateRange = (endTime: string, startTime: string) => {
  return moment(endTime).diff(startTime, 'day');
}
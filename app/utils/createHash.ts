const crypto = require('crypto');

/**
 * ---- 生成 hash ----
 * @param { String } data
 * @returns { String } hash
 */
export const createHash = (data: string) => {
  let data_hash = crypto.createHash('md5');
  
  return data_hash.update(data).digest('hex')
};
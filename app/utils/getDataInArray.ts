// @ts-nocheck
/**
 * ----- 在数组中找到对应值 -----
 * @param data 
 * @param name 
 * @returns 
 */
export const getDataInArray = (data: any, name: string) => {
  
  let array = [];
  data?.forEach((item: any) => {
    array.push(item[name]);
  });

  return array;
}

/**
 * ----- 合并两个数组 ----
 */
export const contactResultHashInArray = (array: any, array2: any) => {
  const length = Math.max(array?.length, array2.length);
  let data = [];
  for (let i = 0; i < length; i++) {
    data.push({
      ...array[i],
      ...array2[i],
    })
  }

  return data
}

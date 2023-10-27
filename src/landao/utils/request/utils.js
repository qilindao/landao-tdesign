import { isObject, isString } from "lodash-es";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function joinTimestamp(join, restful = false) {
  if (!join) {
    return restful ? "" : {};
  }
  const now = new Date().getTime();

  if (restful) {
    return `?_t=${now}`;
  }
  return { _t: now };
}
/**
 * 格式化提交参数时间
 * @param {*} params
 * @returns
 */
export function formatRequestDate(params) {
  if (Object.prototype.toString.call(params) !== "[object object]") {
    return;
  }
  for (const key in params) {
    if (params[key] && params[key]._isAMomentObject) {
      params[key] = params[key].format(DATE_TIME_FORMAT);
    }
    if (isString(key)) {
      const value = params[key];
      if (value) {
        try {
          params[key] = isString(value) ? value.trim() : value;
        } catch (error) {
          throw new Error(error);
        }
      }
    }
    if (isObject(params[key])) {
      formatRequestDate(params[key]);
    }
  }
}

/**
 * 将对象转为Url参数
 * @param {*} baseUrl
 * @param {*} obj
 * @returns
 */
export function setObjToUrlParams(baseUrl, obj) {
  let parameters = "";
  for (const key in obj) {
    parameters += `${key}=${encodeURIComponent(obj[key])}&`;
  }
  parameters = parameters.replace(/&$/, "");
  return /\?$/.test(baseUrl)
    ? baseUrl + parameters
    : baseUrl.replace(/\/?$/, "?") + parameters;
}

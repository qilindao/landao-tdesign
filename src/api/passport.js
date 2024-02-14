import { request } from "@/landao/utils/request";

const Api = {
  GetCaptcha: "/v1/passport/captcha",
  Login: "/v1/passport/login",
  Logout: "/v1/passport/logout",
};

/**
 * 图片验证码
 * @returns
 */
export function getCaptcha() {
  return request.get({ url: Api.GetCaptcha });
}

/**
 * 机构用户登录
 * @param {Object} params
 * @returns
 */
export function doLogin(params) {
  return request.post({ url: Api.Login, data: params });
}

/**
 * 退出登录
 * @returns
 */
export function doLogout() {
  return request.post({ url: Api.Logout });
}

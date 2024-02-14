import { request } from "@/landao/utils/request";

const Api = {
  GetUserInfo: "/v1/profile",
  GetRulesList: "/v1/profile/rules",
};
export function getUserProfile() {
  return request.get({
    url: Api.GetUserInfo,
  });
}

export function getUserRules() {
  return request.get({
    url: Api.GetRulesList,
  });
}

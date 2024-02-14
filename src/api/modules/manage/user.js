import { request } from "@/landao/utils/request";

const Api = {
  lists: "/v1/account",
  read: "/v1/account/read",
  add: "/v1/account/store",
  update: "/v1/account/update",
  delete: "/v1/account/delete",
};
/**
 * 获取用户列表
 * @returns
 */
export function getUserList() {
  return request.get({
    url: Api.lists,
  });
}

/**
 * 新增用户
 * @param {*} params
 * @returns
 */
export function addUser(params) {
  return request.post({ url: Api.add, params });
}

/**
 * 更新用户
 * @param {Number} manageId 用户id
 * @param {Object} params
 * @returns
 */
export function updateUser(manageId, params) {
  return request.put({ url: `${Api.update}/${manageId}`, params });
}

/**
 * 删除用户
 * @param {Number} manageId
 * @returns
 */
export function deleteUser(manageId) {
  return request.delete({ url: `${Api.delete}/${manageId}` });
}

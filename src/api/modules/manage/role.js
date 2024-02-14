import { request } from "@/landao/utils/request";

const Api = {
  pages: "/v1/role",
  lists: "/v1/role/list",
  add: "/v1/role/store",
  update: "/v1/role/update",
  delete: "/v1/role/delete",
  updateAuth: "/v1/role/update/auth",
};

/**
 * 获取分页
 * @returns
 */
export function getRolePage(params) {
  return request.get({
    url: Api.pages,
    params,
  });
}
/**
 * 获取角色列表
 * @returns
 */
export function getRoleList() {
  return request.get({
    url: Api.lists,
  });
}

/**
 * 新增角色
 * @param {*} params
 * @returns
 */
export function addRole(params) {
  return request.post({ url: Api.add, params });
}

/**
 * 更新角色
 * @param {Number} roleId 角色id
 * @param {Object} params
 * @returns
 */
export function updateRole(roleId, params) {
  return request.put({ url: `${Api.update}/${roleId}`, params });
}

/**
 * 删除角色
 * @param {Number} roleId
 * @returns
 */
export function deleteRole(roleId) {
  return request.delete({ url: `${Api.delete}/${roleId}` });
}

/**
 * 更新角色权限
 * @param {Number} roleId 角色id
 * @param {Array} menuIds 权限ids
 * @returns
 */
export function updateRoleAuth(roleId, menuIds) {
  const params = { menus: menuIds };
  return request.post({ url: `${Api.updateAuth}/${roleId}`, params });
}

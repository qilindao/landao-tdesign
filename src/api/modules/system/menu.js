import { request } from "@/landao/utils/request";

const Api = {
  lists: "/v1/menu",
  authPowerList: "/v1/menu/power",
  add: "/v1/menu/store",
  update: "/v1/menu/update",
  delete: "/v1/menu/delete",
};
/**
 * 获取菜单权限
 * @returns
 */
export function getMenuList() {
  return request.get({
    url: Api.lists,
    requestOptions: {
      ignoreCancelToken: true,
    },
  });
}

/**
 * 获取Api权限规则
 * @returns
 */
export function getAuthPower() {
  return request.get({
    url: Api.authPowerList,
  });
}

/**
 * 新增菜单
 * @param {*} params
 * @returns
 */
export function addMenu(params) {
  return request.post({ url: Api.add, params });
}

/**
 * 更新菜单
 * @param {Number} menuId 菜单id
 * @param {Object} params
 * @returns
 */
export function updateMenu(menuId, params) {
  return request.put({ url: `${Api.update}/${menuId}`, params });
}

/**
 * 删除菜单
 * @param {Number} menuId
 * @returns
 */
export function deleteMenu(menuId) {
  return request.delete({ url: `${Api.delete}/${menuId}` });
}

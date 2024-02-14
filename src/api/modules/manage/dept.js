import { request } from "@/landao/utils/request";

const Api = {
  lists: "/v1/dept",
  add: "/v1/dept/store",
  update: "/v1/dept/update",
  delete: "/v1/dept/delete",
};
/**
 * 获取部门列表
 * @returns
 */
export function getDeptList() {
  return request.get({
    url: Api.lists,
  });
}

/**
 * 新增部门
 * @param {*} params
 * @returns
 */
export function addDept(params) {
  return request.post({ url: Api.add, params });
}

/**
 * 更新部门
 * @param {Number} deptId 部门id
 * @param {Object} params
 * @returns
 */
export function updateDept(deptId, params) {
  return request.put({ url: `${Api.update}/${deptId}`, params });
}

/**
 * 删除部门
 * @param {Number} deptId
 * @returns
 */
export function deleteDept(deptId) {
  return request.delete({ url: `${Api.delete}/${deptId}` });
}

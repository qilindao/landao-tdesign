import { isString } from "lodash-es";
import { usePermissionStore } from "@/store";

/**
 * 页面按钮级权限判断
 * @returns
 */
export function usePermission() {
  /**
   * 校验登录用户是否拥有该权限
   * @param {*} permission
   * @returns
   */
  const hasPermission = (permission) => {
    //TODO：此处根据实际情况修改
    return usePermissionStore().power.some((value) => {
      return value === permission;
    });
  };

  /**
   * 判断用户是否拥有权限
   * @param {String | Array} value
   * @returns
   */
  const hasAuth = (value) => {
    if (!value) {
      return true;
    }
    return isString(value)
      ? hasPermission(value)
      : value.some((item) => {
          return hasPermission(item);
        });
  };

  /**
   *
   * @param {Array} value
   * @returns
   */
  const hasAuthAll = (value) => {
    return value.every((item) => {
      return hasPermission(item);
    });
  };

  return { hasAuth, hasAuthAll };
}

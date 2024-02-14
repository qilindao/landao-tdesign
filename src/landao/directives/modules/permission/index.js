import { usePermission } from "@/landao/hooks";

/**
 * 页面按钮权限指令
 * @param {*} app
 */
export const Permission = (app) => {
  const { hasAuth, hasAuthAll } = usePermission();
  app.directive("auth", {
    mounted: (el, binding) => {
      if (!hasAuth(binding.value)) {
        el.parentNode.removeChild(el);
      }
    },
  });
  app.directive("auth-all", {
    mounted: (el, binding) => {
      if (!hasAuthAll(binding.value)) {
        el.parentNode.removeChild(el);
      }
    },
  });
};

import { usePermission } from "@/landao/hooks";

/**
 * 设置元素高度和滚动条
 * @param {*} el
 * @param {*} binding
 */
function setDomHeight(el, binding, isFix = false) {
  const top = el.offsetTop;
  const bottom = binding?.value?.bottom || 24;
  const pageHeight = window.innerHeight;
  el.style.height = pageHeight - top - bottom + "px";
  if (isFix) {
    /** 适用于普通div */
    el.style.overflowY = "scroll";
  }
}

/**
 * vue 指令
 * @param {*} app
 */
export function directives(app) {
  /**
   * 页面按钮权限指令
   */
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

  /**
   * 为了表格页面统一，让页码组件停留在页面底部，选择设置height，而不是max-height。
   */
  app.directive("adaptive", {
    mounted: (el, binding) => {
      el.resizeListener = () => {
        setDomHeight(el, binding, true);
      };
      setDomHeight(el, binding, true);
      /** 页面缩放，重新调整高度 */
      window.addEventListener("resize", el.resizeListener);
    },
    updated(el, binding) {
      setDomHeight(el, binding, true);
    },
    unmounted(el) {
      window.removeEventListener("resize", el.resizeListener);
    },
  });

  app.directive("height", {
    mounted: (el, binding) => {
      el.resizeListener = () => {
        setDomHeight(el, binding);
      };
      setDomHeight(el, binding);
      /** 页面缩放，重新调整高度 */
      window.addEventListener("resize", el.resizeListener);
    },
    updated(el, binding) {
      setDomHeight(el, binding);
    },
    unmounted(el) {
      window.removeEventListener("resize", el.resizeListener);
    },
  });
}

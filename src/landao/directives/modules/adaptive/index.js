import { nextTick } from "vue";
/**
 * 设置 table 高度
 * @param {*} el
 * @param {*} binding
 */
const setHeight = (el, binding) => {
  const top = Number(el.previousSibling.offsetHeight ?? 0) + 88; // 88px为本项目layout中tags标签的高度和header的高度
  const bottom = binding?.value?.bottom || 48; //48px为vxe-pager的高度
  const pageHeight = window.innerHeight; //整个屏幕的高度
  //1. 当表格在模态框中使用时
  if (el.parentElement.getAttribute("class") == "vxe-modal--content") {
    el.style.height = el.parentElement.clientHeight - top - bottom - 14 + "px";
    // 14px 是vxe-model的默认padding
  } else {
    //2. 当表格在普通页面使用时
    el.style.height = pageHeight - top - bottom + "px";
  }
  el.style.overflowY = "auto";
};

/**
 * 为了表格页面统一，让页码组件停留在页面底部，选择设置height，而不是max-height。
 * @param {*} app
 */
export const Adaptive = (app) => {
  app.directive("adaptive", {
    mounted: (el, binding) => {
      el.resizeListener = () => {
        nextTick(() => {
          setHeight(el, binding);
        });
      };
      nextTick(() => {
        setHeight(el, binding);
      });
      // 页面缩放，重新调整高度
      window.addEventListener("resize", el.resizeListener);
    },
    unmounted(el) {
      window.removeEventListener("resize", el.resizeListener);
    },
    updated(el, binding) {
      nextTick(() => {
        setHeight(el, binding);
      });
    },
  });
};

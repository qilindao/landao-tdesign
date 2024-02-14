import "./ripple.less";

const RIPPLE_NAME = "ripple";
/**
 * 点击产生水波纹效果
 *
 * @author https://mp.weixin.qq.com/s/82Ti_mssuLZohUCSQeRYYQ
 * @param {*} el
 * @param {*} e
 */
const createRipple = (el, e) => {
  // 设置按钮overflow
  el.style.overflow = "hidden";
  // 获取按钮的长宽
  const { clientWidth, clientHeight } = el;
  // 算出直径
  const diameter = Math.ceil(Math.sqrt(clientWidth ** 2 + clientHeight ** 2));
  // 算出半径
  const radius = diameter / 2;
  // 获取按钮的全局坐标
  const { left, top } = el.getBoundingClientRect();
  // 设置按钮的定位是relative
  const position = el.style.position;
  if (!position || position === "static") {
    el.style.position = "relative";
  }
  // 获取鼠标点击全局坐标
  const { clientX, clientY } = e;

  // 创建一个圆dom
  const rippleEle = document.createElement("div");
  // 设置唯一标识id
  rippleEle.id = RIPPLE_NAME;
  // 设置长宽
  rippleEle.style.width = rippleEle.style.height = `${diameter}px`;
  rippleEle.style.left = `${clientX - radius - left}px`;
  rippleEle.style.top = `${clientY - radius - top}px`;
  // 插入圆dom
  el.appendChild(rippleEle);
};
const removeRipple = (el) => {
  // 删除圆dom
  const rippleEle = el.querySelector(`#${RIPPLE_NAME}`);
  if (rippleEle) {
    el.removeChild(rippleEle);
  }
};
/**
 * 元素点击涟漪指令
 */
export const Ripple = (app) => {
  app.directive("ripple", {
    mounted(el) {
      // 绑定点击事件
      el.addEventListener("click", (e) => {
        removeRipple(el);
        createRipple(el, e);
      });
    },
    unmounted(el) {
      // 组件卸载时记得删了
      removeRipple(el);
    },
  });
};

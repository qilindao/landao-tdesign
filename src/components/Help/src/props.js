export default {
  /** 提示内容 */
  content: {
    type: [String, Array],
    default: "",
  },
  /** 图标名字，依赖 t-icon 组件 */
  icon: {
    type: String,
    default: "help-circle",
  },
  /** 图标大小，依赖 t-icon 组件 */
  iconSize: {
    type: [String, Number],
    default: "medium",
  },
  /** Tooltip 组件出现的位置 */
  placement: {
    type: String,
    type: String,
    default: "top",
    validator(val) {
      if (!val) return true;
      return [
        "top",
        "top-left",
        "top-right",
        "bottom",
        "bottom-left",
        "bottom-right",
        "left",
        "left-top",
        "left-bottom",
        "right",
        "right-top",
        "right-bottom",
      ].includes(val);
    },
  },
  /** 【废弃，适用 el】 content 中的内容是否作为 HTML 字符串处理 */
  rawContent: { type: Boolean, default: false },
  /** 文字提示风格 */
  theme: {
    type: String,
    default: "default",
    validator(val) {
      if (!val) return true;
      return [
        "default",
        "primary",
        "success",
        "danger",
        "warning",
        "light",
      ].includes(val);
    },
  },
  /** 【议案讨论中】延迟出现提示，用于异步加载提示信息需要延迟显示的业务场景下 */
  delay: {
    type: Number,
  },
  /** 是否在关闭浮层时销毁浮层 */
  destroyOnClose: {
    type: Boolean,
    default: true,
  },
  /** 用于设置提示默认显示多长时间之后消失，初始第一次有效，单位：毫秒 */
  duration: {
    type: Number,
  },
  /** 是否显示浮层箭头 */
  showArrow: {
    type: Boolean,
    default: true,
  },
  /**为数组时，是否显示序号 */
  showIndex: { type: Boolean, default: false },
};

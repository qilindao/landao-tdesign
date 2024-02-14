export const FooterProps = {
  confirmLoading: { type: Boolean }, //提交按钮loading
  /**
   * @description 显示关闭按钮
   */
  isShowCancelBtn: { type: Boolean, default: true },
  cancelButtonProps: {
    type: Object,
    default: () => {
      return {};
    },
  },
  cancelText: { type: String, default: "取消" },
  /**
   * @description 显示关闭按钮
   */
  isShowOkBtn: { type: Boolean, default: true }, //是否显示底部确认按钮
  okButtonProps: {
    type: Object,
    default: () => {
      return {};
    },
  },
  okText: { type: String, default: "确认" },
  okType: { type: String, default: "primary" },
  footerAlign: {
    type: String,
    default: "right",
    validator(value) {
      return ["left", "center", "right"].includes(value);
    },
  }, //底部按钮位置
};
export const DrawerProps = {
  visible: { type: Boolean }, //显示隐藏
  loading: { type: Boolean },
  title: { type: String, default: "" }, //标题
  closeFunc: {
    type: [Function, Object],
    default: null,
  },
  isDetail: { type: Boolean },
  showDetailBack: { type: Boolean, default: true },
  /** 抽屉方向 */
  placement: {
    type: String,
    default: "right",
    validator(val) {
      if (!val) return true;
      return ["left", "right", "top", "bottom"].includes(val);
    },
  },
  ...FooterProps,
};

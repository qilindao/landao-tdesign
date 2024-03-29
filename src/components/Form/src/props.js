import VueTypes from "vue-types";
import { oneOf } from "vue-types";

export const basicProps = {
  schemas: {
    //表单配置项
    type: Array,
    default: () => [],
  },
  fieldMapToTime: {
    type: Array,
    default: () => [],
  },
  // 转化时间
  transformDateFunc: {
    type: Function,
    default: (date) => {
      return date?.format?.("YYYY-MM-DD HH:mm:ss") ?? date;
    },
  },
  showActionButtonGroup: VueTypes.bool.def(true), //是否显示操作按钮(重置/提交)
  showSubmitButton: VueTypes.bool.def(true), //是否显示提交按钮
  showResetButton: VueTypes.bool.def(true), //是否显示重置按钮
  actionColOptions: VueTypes.object.def({}), //操作按钮外层 Col 组件配置，如果开启 showAdvancedButton，则不用设置
  resetButtonOptions: VueTypes.object.def({}),
  submitButtonOptions: VueTypes.object.def({}),
  disabled: VueTypes.bool.def(false), //是否禁用该表单内的所有组件
  //el-form 自带属性
  labelAlign: oneOf(["right", "left", "top"]).def("right"), //表单域标签的位置
  labelWidth: [String, Number],
  layout: oneOf(["vertical", "inline"]).def("vertical"),
  // size: oneOf(["large", "default", "small"]).def("default"), //用于控制该表单内组件的尺寸
  showAdvancedButton: VueTypes.bool.def(false), //是否显示展开收起按钮
  autoAdvancedLine: VueTypes.number.def(3), // 超过3行自动折叠
};

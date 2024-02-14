import { isNumber } from "lodash-es";

function genType() {
  return ["DatePicker", "DateRangePicker", "TimePicker", "TimeRangePicker"];
}

export const defaultValueComponents = ["Input", "TextArea"];
/**
 * 时间字段
 */
export const dateItemType = genType();
/**
 * 生成 placeholder
 * @param {String} component  组件名称
 * @returns
 */
export function createPlaceholderMessage(component) {
  if (component.includes("Input")) {
    return "请输入";
  }
  if (
    component.includes("DatePicker") ||
    component.includes("DateRangePicker") ||
    component.includes("TimePicker") ||
    component.includes("TimeRangePicker") ||
    component.includes("Select") ||
    component.includes("Cascader") ||
    component.includes("ApiCascader") ||
    component.includes("ApiSelect")
  ) {
    return "请选择";
  }
  return "";
}

export function handleInputNumberValue(component, val) {
  if (!component) return val;
  if (["Input", "TextArea", "InputAdornment"].includes(component)) {
    return val && isNumber(val) ? `${val}` : val;
  }
  return val;
}

export const simpleComponents = ["Divider", "BasicTitle"];
/**
 * 无需操作 components
 * @param {*} component 
 * @returns 
 */
export function isIncludeSimpleComponents(component) {
  return simpleComponents.includes(component || "");
}

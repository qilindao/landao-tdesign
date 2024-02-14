import {
  Input,
  Switch,
  Radio,
  RadioGroup,
  InputNumber,
  Cascader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Select,
  AutoComplete,
  Textarea,
  DatePicker,
  DateRangePicker,
  TimePicker,
  TimeRangePicker,
  TagInput,
  RangeInput,
  TreeSelect,
  Transfer,
  SelectInput,
} from "tdesign-vue-next";

import ApiSelect from "./components/ApiSelect";
import RadioButtonGroup from "./components/RadioButtonGroup";
import ApiTreeSelect from "./components/ApiTreeSelect";
import ApiCascader from "./components/ApiCascader";

const componentMap = new Map();
componentMap.set("Input", Input);
componentMap.set("Textarea", Textarea);
componentMap.set("Switch", Switch);
componentMap.set("AutoComplete", AutoComplete);
componentMap.set("TagInput", TagInput);
componentMap.set("RangeInput", RangeInput);

componentMap.set("Radio", Radio);
componentMap.set("RadioGroup", RadioGroup);
componentMap.set("RadioButtonGroup", RadioButtonGroup);

componentMap.set("InputNumber", InputNumber);
componentMap.set("Cascader", Cascader);
componentMap.set("Checkbox", Checkbox);
componentMap.set("CheckboxGroup", CheckboxGroup);

componentMap.set("ApiCascader", ApiCascader);

componentMap.set("ApiSelect", ApiSelect);
componentMap.set("ApiTreeSelect", ApiTreeSelect);
componentMap.set("Select", Select);
componentMap.set("SelectInput", SelectInput);
componentMap.set("TreeSelect", TreeSelect);
componentMap.set("Transfer", Transfer);

componentMap.set("DatePicker", DatePicker);
componentMap.set("DateRangePicker", DateRangePicker);
componentMap.set("TimePicker", TimePicker);
componentMap.set("TimeRangePicker", TimeRangePicker);

componentMap.set("Divider", Divider);

/**
 * 添加组件
 * @param {String} compName
 * @param {VNode} component
 */
export function add(compName, component) {
  componentMap.set(compName, component);
}

/**
 * 移除组件
 * @param {String} compName
 */
export function del(compName) {
  componentMap.delete(compName);
}
export { componentMap };

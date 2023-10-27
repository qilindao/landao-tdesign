import { unref, toRaw } from "vue";
import {
  isNullOrUnDef,
  isNotEmpty,
  isObject,
  isString,
  isArray,
  isFunction,
} from "@/landao/utils/is";
import { dateUtil } from "@/landao/utils/date";
import { get, unset, set, cloneDeep } from "lodash-es";

/**
 * @desription deconstruct array-link key. This method will mutate the target.
 */
function tryDeconstructArray(key, value, target) {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(",");
      value = Array.isArray(value) ? value : [value];
      keys.forEach((k, index) => {
        set(target, k.trim(), value[index]);
      });
      return true;
    }
  }
}

/**
 * @desription deconstruct object-link key. This method will mutate the target.
 */
function tryDeconstructObject(key, value, target) {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(key)) {
    const match = key.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(",");
      value = isObject(value) ? value : {};
      keys.forEach((k) => {
        set(target, k.trim(), value[k.trim()]);
      });
      return true;
    }
  }
}

/**
 *
 * @param {*} {
 *              getSchema 表单配置
 *              formModel 表单双向绑定
 *              defaultValueRef //默认值
 *             }
 * @returns
 */
export function useFormValues({
  defaultValueRef,
  getSchema,
  formModel,
  getProps,
}) {
  //处理表单值
  function handleFormValues(values) {
    if (!isObject(values)) return {};
    const res = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }
      if (value instanceof Date) {
        //处理单个时间格式
        const schema = unref(getSchema).find((item) => item.field === key);
        value = formatDateStr(value, schema.formateValue);
      }
      if (isString(value)) {
        if (value === "") {
          value = undefined;
        } else {
          value = value.trim();
        }
      }
      if (
        !tryDeconstructArray(key, value, res) &&
        !tryDeconstructObject(key, value, res)
      ) {
        // 没有解构成功的，按原样赋值
        set(res, key, value);
      }
    }

    return handleRangeTimeValue(res);
  }

  // 处理时间段格式
  function handleRangeTimeValue(values) {
    const fieldMapToTime = unref(getProps).fieldMapToTime;

    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values;
    }

    for (const [
      field,
      [startTimeKey, endTimeKey],
      format = "YYYY-MM-DD",
    ] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey) {
        continue;
      }
      if (!get(values, field)) {
        unset(values, field);
        continue;
      }
      const [startTime, endTime] = get(values, field);

      const [startTimeFormat, endTimeFormat] = Array.isArray(format)
        ? format
        : [format, format];

      if (isNotEmpty(startTime)) {
        set(values, startTimeKey, formatTime(startTime, startTimeFormat));
      }
      if (isNotEmpty(endTime)) {
        set(values, endTimeKey, formatTime(endTime, endTimeFormat));
      }
      unset(values, field);
    }

    return values;
  }

  function formatTime(time, format) {
    if (format === "timestamp") {
      return dateUtil(time).unix();
    } else if (format === "timestampStartDay") {
      return dateUtil(time).startOf("day").unix();
    }
    return dateUtil(time).format(format);
  }

  //初始化表单model值
  function initDefault() {
    const schemas = unref(getSchema);
    const obj = {};
    schemas.forEach((item) => {
      const { defaultValue, defaultValueObj } = item;
      const fieldKeys = Object.keys(defaultValueObj || {});
      if (fieldKeys.length) {
        fieldKeys.map((field) => {
          obj[field] = defaultValueObj[field];
          if (formModel[field] === undefined) {
            formModel[field] = defaultValueObj[field];
          }
        });
      }
      //默认值存在的情况下，设置默认值
      if (!isNullOrUnDef(defaultValue)) {
        obj[item.field] = defaultValue;
        if (formModel[item.field] === undefined) {
          formModel[item.field] = defaultValue;
        }
      }
    });
    defaultValueRef.value = cloneDeep(obj);
  }

  return {
    handleFormValues,
    initDefault,
  };
}

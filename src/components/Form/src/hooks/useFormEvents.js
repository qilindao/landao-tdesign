import { cloneDeep, uniqBy, isFunction, get } from "lodash-es";
import { deepMerge } from "@/landao/utils";
import { unref, toRaw, nextTick } from "vue";
import {
  isNullOrUnDef,
  isObject,
  isArray,
  isDef,
  isEmpty,
} from "@/landao/utils/is";
import {
  handleInputNumberValue,
  dateItemType,
  defaultValueComponents,
} from "../helper";
import { dateUtil } from "@/landao/utils/date";

function tryConstructArray(field, values) {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(field)) {
    const match = field.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(",");
      if (!keys.length) {
        return undefined;
      }

      const result = [];
      keys.forEach((k, index) => {
        set(result, index, values[k.trim()]);
      });

      return result.filter(Boolean).length ? result : undefined;
    }
  }
}

function tryConstructObject(field, values) {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(field)) {
    const match = field.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(",");
      if (!keys.length) {
        return;
      }

      const result = {};
      keys.forEach((k) => {
        set(result, k.trim(), values[k.trim()]);
      });

      return Object.values(result).filter(Boolean).length ? result : undefined;
    }
  }
}

/**
 *
 * @param {*}
 * emit 事件
 * getProps 配置
 * formModel 双向绑定
 * getSchema 表单配置
 * formElRef 表单ref
 *  defaultValueRef 表单默认值
 * handleFormValues  处理表单值
 * @returns
 */
export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  formElRef,
  schemaRef,
  defaultValueRef,
  handleFormValues,
}) {
  //表单校验
  async function validate() {
    return await unref(formElRef).validate();
  }

  /**
   * 清理某个字段的表单验证信息
   * @param {String} field
   */
  async function clearValidate(field) {
    await unref(formElRef).clearValidate(field);
  }

  /**
   * 验证具体的某个字段
   * @param {String} filed 字段
   * @returns
   */
  async function validateFields(field) {
    return await unref(formElRef).validate({ fields: field });
  }

  /**
   * 滚动到指定的字段
   * @param {*} field
   */
  async function scrollToField(field) {
    await unref(formElRef).scrollToField(field);
  }

  function checkIsRangeSlider(schema) {
    if (
      schema.component === "Slider" &&
      schema.componentProps &&
      "range" in schema.componentProps
    ) {
      return true;
    }
  }

  function checkIsInput(schema) {
    return (
      schema?.component && defaultValueComponents.includes(schema.component)
    );
  }

  /**
   * 获取默认值
   * @param {*} schema
   * @param {*} defaultValueRef
   * @param {*} key
   * @returns
   */
  function getDefaultValue(schema, defaultValueRef, key) {
    let defaultValue = cloneDeep(defaultValueRef.value[key]);
    const isInput = checkIsInput(schema);
    if (isInput) {
      return defaultValue || "";
    }
    if (!defaultValue && schema && checkIsRangeSlider(schema)) {
      defaultValue = [0, 0];
    }
    if (!defaultValue && schema && schema.component === "ApiTree") {
      defaultValue = [];
    }
    return defaultValue;
  }

  //重置表单
  async function resetFields() {
    const formEl = unref(formElRef);
    if (!formEl) return;
    formEl.reset();
    // 默认值不需要重置
    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      const defaultValueObj = schema?.defaultValueObj;
      const fieldKeys = Object.keys(defaultValueObj || {});
      if (fieldKeys.length) {
        fieldKeys.map((field) => {
          formModel[field] = defaultValueObj[field];
        });
      }
      formModel[key] = getDefaultValue(schema, defaultValueRef, key);

      // const isInput = schema?.component && ["Input"].includes(schema.component);
      // const defaultValue = cloneDeep(defaultValueRef.value[key]);
      // formModel[key] = isInput ? defaultValue || "" : defaultValue;
    });
    //清理
    nextTick(() => clearValidate());
    emit("reset", toRaw(formModel));
  }

  //表单提交
  async function handleSubmit(event) {
    event && event.preventDefault();
    //获取自定义表单提交函数
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) return;
    try {
      await validate().then((valid) => {
        const res = handleFormValues(formModel);
        emit("submit", res);
      });
    } catch (error) {
      console.error("LdForm.handleSubmit", error);
    }
  }

  /**
   * 获取表单值
   * @returns
   */
  function getFieldsValue() {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(formModel);
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key) {
    return unref(getSchema).some((item) => {
      return item.field === key ? dateItemType.includes(item.component) : false;
    });
  }

  // 获取表单fields
  const getAllFields = () =>
    unref(getSchema)
      .map((item) => [...(item.fields || []), item.field])
      .flat(1)
      .filter(Boolean);

  /**
   * 数据回显，用于编辑表单
   * @param {Object} values
   */
  async function setFieldsValue(values) {
    const fields = getAllFields();

    // key 支持 a.b.c 的嵌套写法
    const delimiter = ".";
    const nestKeyArray = fields.filter(
      (item) => String(item).indexOf(delimiter) >= 0
    );

    const validKeys = [];
    fields.forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      let value = get(values, key);
      const hasKey = Reflect.has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      const { componentProps } = schema || {};
      let _props = componentProps;
      if (typeof componentProps === "function") {
        _props = _props({ formModel: unref(formModel) });
      }

      const constructValue =
        tryConstructArray(key, values) || tryConstructObject(key, values);

      // 0| '' is allow
      if (hasKey || !!constructValue) {
        const fieldValue = constructValue || value;
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(fieldValue)) {
            const arr = [];
            for (const ele of fieldValue) {
              arr.push(ele ? dateUtil(ele) : null);
            }
            unref(formModel)[key] = arr;
          } else {
            unref(formModel)[key] = fieldValue
              ? _props?.valueType
                ? fieldValue
                : dateUtil(fieldValue)
              : null;
          }
        } else {
          unref(formModel)[key] = fieldValue;
        }
        if (_props?.onChange) {
          _props?.onChange(fieldValue);
        }
        validKeys.push(key);
      } else {
        nestKeyArray.forEach((nestKey) => {
          try {
            const value = nestKey
              .split(".")
              .reduce((out, item) => out[item], values);
            if (isDef(value)) {
              unref(formModel)[nestKey] = unref(value);
              validKeys.push(nestKey);
            }
          } catch (e) {
            // key not exist
            if (isDef(defaultValueRef.value[nestKey])) {
              unref(formModel)[nestKey] = cloneDeep(
                unref(defaultValueRef.value[nestKey])
              );
            }
          }
        });
      }
    });
    validateFields(validKeys).catch((_) => {});
  }

  /**
   * 更新表单
   * @param {Object | Array} data
   * @returns
   */
  async function updateSchema(data) {
    let updateData = [];
    if (isObject(data)) {
      updateData.push(data);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    const hasField = updateData.every(
      (item) =>
        item.component === "Divider" ||
        (Reflect.has(item, "field") && item.field)
    );
    if (!hasField) {
      console.error("需要更新的 Schema 数组表单，必须包含 field 字段");
      return;
    }
    let schema = [];
    unref(getSchema).forEach((val) => {
      let _val;
      updateData.forEach((item) => {
        if (val.field === item.field) {
          _val = item;
        }
      });
      if (_val !== undefined && val.field === _val.field) {
        const newSchema = deepMerge(val, _val);
        schema.push(newSchema);
      } else {
        schema.push(val);
      }
    });
    _setDefaultValue(schema);
    //此处会过滤掉一样的field，防止重复表单
    schemaRef.value = uniqBy(schema, "field");
  }

  /**
   * 追加表单项
   * @param {*} schema
   */
  async function appendSchema(schema) {
    let schemaList = cloneDeep(unref(getSchema));
    if (isObject(schema)) {
      schemaList.push(schema);
    }
    if (isArray(schema)) {
      schemaList = [...schemaList, ...schema];
    }
    schemaRef.value = schemaList;
  }

  /**
   * 重置表单项
   * @param {*} data
   * @returns
   */
  async function resetSchema(data) {
    let updateData = [];
    if (isObject(data)) {
      updateData.push(data);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) =>
        item.component === "Divider" ||
        (Reflect.has(item, "field") && item.field)
    );

    if (!hasField) {
      console.error("需要更新的 Schema 数组表单，必须包含 field 字段");
      return;
    }
    schemaRef.value = updateData;
  }

  /**
   * 私有方法，不对外，设置表单默认值
   * @param {Object | Array} data
   */
  function _setDefaultValue(data) {
    let schemas = [];
    if (isObject(data)) {
      schemas.push(data);
    }
    if (isArray(data)) {
      schemas = [...data];
    }
    const obj = {};
    const currentFieldsValue = getFieldsValue();
    schemas.forEach((item) => {
      if (
        item.component != "Divider" &&
        Reflect.has(item, "field") &&
        item.field &&
        !isNullOrUnDef(item.defaultValue) &&
        (!(item.field in currentFieldsValue) ||
          isNullOrUnDef(currentFieldsValue[item.field]) ||
          isEmpty(currentFieldsValue[item.field]))
      ) {
        obj[item.field] = item.defaultValue;
      }
    });
    setFieldsValue(obj);
  }

  return {
    resetFields,
    handleSubmit,
    validate,
    getFieldsValue,
    clearValidate,
    validateFields,
    scrollToField,
    setFieldsValue,
    updateSchema,
    appendSchema,
    resetSchema,
  };
}

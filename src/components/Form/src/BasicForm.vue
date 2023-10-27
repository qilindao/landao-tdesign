<template>
  <t-form
    v-bind="getBindValue"
    ref="formElRef"
    :data="formModel"
    class="ld-form"
  >
    <t-row>
      <template v-for="schema in getSchema" :key="schema.field">
        <schema-form-item
          :schema="schema"
          :formProps="getProps"
          :formModel="formModel"
          :setFormModel="setFormModel"
          :formActionType="formActionType"
        >
          <template
            #[item]="data"
            v-for="(item, index) in Object.keys($slots)"
            :key="index"
          >
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </schema-form-item>
      </template>
      <FormAction
        v-bind="getFormActionBindProps"
        @toggle-advanced="handleToggleAdvanced"
      >
        <template
          #[item]="data"
          v-for="(item, index) in [
            'resetBefore',
            'submitBefore',
            'advanceBefore',
            'advanceAfter',
          ]"
          :key="index"
        >
          <slot :name="item" v-bind="data || {}"></slot>
        </template>
      </FormAction>
    </t-row>
  </t-form>
</template>
<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  unref,
  watch,
  onMounted,
  nextTick,
} from "vue";
import { basicProps } from "./props";
import SchemaFormItem from "./components/SchemaFormItem";
import { useFormValues } from "./hooks/useFormValues";
import { useFormEvents } from "./hooks/useFormEvents";
import FormAction from "./components/FormAction";
import { createFormContext } from "./hooks/useFormContext";
import { useAdvanced } from "./hooks/useAdvanced";
import { cloneDeep } from "lodash-es";
import { deepMerge } from "@/landao/utils";

export default defineComponent({
  name: "LdForm",
  components: { SchemaFormItem, FormAction },
  props: basicProps,
  emits: ["submit", "reset", "register", "advanced-change"],
  setup(props, { emit, attrs }) {
    const formElRef = ref(null); //表单ref
    const formModel = reactive({}); //表单model
    const propsRef = ref({}); //外部定义表单属性
    const defaultValueRef = ref({}); //表单配置定义的默认值
    const schemaRef = ref(null); //动态删除表单项

    // 设置搜索表单的props
    const advanceState = reactive({
      isAdvanced: true,
      hideAdvanceBtn: false,
      isLoad: false,
    });

    //获取表单基础配置
    const getProps = computed(() => {
      return { ...props, ...unref(propsRef) };
    });

    const getBindValue = computed(() => ({
      ...attrs,
      ...props,
      ...unref(getProps),
    }));

    //处理表单配置和校验规则
    const getSchema = computed(() => {
      const schemas = unref(schemaRef) || unref(getProps).schemas;
      // for (const schema of schemas){
      //   const {}
      // }
      // const passRules = unref(getProps).rules;
      // for (const schema of schemas) {
      //   const { field, rules = [] } = schema;
      //   // 处理表单校验规则
      //   if (passRules) {
      //     schema.rules = unref(getProps).rules[field] || rules;
      //   }
      // }
      if (unref(getProps).showAdvancedButton) {
        return cloneDeep(
          schemas.filter((schema) => schema.component !== "Divider")
        );
      } else {
        return cloneDeep(schemas);
      }
    });

    //在使用搜索的情况下，底部的收起和展开按钮的hook
    const { handleToggleAdvanced } = useAdvanced({
      advanceState,
      emit,
      getProps,
      getSchema,
      formModel,
      defaultValueRef,
    });

    /**
     * 从schemas 提取，设置 表单 model 值，
     * 动态新增formModel
     */
    function setFormModel(key, value) {
      formModel[key] = value;
    }

    //表单初始化，根据 schema 设置 formModel
    const { initDefault, handleFormValues } = useFormValues({
      getProps,
      defaultValueRef,
      getSchema,
      formModel,
    });

    //向外暴露的表单事件
    const {
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
    } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      formElRef,
      schemaRef,
      defaultValueRef,
      handleFormValues,
    });

    //通过外部函数设置表单参数
    async function setProps(formProps) {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
    }
    //向外暴露的表单事件
    const formActionType = {
      setProps,
      validate,
      resetFields,
      handleSubmit,
      getFieldsValue,
      clearValidate,
      validateFields,
      scrollToField,
      setFieldsValue,
      updateSchema,
      appendSchema,
      resetSchema,
    };

    // 注册事件
    createFormContext({
      resetAction: resetFields,
      submitAction: handleSubmit,
    });

    // 监听 formModel 属性用于数据回显
    watch(
      () => unref(getProps).model,
      () => {
        const { model } = unref(getProps);
        if (!model) return;
        setFieldsValue(model);
      },
      {
        immediate: true,
      }
    );

    watch(
      () => unref(getProps).schemas,
      (schemas) => {
        resetSchema(schemas ?? []);
      }
    );
    // 监听 getSchema 属性 初始化
    watch(
      () => {
        getSchema.value;
      },
      (schema) => {
        // nextTick(()=>{
        // })
        if (schema.length >= 0) {
          initDefault();
        }
      }
    );
    //初始表单
    onMounted(() => {
      emit("register", formActionType);
      initDefault();
    });

    return {
      formElRef,
      formModel,
      getProps,
      getSchema,
      setFormModel,
      getBindValue,
      formActionType,
      ...formActionType,
      advanceState,
      handleToggleAdvanced,
      getFormActionBindProps: computed(() => ({
        ...getProps.value,
        ...advanceState,
      })),
    };
  },
});
</script>

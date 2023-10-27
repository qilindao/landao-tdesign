import { nextTick, ref, unref, onUnmounted, watch } from "vue";
import { getDynamicProps } from "@/landao/utils";
import { isProd } from "@/landao/env";

export function useForm(props) {
  const formRef = ref(null);
  const loadedRef = ref(null);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      throw console.warn("表单实例获取不到，请确保表单已渲染完成");
    }
    //这里获取dom的value是旧值
    await nextTick();
    //nextTick后获取dom的value是新值
    return form;
  }

  function register(instance) {
    isProd() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProd() && instance === unref(formRef)) return;
    formRef.value = instance;
    loadedRef.value = true;
    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      }
    );
  }

  const methods = {
    setProps: async (formProps) => {
      const form = await getForm();
      form.setProps(formProps);
    },
    /**
     * 重置表单为默认值
     * @returns
     */
    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
      // const form = await getForm();
      // return form.resetFields();
    },
    /**
     * 表单验证
     * @returns
     */
    validate: async () => {
      const form = await getForm();
      return form.validate();
    },
    /**
     * 清除验证
     * @param {*} field
     * @returns
     */
    clearValidate: async (field) => {
      const form = await getForm();
      return form.clearValidate(field);
    },
    /**
     * 验证具体的某个字段
     * @param {*} field
     * @returns
     */
    validateFields: async (field) => {
      const form = await getForm();
      return form.validateFields(field);
    },
    /**
     * 滚动到指定位置
     * @param {*} field
     * @returns
     */
    scrollToField: async (field) => {
      const form = await getForm();
      return form.scrollToField(field);
    },
    //获取表单值
    getFieldsValue: () => {
      return unref(formRef).getFieldsValue();
    },
    /**
     * 表单回显，设置表单值
     * @param {Object} values
     * @returns
     */
    setFieldsValue: async (values) => {
      const form = await getForm();
      return form.setFieldsValue(values);
    },
    //更新表单schema配置
    updateSchema: async (data) => {
      const form = await getForm();
      form.updateSchema(data);
    },
    //追加表单项
    appendSchema: async (data) => {
      const form = await getForm();
      form.appendSchema(data);
    },
    //重置表单项
    resetSchema: async (data) => {
      const form = await getForm();
      form.resetSchema(data);
    },
    submit: async () => {
      const form = await getForm();
      return form.submit();
    },
  };
  return [register, methods];
}

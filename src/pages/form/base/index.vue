<template>
  <div class="form-basic-container">
    <ld-form class="form-basic-item" @register="registerForm"> </ld-form>
  </div>
</template>

<script>
import { defineComponent, h } from "vue";
import { useForm } from "@/components/Form";
import {
  FORM_RULES,
  INITIAL_DATA,
  PARTY_A_OPTIONS,
  PARTY_B_OPTIONS,
  TYPE_OPTIONS,
  PARTY_PAYMENT,
} from "./constants";
export default defineComponent({
  name: "FormBase",
  setup() {
    function getFormSchema() {
      return [
        {
          field: "divider-basics",
          component: "Divider",
          label: "合同信息",
          colProps: {
            span: 12,
          },
          componentProps: {
            align: "left",
          },
        },
        {
          field: "name",
          label: "合同名称",
          component: "Input",
          required: true,
          help: "这是用户名字段帮助说明",
          defaultValue: "",
          colProps: {
            span: 6,
          },
        },
        {
          field: "type",
          label: "合同类型",
          required: true,
          component: "Select",
          defaultValue: "1",
          helpMessage: ["这个是一个合同类型", "必须选择"],
          helpComponentProps: { showIndex: true },
          colProps: {
            span: 6,
          },
          componentProps: {
            options: TYPE_OPTIONS,
          },
        },
        {
          field: "payment",
          label: "合同收付类型",
          required: true,
          component: "RadioGroup",
          defaultValue: "1",
          colProps: {
            span: 6,
          },
          componentProps: {
            options: PARTY_PAYMENT,
          },
        },
        {
          field: "price",
          label: "支付金额",
          required: true,
          component: "InputNumber",
          defaultValue: "1",
          colProps: {
            span: 6,
          },
        },
        {
          field: "partyA",
          label: "甲方",
          required: true,
          component: "Select",
          defaultValue: "",
          colProps: {
            span: 6,
          },
          componentProps: {
            options: PARTY_A_OPTIONS,
          },
        },
        {
          field: "partyB",
          label: "乙方",
          required: true,
          component: "Select",
          defaultValue: "",
          colProps: {
            span: 6,
          },
          componentProps: {
            options: PARTY_B_OPTIONS,
          },
        },
        {
          field: "signDate",
          label: "合同签订日期",
          required: true,
          component: "DatePicker",
          defaultValue: "",
          colProps: {
            span: 6,
          },
          componentProps: {
            format: "YYYY/MM/DD",
          },
        },
        {
          field: "startDate",
          label: "合同生效日期",
          required: true,
          component: "DatePicker",
          defaultValue: "",
          colProps: {
            span: 6,
          },
        },
        {
          field: "endDate",
          label: "合同结束日期",
          required: true,
          component: "DatePicker",
          defaultValue: "",
          colProps: {
            span: 6,
          },
        },
        {
          field: "divider-basics",
          component: "Divider",
          label: "表单内数据联动",
          colProps: {
            span: 12,
          },
          componentProps: {
            align: "left",
          },
        },
        {
          field: "is_training",
          label: "培训机构",
          required: true,
          component: "Switch",
          defaultValue: false,
          colProps: {
            span: 6,
          },
          componentProps: ({ formModel, formActionType }) => {
            return {
              onChange: async (val) => {
                formModel.is_training = val;
                if (val) {
                  formModel.is_school_partner = false;
                }
              },
            };
          },
        },
        {
          field: "is_school_partner",
          label: "校合作伙伴",
          required: true,
          component: "Switch",
          defaultValue: false,
          colProps: {
            span: 6,
          },
          componentProps: ({ formModel, formActionType }) => {
            return {
              onChange: async (val) => {
                formModel.is_school_partner = val;
                if (val) {
                  formModel.is_training = false;
                }
              },
            };
          },
        },
        {
          field: "date_range",
          label: "时间段",
          required: true,
          component: "DateRangePicker",
          defaultValue: [],
        },
        {
          field: "all_checkbox",
          label: "全选",
          required: true,
          component: "CheckboxGroup",
          defaultValue: [],
          componentProps: {
            options: [
              { label: "全选", checkAll: true },
              // html attribute: title, hover to see more label text info
              { value: "选项一", label: "选项一", title: "选项一" },
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              { value: "选项二", label: "选项二" },
              { value: "选项三", label: "选项三" },
            ],
          },
        },
        {
          field: "tag_input",
          label: "标签输入框",
          required: true,
          component: "TagInput",
          defaultValue: ["Vue", "React"],
          componentProps: {},
        },
        {
          field: "range_input",
          label: "范围输入框",
          component: "RangeInput",
          defaultValue: [],
        },
        {
          field: "t-textarea",
          label: "多行文本框",
          component: "Textarea",
          defaultValue: "",
          componentProps: {
            maxlength: "20",
          },
        },
        {
          field: "t-time",
          label: "时间选择器",
          component: "TimePicker",
          defaultValue: "",
          colProps: {
            span: 6,
          },
        },
        {
          field: "t-time-range",
          label: "时间选择器",
          component: "TimeRangePicker",
          defaultValue: [],
          colProps: {
            span: 6,
          },
        },
        {
          field: "t-tree-select",
          label: "树选择",
          component: "TreeSelect",
          defaultValue: "",
          componentProps: {
            data: [
              {
                label: "福建省",
                value: "fujian",
                children: [
                  {
                    label: "福州市",
                    value: "fuzhou",
                  },
                  {
                    label: "厦门市",
                    value: "厦门",
                  },
                ],
              },
              {
                label: "江苏省",
                value: "jiangsu",
                children: [
                  {
                    label: "南京市",
                    value: "nanjing",
                  },
                  {
                    label: "苏州市",
                    value: "suzhou",
                  },
                ],
              },
            ],
          },
        },
        {
          field: "t-transfer",
          label: "穿梭框",
          component: "Transfer",
          defaultValue: [],
          componentProps: {
            data: [
              {
                value: 1,
                label: "内容1",
                disabled: false,
              },
              {
                value: 2,
                label: "内容2",
                disabled: true,
              },
              {
                value: 3,
                label: "内容3",
                disabled: false,
              },
            ],
          },
        },
        {
          field: "t-cascader",
          label: "级联选择器",
          component: "Cascader",
          defaultValue: [],
          componentProps: {
            options: [
              {
                label: "福建省",
                value: "1",
                children: [
                  {
                    label: "福州市",
                    value: "1.1",
                  },
                  {
                    label: "厦门市",
                    value: "1.2",
                  },
                  {
                    label: "平潭综合实验区",
                    value: "1.3",
                  },
                ],
              },
              {
                label: "广州省",
                value: "2",
                children: [
                  {
                    label: "广州",
                    value: "2.1",
                  },
                  {
                    label: "深圳",
                    value: "2.2",
                  },
                ],
              },
            ],
            multiple: true,
            clearable: true,
          },
        },
      ];
    }

    const [
      registerForm,
      { resetFields, updateSchema, setFieldsValue, validate, getFieldsValue },
    ] = useForm({
      labelWidth: "120px",
      labelAlign: "top",
      schemas: getFormSchema(),
    });

    return { registerForm };
  },
});
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

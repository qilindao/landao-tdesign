# LdForm 表单组件

对 `TDesign` 的 `t-form` 组件进行封装，扩展一些常用的功能

:::tip 写在前面

- LdForm 是从 [Vben Admin](https://doc.vvbin.cn/) 迁移过来
- Vue-Vben-Admin 是一个基于 Vue3.0、Vite、 Ant-Design-Vue、TypeScript 的后台解决方案
  :::

## 用法

### useForm 方式

下面是一个使用简单表单的示例，只有一个输入框

```vue
<template>
  <LdForm @register="register" @submit="onSubmit"></LdForm>
</template>
<script>
import { defineComponent, ref, nextTick, unref } from "vue";
import { DeptService } from "@/service";
import { useToggle } from "@/landao/hooks";
import { useForm } from "@/components/LdForm";
import { ElMessage, ElMessageBox } from "element-plus";
import { deepTree } from "@/landao/utils";

export default defineComponent({
  name: "DeptForm",
  setup() {
    function getFormSchema() {
      return [
        {
          field: "[start_date, end_date]",
          label: "起止年月",
          component: "DateRangePicker",
          required: true,
          defaultValue: [],
          colProps: {
            span: 6,
          },
          componentProps: {
            placeholder: ["开始年月", "结束年月"],
            mode: "month",
            clearable: true,
          },
        },
        {
          field: "teacher_birthday",
          label: "出生日期",
          component: "DatePicker",
          defaultValue: "",
          required: true,
          colProps: {
            span: 4,
          },
          componentProps: {
            valueType: "YYYY-MM-DD", //用于格式化日期，注意和 format 的区别，format 仅用于处理日期在页面中呈现的格式，若不设置，这里转化为 dayjs 对象
          },
        },
        {
          field: "school_name",
          label: "就读学校",
          required: true,
          component: "Input",
          defaultValue: "",
          rules: [
            { required: true, message: "不能为空" },
            { max: 50, message: "字符数量不能超过 50", type: "warning" },
          ],
          colProps: {
            span: 6,
          },
          componentProps: {
            clearable: true,
            allowInput: true,
          },
        },
        {
          field: "discipline_name",
          label: "专业",
          required: true,
          component: "Input",
          defaultValue: "",
          fields: ["typeValue2"],
          rules: [
            { required: true, message: "不能为空" },
            { max: 50, message: "字符数量不能超过 50", type: "warning" },
          ],
          colProps: {
            span: 6,
          },
          componentProps: {
            clearable: true,
            allowInput: true,
          },
        },
        {
          field: "edu_code",
          label: "学历/学位",
          required: true,
          component: "Select",
          defaultValue: "",
          colProps: {
            span: 6,
          },
          componentProps: {
            clearable: true,
            options: dictionary?.educational_level ?? [],
          },
          // 校验规则，此处同 Form 表单
          rules: [{ required: true, message: "不能为空" }],
        },
        {
          required: true,
          field: "typeKey2",
          defaultValue: "测试类型",
          fields: ["typeValue2", "typeValue3"],
          defaultValueObj: { typeValue2: "cloud.tencent", typeValue3: ".cn" },
          component: "Input",
          label: "复合field render",
          render(h, { model, field }, { disabled }) {
            return (
              <t-input-adornment
                v-slots={{
                  prepend: () => (
                    <t-select
                      autoWidth
                      v-model:value={model[field]}
                      options={["http://", "https://"].map((value) => ({
                        label: value,
                        value,
                      }))}
                      defaultValue="http://"
                    />
                  ),
                  append: () => (
                    <t-select
                      autoWidth
                      options={[".com", ".cn", ".net", ".org"].map((value) => ({
                        label: value,
                        value,
                      }))}
                      defaultValue=".cn"
                      v-model:value={model["typeValue3"]}
                    />
                  ),
                }}
              >
                <t-select
                  options={["tencent", "qq", "cloud.tencent"].map((value) => ({
                    label: value,
                    value,
                  }))}
                  default-value="tencent"
                  v-model:value={model["typeValue2"]}
                ></t-select>
              </t-input-adornment>
            );
          },
          colProps: {
            span: 8,
          },
        },
      ];
    }

    //注册表单
    //注册表单
    const [
      registerForm,
      { resetFields, updateSchema, setFieldsValue, validate, getFieldsValue },
    ] = useForm({
      labelWidth: "120px",
      schemas: getFormSchema(),
      // fieldMapToTime: [["dates", ["start_date", "end_date"], "YYYY-MM"]],//日历范围，可配置此处，或者在 schema 中书写：field: "[start_date, end_date]",
    });

    const onSubmit = async (data) => {
      setProps({ submitButtonOptions: { loading: true, label: "提交中..." } });
      if (unref(updateDeptId) > 0) {
        await DeptService.update(unref(updateDeptId), data)
          .then((res) => {
            ElMessage.success(res.message);
            clearTableForm();
          })
          .catch((err) => {
            ElMessage.error("1" + err);
          });
      } else {
        await DeptService.doStore(data)
          .then((res) => {
            ElMessage.success(res.message);
            clearTableForm();
          })
          .catch((err) => {
            ElMessage.error("2" + err);
          });
      }
      setProps({ submitButtonOptions: { loading: false, label: "提 交" } });
    };

    return {
      deptFormRef,
      register,
      onSubmit,
    };
  },
});
</script>
```

## Form 属性

| 属性                    | 类型              | 默认值    | 可选值                        | 说明                                                                                                 | 版本 |
| ----------------------- | ----------------- | --------- | ----------------------------- | ---------------------------------------------------------------------------------------------------- | ---- |
| `schemas`               | `FormSchema[]`    | -         | -                             | 表单配置，见下方 `FormSchema` 配置                                                                   |      |
| `labelPosition`         | `string`          | -         | `'right', 'left', 'top'`      | 表单域标签的位置                                                                                     |      |
| `labelWidth`            | `number , string` | -         | -                             | 扩展 form 组件，增加 label 宽度，表单内所有组件适用，可以单独在某个项覆盖或者禁用                    |      |
| `size`                  | `string`          | `default` | `'large', 'default', 'small'` | 向表单内所有组件传递 size 参数,自定义组件需自行实现 size 接收                                        |      |
| `disabled`              | `boolean`         | `false`   | `'false', 'true'`             | 向表单内所有组件传递 disabled 属性，自定义组件需自行实现 disabled 接收                               |      |
| `showActionButtonGroup` | `boolean`         | `true`    | `'false', 'true'`             | 是否显示操作按钮(重置/提交)                                                                          |      |
| `actionColOptions`      | `Object`          | `true`    | `'false', 'true'`             | 操作按钮外层 `ElCol` 组件配置，如果开启 `showAdvancedButton`，则不用设置，具体见下方 [ColEx](#colex) |      |
| `showSubmitButton`      | `boolean`         | `true`    | `'false', 'true'`             | 确认按钮配置见下方 ActionButtonOption                                                                |      |
| `submitButtonOptions`   | `Object`          |           |                               | 确认按钮配置见下方 ActionButtonOption                                                                |      |
| `showResetButton`       | `boolean`         | `true`    | `'false', 'true'`             | 确认按钮配置见下方 ActionButtonOption                                                                |      |
| `resetButtonOptions`    | `Object`          |           |                               | 确认按钮配置见下方 ActionButtonOption                                                                |      |
| `showAdvancedButton`    | `Object`          |           |                               | 是否显示展开收起按钮                                                                                 |      |

## 内置组件 FormAction 插槽

表单底部按钮组插槽

| 插槽名          | 说明                    |
| --------------- | ----------------------- |
| `resetBefore`   | 安放在重置按钮前        |
| `submitBefore`  | 安放在提交按钮前        |
| `advanceBefore` | 安放在`收起/展开`按钮前 |
| `advanceAfter`  | 安放在`收起/展开`按钮后 |

## Form 方法

| 方法名           | 说明                                                          | 类型                           |
| ---------------- | ------------------------------------------------------------- | ------------------------------ |
| `setProps`       | 设置`Form`属性                                                | `(formProps) => Promise<void>` |
| `resetFields`    | 重置表单为默认值                                              | `()=>void`                     |
| `validate`       | 对整个表单的内容进行验证。 接收一个回调函数，或返回 `Promise` |                                |
| `clearValidate`  | 清除校验                                                      | `(name) => void`               |
| `validateField`  | 验证具体的某个字段                                            |                                |
| `scrollToField`  | 滚动到指定位置                                                |                                |
| `getFieldsValue` | 获取表单值                                                    | `()=>Recordable`               |
| `setFieldsValue` | 表单回显，设置表单值                                          | `(values)=>void`               |
| `resetSchema`    | 重置`FormSchema`项                                            | `(data) => void`               |
| `updateSchema`   | 更新`FormSchema`项,只更新函数所传的参数                       | `(data) => void`               |

```js
//TODO：componentProps是函数的话，无效
updateSchema({ field: "filed", componentProps: { disabled: true } });
updateSchema([
  { field: "filed", componentProps: { disabled: true } },
  { field: "filed1", componentProps: { disabled: false } },
]);
```

## FormSchema 属性

| 属性                     | 类型                                                   | 默认值          | 可选值        | 说明                                                                                                                              |
| ------------------------ | ------------------------------------------------------ | --------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `field`                  | `string`                                               | -               | -             | 字段名                                                                                                                            |
| `label`                  | `string`                                               | -               | -             | 标签名                                                                                                                            |
| `labelWidth`             | `string , number`                                      | -               | -             | 覆盖统一设置的 labelWidth                                                                                                         |
| `component`              | `string`                                               | -               | -             | 组件类型，见下方 [ComponentType](#componenttype)                                                                                  |
| `required`               | `boolean`                                              | -               | -             | 简化 rules 配置，为 true 则转化成 `[{required:true}]`                                                                             |
| `rules`                  | `FormItemRule                                          | FormItemRule[]` | -             | -                                                                                                                                 | 表单验证规则 |
| `colProps`               | `ColEx`                                                | -               | -             | 参考下方 [ColEx](#colex)                                                                                                          |
| `componentProps`         | `any,()=>{}`                                           | -               | -             | 所渲染的组件内部 props,详见[componentProps](#componentprops)                                                                      |
| `renderComponentContent` | `()=>{}`                                               | -               | -             | 定义渲染组内部的 slot，详见[renderComponentContent](#rendercomponentcontent)                                                      |
| `slot`                   | `string`                                               | -               | -             | 自定义 slot，见下文 [solt](#slot)                                                                                                 |
| `helpMessage`            | `string`                                               | -               | -             | 标签右侧温馨提示                                                                                                                  |
| `helpComponentProps`     | `Object`                                               | -               | -             | 标签名右侧温馨提示组件 `props`, 部分继承 `el-tootip` 属性,见属性 [helpComponentProps](/frontend/components/LdHelp#props)          |
| `ifShow`                 | `boolean / ((renderCallbackParams) => boolean)`        | `true`          | -             | 动态判断当前组件是否显示，js 控制，会删除 dom,见下方[ifShow/isshow](#ifshowshow) ,[renderCallbackParams](#rendercallbackparams)   |
| `show`                   | `boolean / ((renderCallbackParams) => boolean)`        | `true`          | -             | 动态判断当前组件是否显示，css 控制，不会删除 dom,见下方[ifShow/isshow](#ifshowshow),[renderCallbackParams](#rendercallbackparams) |
| `render`                 | `(h,renderCallbackParams) => VNode / VNode[] / string` | -               | -             | 自定义渲染组件[renderCallbackParams](#rendercallbackparams)                                                                       |
| `ifRightShow`            | `boolean`                                              | `false`         | `true\|false` | 是否显示右侧自定义内容                                                                                                            |
| `rightRender`            | `(renderCallbackParams) => VNode / VNode[] / string`   | -               | -             | 自定义右侧渲染组件，注意要设置左侧组件宽度，否则会破格[renderCallbackParams](#rendercallbackparams)                               |
| `dynamicRules`           | `boolean / ((renderCallbackParams) => boolean)`        | -               | -             | 动态判返当前组件校验规则[renderCallbackParams](#rendercallbackparams)                                                             |

### renderCallbackParams

回调参数

```js
return {
  field: schema.field, //当前字段名
  model: formModel, //双向绑定
  values: {
    //双向绑定值
    ...formModel,
  },
  schema: schema, //配置参数
};
```

### ColEx

见[element-plus(Layout 布局)](https://element-plus.org/zh-CN/component/layout.html#col-%E5%B1%9E%E6%80%A7)

### componentProps

- 当值为对象类型时,该对象将作为`component`所对应组件的的 props 传入组件.见[element-plus(Form 表单组件)](https://element-plus.org/zh-CN/component/input.html)

- 当值为一个函数时候

参数有 3 个

`schema`: 表单的整个 schemas

`formModel`: 表单的双向绑定对象，这个值是响应式的。所以可以方便处理很多操作

`formActionType`:操作表单的函数。与 useForm 返回的操作函数一致

```js
{
  // 简单例子，值改变的时候操作表格或者修改表单内其他元素的值
  component:'Input',
  componentProps: ({ schema,  formModel }) => {
    return {
      onChange:(e)=>{
      }
    };
  };
}
```

### renderComponentContent

见[element-plus(input-插槽)](https://element-plus.org/zh-CN/component/input.html#input-%E6%8F%92%E6%A7%BD)

```tsx
{
  // 简单例子，组件内部slot
  component:'Input',
  renderComponentContent: () => {
    return {
        prefix: () => 'Search',
        append: () => ".com",
    };
}
```

### slot

`FormSchema` 自定义插槽

```vue
<template>
  <div class="ld-form">
    <ld-form label-position="right" label-width="150px" :schemas="schemas">
      <!-- #slotName 或 v-slot:slotName -->
      <template #menuFileSlot="{ model, field, values }">
        <menu-file v-model="model[field]" />
      </template>
    </ld-form>
  </div>
</template>
<script>
import { defineComponent } from "compatible-vue";
import menuFile from "@/views/system/components/menu-file";
export default defineComponent({
  name: "FormDemo",
  components: { menuFile },
  setup(props) {
    const schemas = [
      {
        field: "menu_component",
        label: "文件路径：",
        slot: "menuFileSlot",
      },
    ];

    return {
      schemas,
    };
  },
});
</script>
```

### ifShow/show

自定义显示

```vue
<template>
  <div class="m-4">
    <LdForm @register="register" />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useForm } from "@/components/LdForm";
const schemas = [
  {
    field: "field1",
    component: "Input",
    label: "字段1",
    colProps: {
      span: 8,
    },
    show: ({ values }) => {
      return !!values.field5;
    },
  },
  {
    field: "field2",
    component: "Input",
    label: "字段2",
    colProps: {
      span: 8,
    },
    ifShow: ({ values }) => {
      return !!values.field6;
    },
  },
];

export default defineComponent({
  components: { BasicForm },
  setup() {
    const [register, { setProps }] = useForm({
      labelWidth: 120,
      schemas,
    });
    return {
      register,
      schemas,
      setProps,
    };
  },
});
</script>
```

## ComponentType

schema 内组件的可选类型

```tsx
export type ComponentType =
  | "Input"
  | "Switch"
  | "Radio"
  | "RadioGroup"
  | "InputNumber"
  | "Rate"
  | "Cascader"
  | "Checkbox"
  | "CheckboxGroup"
  | "DatePicker"
  | "TimeSelect"
  | "TimePicker"
  | "DateTimePicker"
  | "DatesPicker"
  | "ApiSelect"
  | "Select"
  | "ApiTreeSelect"
  | "Divider"
  | "ApiCascader"
  | "SelectPage";
```

## RadioGroup

::: warning 注意

- `RadioGroup` 是对 `el-radio-group` 进行封装
- 若返回的值是`['manage.passport.captcha', 'manage.passport.login']` 组件依然转换成：`{label:value,value:value}`

:::

### 使用

```js
const schemas = [
  {
    field: "menu_type",
    component: "RadioGroup",
    label: "节点类型",
    colProps: {
      span: 8,
    },
    defaultValue: "0",
    componentProps: {
      options: [
        { label: "目录", value: "0" },
        { label: "菜单", value: "1" },
        { label: "权限", value: "2" },
      ],
    },
  },
];
```

### RadioGroup 属性

| 属性    | 类型      | 默认值                   | 说明                                                     |
| ------- | --------- | ------------------------ | -------------------------------------------------------- | ---------------------------------------------- |
| type    | `string`  | `''                      | button`                                                  | 设置`type`属性为 `button` 可以渲染为按钮组样式 |
| border  | `boolean` | `false`                  | 设置 `border` 属性为 `true` 可以渲染为带有边框的单选框。 |
| size    | `string`  | `large / default /small` | `Radio` 的尺寸                                           |
| options | `array`   | `[]`                     | 数据字段                                                 |

## ApiSelect 远程下拉组件

远程下拉组件，其他`componentProps`可参见`el-select`配置

::: warning 注意

- 组件内会将数据转换成`{label:labelField,value:valueField,disabled:disabledField}`
- 若返回的值是`['manage.passport.captcha', 'manage.passport.login']` 组件依然转换成：`{label:value,value:value,disabled:false}`

:::

### 使用

```js
const schemas = [
  {
    field: "api_path",
    label: "权限标识",
    required: true,
    component: "ApiSelect",
    defaultValue: "",
    componentProps: {
      placeholder: "请选择权限标识",
      api: MenuService.getPower,
      immediate: true,
      filterable: true,
    },
  },
];
```

### ApiSelect 属性

| 属性          | 类型      | 默认值     | 说明                                             |
| ------------- | --------- | ---------- | ------------------------------------------------ |
| api           | `()=>{}`  | -          | 数据接口，接受一个 Promise 对象                  |
| params        | `object`  | -          | 接口参数。此属性改变时会自动重新加载接口数据     |
| labelField    | `string`  | `label`    | 下拉数组项内`label`显示文本的字段                |
| valueField    | `string`  | `value`    | 下拉数组项内`value`实际值的字段                  |
| disabledField | `boolean` | `disabled` | 下拉数组项内`disabled`实际值的字段               |
| immediate     | `boolean` | `true`     | 是否立即请求接口，否则将在第一次点击时候触发请求 |

## ApiTreeSelect 远程树形下拉组件

远程树形下拉组件，含有下拉菜单的树形选择器，结合了 el-tree 和 el-select 两个组件的功能。

:::tip 提示

- 具体内置参数见[element-plus(TreeSelect 树形选择)](https://element-plus.gitee.io/zh-CN/component/tree-select.html)
- 其他扩展参数见以下 `componentProps`
- 特别提醒：此组件基于`element-plus V2.1.8`

:::

### 使用

```js
const schemas = [
  {
    field: "parent_id",
    label: "上级节点",
    required: true,
    component: "ApiTreeSelect",
    componentProps: {
      placeholder: "请选择上级节点",
      api: MenuService.getList,
      filterable: true,
      nodeKey: "menuId",
      props: {
        label: "title",
        children: "children",
      },
      checkStrictly: true,
      afterFetch: (treeData) => {
        if (!treeData) return [];
        let menuList = treeData.filter((item) => item.menuType != 2);
        menuList.unshift({
          title: "一级菜单",
          menuId: 0,
        });
        return deepTree(menuList);
      },
    },
  },
];
```

### ApiTreeSelect 属性

| 属性       | 类型      | 默认值   | 说明                                             |
| ---------- | --------- | -------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| api        | `()=>{}`  | -        | 数据接口，接受一个 Promise 对象                  |
| params     | `object`  | -        | 接口参数。此属性改变时会自动重新加载接口数据     |
| immediate  | `boolean` | `true`   | 是否立即请求接口，否则将在第一次点击时候触发请求 |
| afterFetch | `null`    | `()=>{}` | -                                                | 对数据进行格式化操作，比如后端返回的是一维数组，前端 er 可以在这个函数下自行对数据进行格式化 |

## DatePicker 日期组件

### 使用

```js
const schemas = [
  {
    field: "monthField",
    label: "月份范围",
    component: "DatePicker",
    colProps: {
      span: 8,
    },
    componentProps: {
      type: "monthrange",
    },
  },
  {
    field: "date_range",
    label: "日期范围",
    component: "DatePicker",
    defaultValue: "",
    colProps: {
      span: 8,
    },
    componentProps: {
      type: "daterange",
      format: "YYYY-MM-DD",
      rangeSeparator: "至",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
    },
  },
  {
    field: "created_range_time",
    label: "事件",
    component: "DateTimePicker",
    colProps: {
      span: 8,
    },
    componentProps: {
      format: "YYYY-MM-DD HH:mm:ss",
    },
  },
];
```

### DatePicker 属性

| 属性        | 类型         | 默认值                                 | 说明                                                                             |
| ----------- | ------------ | -------------------------------------- | -------------------------------------------------------------------------------- |
| type        | `string`     | `year/month/date/daterange/monthrange` | 日期组件类型                                                                     |
| format      | `YYYY-MM-DD` | -                                      | 日期格式化，若设置`type:year/month/monthrange`,需将 format 设置为:`YYYY/YYYY-MM` |
| isTimestamp | `boolean`    | `false`                                | 是否返回时间戳 `valueOf`                                                         |

## DatesPicker 多选日期

::: warning 提示

该组件是从 `el-DatePicker` 剥离下来，单独成立的一个组件

:::

### 使用

```js
const schemas = [
  {
    field: "fieldDates",
    label: "选中多个日期",
    component: "DatesPicker",
    defaultValue: ["2022-07-01", "2022-07-25"],
    colProps: {
      span: 8,
    },
    componentProps: {
      format: "YYYY-MM-DD",
    },
  },
];
```

### DatesPicker 属性

| 属性        | 类型      | 默认值  | 说明                   |
| ----------- | --------- | ------- | ---------------------- | ------------- |
| isTimestamp | `boolean` | `false` | 是否返回时间戳`valueOf | toISOString`) |
| format      | `string`  | -       | 日期格式化             |

### DatePicker 属性

| 属性        | 类型         | 默认值                                 | 说明                                                                             |
| ----------- | ------------ | -------------------------------------- | -------------------------------------------------------------------------------- |
| type        | `string`     | `year/month/date/daterange/monthrange` | 日期组件类型                                                                     |
| format      | `YYYY-MM-DD` | -                                      | 日期格式化，若设置`type:year/month/monthrange`,需将 format 设置为:`YYYY/YYYY-MM` |
| isTimestamp | `boolean`    | `false`                                | 是否返回时间戳 `valueOf`                                                         |

## DateTimePicker 日期时间组件

::: warning 提示

该组件是从 `el-DateTimePicker` 剥离下来，单独成立的一个组件，该组件只支持`datetimerange/datetime`两个类型

:::

### 使用

```js
const schemas = [
  {
    field: "fieldDates",
    label: "选中多个日期",
    component: "DateTimePicker",
    defaultValue: [],
    colProps: {
      span: 8,
    },
    componentProps: {
      isRange: true,
      type: "daterange",
      format: "YYYY-MM-DD HH:mm:ss",
      rangeSeparator: "至",
      startPlaceholder: "开始时间",
      endPlaceholder: "结束时间",
    },
  },
];
```

### DatesPicker 属性

:::warning 注意事项
`el-DateTimePicker`内置属性`type`，不能使用。只能通过`isRange`来渲染组件类型
:::

| 属性        | 类型      | 默认值  | 说明                                                     |
| ----------- | --------- | ------- | -------------------------------------------------------- | ------------- |
| isRange     | `boolean` | `false` | 是否是日期时间范围，支持时间类型`datetimerange/datetime` |
| isTimestamp | `boolean` | `false` | 是否返回时间戳`valueOf                                   | toISOString`) |
| format      | `string`  | -       | 日期格式化                                               |

## SelectPage 下拉分页列表框

::: tip 提示

该组件是从 `el-select` 演化而来，起初是自定义 `el-select` 内容，但是在嵌套级联和下拉框的时候，出现`el-popover`冲突。

此组件是组件`LdForm`的子组件，现又在该组件的搜索表单中嵌套`LdForm`组件。

慎用

:::

### SelectPage 属性

| 属性             | 类型             | 默认值   | 可选值                                                                                                    | 说明                                                    |
| ---------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| api              | `()=>{}`         | null     |                                                                                                           | 数据接口，接受一个 Promise 对象                         |
| modelValue       | `object\|array`  | -        |                                                                                                           | 绑定数据                                                |
| multiple         | `boolean`        | `true`   |                                                                                                           | 是否多选                                                |
| multiple         | `number`         | `0`      |                                                                                                           | 多选时，最多选择几项                                    |
| size             | `string`         | `small`  | `large / default / small`                                                                                 | 根据业务状态控制当前是否显示                            |
| placeholder      | `string`         | `请选择` |                                                                                                           | 占位文字                                                |
| columns          | `array`          | `[]`     |                                                                                                           | 列配置，详细见下文:[columns](#columns-列配置项)         |
| width            | `number\|string` | `[]`     |                                                                                                           | `el-popover`的宽度                                      |
| placement        | `string`         | `bottom` | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | `el-popover`显示位置                                    |
| valueKey         | `string`         | `value`  |                                                                                                           | 选项值 key                                              |
| labelKey         | `string`         | `label`  |                                                                                                           | 选项值标签 key                                          |
| contentMaxHeight | `number\|string` | `360`    |                                                                                                           | 列表内容区域宽度                                        |
| formConfig       | `array`          | `[]`     | -                                                                                                         | 搜索表单配置，详见：[formschema-属性](#formschema-属性) |

### columns 列配置项

| 属性   | 类型                       | 默认值 | 说明           |
| ------ | -------------------------- | ------ | -------------- |
| format | `(value, row, column)=>{}` | -      | 格式化数据     |
| prop   | `string`                   | -      | 读取数据集 key |
| label  | `string`                   |        | 列显示名称     |
| width  | `number\|string`           | `50`   | 列宽度         |

### SelectPage 使用

```vue
<template>
  <SelectPage
        placeholder="请选择授课校区"
        v-model="schoolValue"
        :api="schoolPageApi"
        :columns="schoolColumn"
        :form-config="formConfig"
        value-key="school_id"
        label-key="school_name"
      >
        <template #search>
          <el-form-item prop="school_name">
            <el-input
              size="default"
              v-model="formSearch.school_name"
              placeholder="请输入校名"
            ></el-input>
          </el-form-item>
        </template>
      </SelectPage>
      <SelectPage
        placeholder="请选择授课校区，多选"
        v-model="schoolValueArr"
        :api="schoolPageApi"
        :columns="schoolColumn"
        value-key="school_id"
        label-key="school_name"
        multiple
      ></SelectPage>
</template>
<script>
import { defineComponent, reactive, ref } from "vue";
import { useBaseStore } from "@/store";
import { CourseService, SchoolService } from "@/service";
import SelectPage from "@/components/LdForm/components/widget/SelectPageWidget";
export default defineComponent({
  name: "CourseList",
  components: {
    CourseCategoryTree,
    SelectPage,
  },
  setup() {
     // 要删除掉的
    const { app: appStore } = useBaseStore();
    const { school_type } = appStore.dictionary;

    const schoolColumn = reactive([
      {
        prop: "school_name",
        label: "学校",
        width: 300,
      },
      {
        prop: "school_type",
        label: "类型",
        width: 100,
        format: (value, row, column) => {
          const constantItem = school_type.find((item) => item.value == value);
          return constantItem.label ?? "-";
        },
      },
    ]);
    const schoolValue = ref({ school_id: 1002, school_name: "福州16中" });
    const schoolValueArr = ref([
      { school_id: 1002, school_name: "福州16中" },
      { school_id: 1003, school_name: "福州19中" },
    ]);

    const formConfig = reactive([
      {
        field: "district_id",
        component: "Cascader",
        defaultValue: "",
        colProps: {
          span: 8,
        },
        componentProps: {
          placeholder: "请选择学校所在区域",
          options: appStore.operationArea,
          showAllLevels: false,
          props: { emitPath: false },
          clearable: true,
        },
      },
      {
        field: "school_name",
        component: "Input",
        defaultValue: "",
        colProps: {
          span: 8,
        },
        componentProps: {
          placeholder: "请输入学校名称",
          clearable: true,
        },
      },
    ]);
    return {
       schoolPageApi: SchoolService.page,
      schoolColumn,
      schoolValue,
      schoolValueArr,
      formConfig,
    }
  })
```

### SelectPage 配合 LdForm 使用

```js
 function getFormSchema() {
    return [
      {
        field: "schools",
        label: "开课校区：",
        component: "SelectPage",
        defaultValue: [],
        required: true,
        colProps: {
          span: 8,
        },
        componentProps: {
          api: SchoolService.simple,
          placeholder: "请选择校区",
          multiple: true,
          multipleLimit: 2,
          columns: [
            {
              prop: "school_name",
              label: "学校",
              width: 300,
            },
            {
              prop: "school_type",
              label: "类型",
              width: 100,
              format: (value, row, column) => {
                const constantItem = school_type.find(
                  (item) => item.value == value
                );
                return constantItem.label ?? "-";
              },
            },
          ],
          valueKey: "school_id",
          labelKey: "school_name",
          formConfig: [
            {
              field: "district_id",
              component: "Cascader",
              defaultValue: "",
              colProps: {
                span: 8,
              },
              componentProps: {
                placeholder: "请选择学校所在区域",
                options: appStore.operationArea,
                showAllLevels: false,
                props: { emitPath: false },
                clearable: true,
              },
            },
            {
              field: "school_name",
              component: "Input",
              defaultValue: "",
              colProps: {
                span: 8,
              },
              componentProps: {
                placeholder: "请输入学校名称",
                clearable: true,
              },
            },
          ],
        },
    ]
    }
```

## 注意事项

- 隐藏表单项，在 slot 是`InputNumber`组件，隐藏的 component,也要设置`InputNumber`，否则会转化为`string`类型，
- 表单多个 `Divider` 也要设置 `field`,否则在使用 `updateSchema` 方法的时候，会过滤相同 `field`项

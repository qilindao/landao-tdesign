import { defineComponent, computed, unref, h } from "vue";
import { componentMap } from "../componentMap";
import { upperFirst, cloneDeep } from "lodash-es";
import { getSlot } from "@/landao/utils";
import { isFunction, isBoolean } from "@/landao/utils/is";
import { createPlaceholderMessage } from "../helper";

export default defineComponent({
  name: "SchemaFormItem",
  props: {
    schema: {
      type: Object,
      default: () => {},
    },
    formProps: {
      //表单配置
      type: Object,
      default: () => {},
    },
    formModel: {
      //双向绑定
      type: Object,
      default: () => {},
    },
    formElRef: {
      //表单ref
      type: Object,
    },
    setFormModel: {
      //从schemas 提取，设置 表单 model 值，
      type: Function,
      default: null,
    },
    formActionType: {
      //操作函数列
      type: Object,
      default: () => {},
    },
  },
  inheritAttrs: false,
  setup(props, { slots }) {
    //定义回调值，包含 slot 、 ifShow 等等
    const getValues = computed(() => {
      const { formModel, schema } = props;
      return {
        field: schema.field,
        model: formModel,
        values: {
          ...formModel,
        },
        schema: schema,
      };
    });

    //获取 schema 是否显示
    function getShow() {
      const { ifShow, show } = props.schema;
      let isIfShow = true,
        isShow = true;
      //操作可收缩表单
      const itemIsAdvanced = props.formProps.showAdvancedButton
        ? isBoolean(props.schema.isAdvanced)
          ? props.schema.isAdvanced
          : true
        : true;
      //如果传入的的 boolean
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isBoolean(show)) {
        isShow = isShow;
      }
      //如果传入的是function
      if (isFunction(ifShow)) {
        isIfShow = ifShow(unref(getValues));
      }
      if (isFunction(show)) {
        isShow = show(unref(getValues));
      }
      isShow = isShow && itemIsAdvanced;
      return { isIfShow, isShow };
    }

    //表单校验
    function handleRules() {
      const {
        rules: defRules = [],
        required,
        label,
        component,
        dynamicRules,
      } = props.schema;

      /**
       * 动态判返当前组件校验规则
       * 场景是,需要判断表单中两个值是否相同等，比如两次密码是否一样
       */
      if (isFunction(dynamicRules)) {
        return dynamicRules(unref(getValues));
      }

      let rules = cloneDeep(defRules);

      //组件是否是input
      const isInput = component && ["Input"].includes(component);
      //如果是文本框，则设置 trigger 为 blur
      const ruleTrigger = isInput ? "blur" : "change";

      /**
       * 1.若设置了 required 属性，又没有其他的 rules，就创建一个验证规则；
       * 2.若设置了 required 属性，又设置了 rules，则在 rules 中部存在 required 属性时，才添加验证 required 的规则。
       *   rules 中的 required，优先级大于 required
       */
      if ((!rules || rules.length === 0) && required) {
        rules = [{ required, message: `${label}不为空`, trigger: ruleTrigger }];
      } else {
        //Reflect  反射。has 判断是否存在原型链上。 替代：Object.prototype.hasOwnProperty.call(myObject, 'foo')
        const requiredIndex = rules.findIndex((rule) =>
          Reflect.has(rule, "required")
        );
        if (requiredIndex === -1) {
          rules.push({
            required,
            message: `${label}不为空`,
            trigger: ruleTrigger,
          });
        }
      }

      //移除不显示的校验规则
      const requiredRuleIndex = rules.findIndex(
        (rule) =>
          Reflect.has(rule, "required") || Reflect.has(rule, "validator")
      );
      if (requiredRuleIndex !== -1) {
        const { isShow } = getShow();
        if (!isShow) {
          rules = [];
        }
      }
      return rules;
    }

    //获取组件 props
    const getComponentsProps = computed(() => {
      const { schema, formModel, formActionType } = props;
      let { componentProps = {} } = schema;
      //如果是函数，直接渲染函数
      //函数作用，可用于表单联动操作。A组件选值后，改变B组件的数据列
      if (isFunction(componentProps)) {
        componentProps =
          componentProps({ schema, formModel, formActionType }) ?? {};
      }
      //如果是分割线，单独处理
      if (schema.component === "Divider") {
        componentProps = Object.assign(
          { layout: "horizontal", align: "left" },
          componentProps
        );
      }
      return componentProps;
    });

    //获取组件 disabled 属性
    const getDisabled = computed(() => {
      //表单级别的 disabled 属性，
      const { disabled: globDisabled } = props.formProps;
      const { dynamicDisabled } = props.schema;
      //组件级别的 disabled 属性
      const { disabled: itemDisabled = false } = unref(getComponentsProps);
      //表单级别 高于 组件级别的 disabled
      let disabled = !!globDisabled || itemDisabled;
      if (isBoolean(dynamicDisabled)) {
        disabled = dynamicDisabled;
      }
      if (isFunction(dynamicDisabled)) {
        disabled = dynamicDisabled(unref(getValues));
      }
      return disabled;
    });

    //渲染标签右边温馨提示
    function renderLabelHelpMessage() {
      const { label, helpMessage, helpComponentProps } = props.schema;
      const getHelpMessage = isFunction(helpMessage)
        ? helpMessage(unref(getValues))
        : helpMessage;
      if (
        !getHelpMessage ||
        (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)
      ) {
        return label;
      }
      return (
        <>
          {label}
          <ld-help content={getHelpMessage} {...helpComponentProps}></ld-help>
        </>
      );
    }

    //渲染 form-item 内容
    function renderFormItemComponent() {
      /**
       * component 组件类型，见 ../componentMap
       * changeEvent 控件事件
       * field 字段名
       * label 标签名
       */
      const {
        component,
        changeEvent = "change",
        field,
        renderComponentContent,
        label,
        valueField,
      } = props.schema;

      /** Radio/Checkbox v-model:checked */
      const isCheck = component && ["Checkbox", "Radio"].includes(component);

      //设置监听事件
      const eventKey = `on${upperFirst(changeEvent)}`;

      //执行事件
      const on = {
        [eventKey]: (...args) => {
          const [event] = args;
          if (propsData[eventKey]) {
            //执行组件定义函数
            propsData[eventKey](...args);
          }
          const target = event ? event.target : null;
          const value = target
            ? isCheck
              ? target.checked
              : target.value
            : event;
          //设置 FormModel
          props.setFormModel(field, value);
        },
      };

      //获取组件对应的VNode
      const Comp = componentMap.get(component);
      //组件props
      const propsData = {
        ...unref(getComponentsProps),
        disabled: unref(getDisabled),
      };

      //组件 placeholder

      const isCreatePlaceholder = !propsData.disabled;
      if (isCreatePlaceholder && component !== "DateRangePicker" && component) {
        propsData.placeholder =
          unref(getComponentsProps)?.placeholder ||
          createPlaceholderMessage(component);
      }
      propsData.formValues = unref(getValues);
      // let placeholder =
      //   unref(getComponentsProps).placeholder ||
      //   createPlaceholderMessage(component) + `${label}`;
      // propsData.placeholder = placeholder;

      //如果 "Radio", "Checkbox" 這些组件，需要重新赋值 formValues
      // if (isCheck) {
      //   propsData.formValues = getValues.value;
      // }

      //绑定model
      const bindValue = {
        [valueField || (isCheck ? "checked" : "value")]: props.formModel[field],
      };

      //组件props v-bind
      const compAttr = {
        ...bindValue,
        ...on,
        ...propsData,
      };
      //如果没有设定组件插槽
      if (!renderComponentContent) {
        //返回组件
        return <Comp {...compAttr}></Comp>;
      }
      //Input 插槽
      const compSlot = isFunction(renderComponentContent)
        ? {
            ...renderComponentContent(unref(getValues), {
              disabled: unref(getDisabled),
            }),
          }
        : { default: () => renderComponentContent };
      return <Comp {...compAttr}>{compSlot}</Comp>;
    }

    //渲染组件
    function renderFormItem() {
      const {
        field,
        labelWidth,
        slot,
        help,
        component,
        render,
        ifRightShow = false,
        rightRender,
        itemProps,
      } = props.schema;
      const { requiredMark } = props.formProps;
      const opts = { disabled: unref(getDisabled) };
      //如果是分割线，单独处理
      if (component === "Divider") {
        return (
          <t-col span={12}>
            <t-divider {...unref(getComponentsProps)}>
              {renderLabelHelpMessage()}
            </t-divider>
          </t-col>
        );
      } else {
        //获取组件内容
        const getContent = () => {
          //自定义插槽存在，则渲染插槽组件。否则渲染内置组件
          return slot
            ? getSlot(slots, slot, unref(getValues), opts)
            : render
            ? render(h, unref(getValues), opts)
            : renderFormItemComponent();
        };

        //widget 右侧展示内容
        const getRightContent = () => {
          return (
            ifRightShow && (
              <div class="pl-2">{rightRender(unref(getValues))}</div>
            )
          );
        };

        return (
          <t-form-item
            v-slots={{ label: () => renderLabelHelpMessage() }} //Form Item label插槽
            name={field}
            requiredMark={requiredMark}
            {...itemProps}
            help={help}
            rules={handleRules()}
            labelWidth={labelWidth}
          >
            {getContent()}
            {getRightContent()}
          </t-form-item>
        );
      }
    }

    return () => {
      const {
        colProps = { span: 12 },
        colSlot,
        renderColContent,
        component,
        slot,
      } = props.schema;

      if (!componentMap.has(component) && !slot) {
        return null;
      }

      //判断组件是否显示隐藏
      const { isIfShow, isShow } = getShow();
      const values = unref(getValues);
      const opts = { disabled: unref(getDisabled) };

      const getContent = () => {
        return colSlot
          ? getSlot(slots, colSlot, values, opts)
          : renderColContent
          ? renderColContent(values, opts)
          : renderFormItem();
      };
      return (
        isIfShow && (
          <t-col {...colProps} v-show={isShow}>
            {getContent()}
          </t-col>
        )
      );
    };
  },
});

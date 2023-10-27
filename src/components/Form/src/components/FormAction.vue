<template>
  <t-col v-bind="actionColAttr" v-if="showActionButtonGroup">
    <t-form-item>
      <div
        style="width: 100%"
        :style="{ textAlign: actionColAttr.style.textAlign }"
      >
        <slot name="resetBefore"></slot>
        <t-button
          theme="primary"
          v-if="showSubmitButton"
          v-bind="submitBtnAttr"
          @click="submitAction"
        >
          {{ submitBtnAttr.label }}
        </t-button>
        <slot name="submitBefore"></slot>
        <t-button
          theme="default"
          variant="base"
          v-if="showResetButton"
          v-bind="resetBtnAttr"
          @click="resetAction"
        >
          {{ resetBtnAttr.label }}
        </t-button>
        <slot name="advanceBefore"></slot>
        <t-button
          theme="default"
          variant="base"
          v-if="showAdvancedButton && !hideAdvanceBtn"
          @click="toggleAdvanced"
          >{{ isAdvanced ? "收 起" : "展 开"
          }}<span :class="getAdvancedClass"
            ><IconSvg name="icon-arrowDown" /></span
        ></t-button>
        <slot name="advanceAfter"></slot>
      </div>
    </t-form-item>
  </t-col>
</template>
<script>
import { computed, defineComponent } from "vue";
import VueTypes from "vue-types";
import { useFormContext } from "../hooks/useFormContext";

export default defineComponent({
  name: "FormAction",
  props: {
    showResetButton: VueTypes.bool.def(true),
    showSubmitButton: VueTypes.bool.def(true),
    showActionButtonGroup: VueTypes.bool.def(true),
    actionColOptions: VueTypes.object.def({}),
    resetButtonOptions: VueTypes.object.def({}),
    submitButtonOptions: VueTypes.object.def({}),
    showAdvancedButton: VueTypes.bool.def(false),
    isAdvanced: VueTypes.bool.def(true),
    hideAdvanceBtn: VueTypes.bool.def(true),
  },
  emits: ["toggle-advanced"],
  setup(props, { emit }) {
    //el-col 配置
    const actionColAttr = computed(() => {
      const { actionColOptions } = props;
      const actionColOpt = {
        style: { textAlign: "right" },
        span: 12,
        ...actionColOptions,
      };
      return actionColOpt;
    });

    //重置按钮配置
    const resetBtnAttr = computed(() => {
      return Object.assign({ label: "重 置" }, props.resetButtonOptions);
    });

    //提交按钮配置
    const submitBtnAttr = computed(() => {
      return Object.assign(
        { label: props.showAdvancedButton ? "查 询" : "提 交" },
        props.submitButtonOptions
      );
    });

    const getAdvancedClass = computed(() => {
      return [
        "action-advanced-arrow",
        {
          "action-advanced-arrow--active": props.isAdvanced,
        },
      ];
    });

    function toggleAdvanced() {
      emit("toggle-advanced");
    }

    return {
      actionColAttr,
      resetBtnAttr,
      submitBtnAttr,
      getAdvancedClass,
      toggleAdvanced,
      ...useFormContext(),
    };
  },
});
</script>
<style lang="less" scoped>
.action-advanced-arrow {
  display: inline-block;
  transform: rotate(0deg);
  transition: all 0.3s ease 0.1s;
  transform-origin: center center;
  &--active {
    transform: rotate(180deg);
  }
}
</style>

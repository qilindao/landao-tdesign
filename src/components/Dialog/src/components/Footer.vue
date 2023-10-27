<template>
  <div :class="['ld-dialog__footer', `ld-dialog__footer--${footerAlign}`]">
    <template v-if="!$slots.footer">
      <slot name="insertFooter"></slot>
      <t-button
        v-bind="cancelButtonProps"
        class="t-dialog__cancel"
        theme="default"
        @click="handleClose"
        v-if="isShowCancelBtn"
      >
        {{ cancelText }}</t-button
      >
      <slot name="centerFooter"></slot>
      <t-button
        class="t-dialog__confirm"
        :theme="okType"
        :loading="confirmLoading"
        :disabled="confirmLoading"
        @click="handleOk"
        v-bind="okButtonProps"
        v-if="isShowOkBtn"
      >
        {{ okText }}</t-button
      >
      <slot name="appendFooter"></slot>
    </template>
    <template v-else>
      <slot name="footer"></slot>
    </template>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { FooterProps } from "../props";

export default defineComponent({
  name: "DialogFooter",
  props: FooterProps,
  inheritAttrs: false,
  emits: ["ok", "close"],
  setup(props, { emit }) {
    function handleOk() {
      emit("ok");
    }
    function handleClose() {
      emit("close");
    }
    return {
      handleOk,
      handleClose,
    };
  },
});
</script>

<style lang="less" scoped>
.ld-dialog__footer {
  text-align: right;
  &--left {
    text-align: left;
  }
  &--center {
    text-align: center;
  }
}
</style>

<template>
  <div
    :class="['ld-dialog__footer', `ld-dialog__footer--${footerAlign}`]"
    v-if="isShowFooter"
  >
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
        v-bind="okButtonProps"
        :theme="okType"
        :loading="confirmLoading"
        :disabled="confirmLoading"
        @click="handleOk"
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
import { defineComponent, toRefs } from "vue";
import { FooterProps } from "../props";

export default defineComponent({
  name: "DialogFooter",
  props: FooterProps,
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

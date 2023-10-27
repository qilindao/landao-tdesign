<template>
  <div
    :class="['ld-drawer__footer']"
    :style="{
      display: 'flex',
      justifyContent: attrs.placement === 'right' ? 'flex-start' : 'flex-end',
    }"
  >
    <template v-if="!$slots.footer">
      <template v-if="attrs.placement === 'right'">
        <t-button
          class="t-drawer__confirm"
          :theme="okType"
          :loading="confirmLoading"
          :disabled="confirmLoading"
          @click="handleOk"
          v-bind="okButtonProps"
          v-if="isShowOkBtn"
        >
          {{ okText }}</t-button
        >
      </template>
      <t-button
        v-bind="cancelButtonProps"
        class="t-drawer__cancel"
        theme="default"
        @click="handleClose"
        v-if="isShowCancelBtn"
      >
        {{ cancelText }}</t-button
      >
      <template v-if="attrs.placement !== 'right'">
        <t-button
          class="t-drawer__confirm"
          :theme="okType"
          :loading="confirmLoading"
          :disabled="confirmLoading"
          @click="handleOk"
          v-bind="okButtonProps"
          v-if="isShowOkBtn"
        >
          {{ okText }}</t-button
        >
      </template>
      <slot name="appendFooter"></slot>
    </template>
    <template v-else>
      <slot name="footer"></slot>
    </template>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from "vue";
import { FooterProps } from "../props";

export default defineComponent({
  name: "DrawerFooter",
  props: FooterProps,
  inheritAttrs: false,
  emits: ["ok", "close"],
  setup(props, { emit }) {
    const { attrs } = getCurrentInstance();
    function handleOk() {
      emit("ok");
    }
    function handleClose() {
      emit("close");
    }
    return {
      attrs,
      handleOk,
      handleClose,
    };
  },
});
</script>

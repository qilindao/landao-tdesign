<template>
  <span :class="getClass">
    {{ title }}
    <BasicHelp
      class="ld-basic-title-help"
      v-if="helpMessage"
      :content="helpMessage"
      placement="right"
      iconSize="16px"
    />
  </span>
</template>
<script setup>
import { computed } from "vue";
import BasicHelp from "../../../Help/src";
defineOptions({ name: "DialogHeader" });
const props = defineProps({
  helpMessage: {
    type: [String, Array],
    default: "",
  },
  title: { type: String },
});

const prefixCls = "ld-dialog-header";

const getClass = computed(() => [prefixCls]);
</script>
<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-dialog-header";

.@{prefix-cls} {
  display: flex;
  position: relative;
  padding-left: 7px;
  color: var(--td-gray-color-14);
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  cursor: pointer;
  user-select: none;

  &-normal {
    font-size: 14px;
    font-weight: 500;
  }

  &-show-span::before {
    content: "";
    position: absolute;
    top: 4px;
    left: 0;
    width: 3px;
    height: 16px;
    margin-right: 4px;
    background-color: var(--td-text-color-brand);
  }

  &-help {
    margin-left: 10px;
  }
}
</style>

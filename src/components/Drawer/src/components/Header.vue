<template>
  <span :class="prefixCls" v-if="!isDetail">
    {{ !$slots.title ? title : "" }}
  </span>
  <div :class="[prefixCls, `${prefixCls}--detail`]" v-else>
    <span :class="`${prefixCls}__twrap`">
      <span @click="handleClose" v-if="showDetailBack">
        <t-icon name="arrow-left" :class="`${prefixCls}__back`"></t-icon>
      </span>
      <span v-if="title">{{ title }}</span>
    </span>

    <span :class="`${prefixCls}__toolbar`">
      <slot name="titleToolbar"></slot>
    </span>
  </div>
</template>
<script setup>
defineOptions({ name: "DrawerHeader" });
const props = defineProps({
  isDetail: { type: Boolean },
  title: { type: String },
  showDetailBack: { type: Boolean },
});

const prefixCls = "ld-drawer-header";

const emit = defineEmits(["close"]);

function handleClose() {
  emit("close");
}
</script>
<style lang="less" scoped>
@prefix-cls: ~"@{namespace}-drawer-header";
.@{prefix-cls} {
  display: flex;
  align-items: center;
  height: 100%;

  &__back {
    cursor: pointer;

    &:hover {
      color: var(--td-gray-color-14);
    }
  }

  &__twrap {
    flex: 1;
  }

  &__toolbar {
    padding-right: 50px;
  }
}
</style>

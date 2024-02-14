<template>
  <t-loading size="small" :loading="loading" show-overlay>
    <t-tree
      ref="menuTree"
      :data="menuData"
      v-model="modelValue"
      activable
      hover
      transition
      expandAll
      :keys="{ value: 'menuId' }"
      :expand-on-click-node="false"
      :checkable="checkable"
      :check-strictly="checkStrictly"
      :value-mode="valueMode"
      :empty="'请选择并点击角色'"
    >
      <template #label="{ node }">
        <t-icon v-if="node.data.meta.icon" :name="node.data.meta.icon" />
        <span style="margin-left: 6px">{{ node.data.meta.title }}</span>
      </template>
    </t-tree>
  </t-loading>
</template>

<script setup>
import { ref, watch, unref } from "vue";
import { getMenuList } from "@/api/modules/system/menu";
import { useRequest, useBoolean } from "@/landao/hooks";
import { deepTree } from "@/landao/utils";

defineOptions({
  name: "RoleAuth",
});

const modelValue = defineModel({ type: Array });
const checkable = ref(true);
const checkStrictly = ref(false);
const valueMode = ref("onlyLeaf");

const [isFirstLoad, { setTrue }] = useBoolean(false);

const menuData = ref([]);
const { loading, run } = useRequest(getMenuList, {
  onSuccess: (res) => {
    menuData.value = deepTree(res.data);
    setTrue();
  },
  manual: true,
});

watch(
  () => modelValue,
  () => {
    !unref(isFirstLoad) && run();
  },
  { deep: true }
);
</script>

<style scoped></style>

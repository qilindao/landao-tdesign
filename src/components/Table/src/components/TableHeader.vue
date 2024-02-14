<template>
  <div class="ld-table-header">
    <t-button v-if="buttons.includes('refresh')" @click="handleReload">
      刷新
    </t-button>

    <t-button
      v-if="buttons.includes('refreshCurrent')"
      @click="handlerefreshCurrent"
      >刷新当前页</t-button
    >
    <template v-if="slots.toolbar">
      <slot name="toolbar"></slot>
    </template>
  </div>
</template>
<script>
import { defineComponent, useSlots, reactive, unref } from "vue";

export default defineComponent({
  name: "TableHeader",
  components: {},
  props: {
    buttons: {
      type: Array,
      default: () => [],
    }, //["refresh", "add"]
    tableAction: {
      type: Object,
      default: null,
    },
  },
  emits: ["columns-change"],
  setup(props, { emit }) {
    const slots = useSlots();
    const { tableAction } = props;

    //刷新返回第一页
    async function handleReload() {
      await tableAction.reload({
        page: 1,
      });
    }

    //刷新当前页
    async function handlerefreshCurrent() {
      const { currentPage = 1 } = unref(tableAction.getPaginationInfo);
      await tableAction.reload({ page: currentPage });
    }

    return {
      slots,
      handleReload,
      handlerefreshCurrent,
    };
  },
});
</script>
<style lang="less" scoped>
.ld-table-header {
  display: flex;
  align-items: center;
  margin: 10px 0px;
  &:first-child {
    margin-top: 0px;
  }
  &__rightwrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>

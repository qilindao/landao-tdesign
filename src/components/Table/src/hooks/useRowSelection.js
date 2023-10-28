import { ref, unref, watch, nextTick, toRaw } from "vue";
import { isArray } from "@/landao/utils/is";

export function useRowSelection(emit) {
  const selectedRowKeysRef = ref([]);
  const selectedRowRef = ref([]);

  /**
   * 获取选中行key
   * @returns
   */
  function getSelectRowKeys() {
    return unref(selectedRowKeysRef);
  }

  /**
   * 获取选中行数据
   * @returns
   */
  function getSelectRows() {
    return unref(selectedRowRef);
  }

  /**
   * 选中行变化时，设置
   */
  function setSelectedRow(rowKeys, selectedRowData) {
    selectedRowKeysRef.value = rowKeys;
    selectedRowRef.value = selectedRowData ?? [];
  }

  /**
   * 设置默认选中行keys
   * @param {String | Number | Array} rowKeys
   */
  function setSelectedRowKeys(rowKeys) {
    selectedRowKeysRef.value = isArray(rowKeys) ? rowKeys : [rowKeys];
  }

  /**
   * 清空选中行
   */
  function clearSelectedRowKeys() {
    selectedRowRef.value = [];
    selectedRowKeysRef.value = [];
  }

  /**
   *  根据 key 删除取消选中行
   * @param {String | Number} rowKey
   */
  function deleteSelectRowByKey(rowKey) {
    const selectedRowKeys = unref(selectedRowKeysRef);
    const index = selectedRowKeys.findIndex((item) => item === rowKey);
    if (index !== -1) {
      unref(selectedRowKeysRef).splice(index, 1);
    }
  }

  watch(
    () => unref(selectedRowKeysRef),
    () => {
      nextTick(() => {
        emit("select-change", {
          rowKeys: getSelectRowKeys(),
          rows: getSelectRows(),
        });
      });
    },
    {
      deep: true,
    }
  );

  return {
    getSelectRowKeys,
    setSelectedRow,
    getSelectRows,
    setSelectedRowKeys,
    clearSelectedRowKeys,
    deleteSelectRowByKey,
  };
}

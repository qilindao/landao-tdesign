import { ref, unref } from "vue";
export function useRowExpanded(propsRef, emit) {
  //展开行keys
  const expandedRowKeys = ref([]);

  /**
   * 展开行发生变化触发
   * @param {*} value
   * @param {*} params
   */
  const expandChange = (value, params) => {
    expandedRowKeys.value = value;
    emit("expand-change", { rowKeys: value, options: params });
  };

  const getExpandRowKeys = () => {
    return unref(expandedRowKeys);
  };

  return {
    expandChange,
    getExpandRowKeys,
  };
}

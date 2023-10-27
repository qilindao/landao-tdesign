import { ref, unref, watchEffect, watch, computed, onMounted } from "vue";
import { isFunction, isBoolean } from "@/landao/utils/is";
import {
  PAGE_SIZE,
  PAGE_FIELD,
  PAGE_SIZE_FIELD,
  LIST_FIELD,
  TOTAL_FIELD,
  ROW_KEY,
} from "../constant";
import { get, merge } from "lodash-es";
import { useTimeoutFn } from "@vueuse/core";

export function useDataSource(
  propsRef,
  { tableData, setLoading, getPaginationInfo, setPagination },
  emit
) {
  //数据源
  const dataSourceRef = ref([]);

  watchEffect(() => {
    tableData.value = unref(dataSourceRef);
  });

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource, api } = unref(propsRef);
      !api && dataSource && (dataSourceRef.value = dataSource);
    },
    {
      immediate: true,
    }
  );

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef);
    return rowKey || ROW_KEY;
  });

  const getDataSourceRef = computed(() => {
    return unref(dataSourceRef);
  });

  const fetch = async (opt) => {
    const { api, searchInfo, beforeFetch, afterFetch, pagination } =
      unref(propsRef);

    if (!api || !isFunction(api)) return;
    try {
      setLoading(true);
      let pageParams = {};
      const { current = 1, pageSize = PAGE_SIZE } = unref(getPaginationInfo);
      if (
        (isBoolean(pagination) && !pagination) ||
        isBoolean(getPaginationInfo)
      ) {
        pageParams = {};
      } else {
        pageParams[PAGE_FIELD] = (opt && opt.page) || current;
        pageParams[PAGE_SIZE_FIELD] = pageSize;
      }
      let params = merge(
        pageParams,
        searchInfo,
        opt?.searchInfo ?? {},
        opt?.sortInfo ?? {},
        opt?.filterInfo ?? {}
      );
      if (beforeFetch && isFunction(beforeFetch)) {
        params = (await beforeFetch(params)) || params;
      }
      const result = await api(params);

      const { data } = result;

      const isArrayResult = Array.isArray(data);

      let resultItems = isArrayResult ? data : get(data, LIST_FIELD);
      const resultTotal = isArrayResult
        ? data.length
        : get(data.pagination, TOTAL_FIELD);

      if (Number(resultTotal)) {
        const currentTotalPage = Math.ceil(resultTotal / pageSize);
        if (current > currentTotalPage) {
          setPagination({
            current: currentTotalPage,
          });
          return await fetch(opt);
        }
      }

      //对返回值进行处理，比如将数据转成树形数据，或对加密数据进行解密或脱敏
      if (afterFetch && isFunction(afterFetch)) {
        resultItems = (await afterFetch(resultItems)) || resultItems;
      }
      dataSourceRef.value = resultItems;
      setPagination({
        total: resultTotal || 0,
      });
      if (opt && opt.page) {
        setPagination({
          current: opt.page || 1,
        });
      }
      emit("fetch-success", {
        list: unref(resultItems),
        total: resultTotal,
      });
      return resultItems;
    } catch (error) {
      emit("fetch-error", error);
      dataSourceRef.value = [];
      setPagination({
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  function setTableData(values) {
    dataSourceRef.value = values;
  }

  /**
   * 获取数据源
   * @returns
   */
  function getDataSource() {
    return getDataSourceRef.value;
  }

  /**
   * 根据索引更新指定数据源数据
   * @param {Number} rowIndex
   * @param {Object} editedRow
   */
  function updateRowByIdx(rowIndex, editedRow) {
    getDataSourceRef.value.splice(rowIndex, 1, editedRow);
  }

  /**
   * 根据索引删除某条数据
   * @param {Number} rowIndex
   */
  function deleteRowByIdx(rowIndex) {
    getDataSourceRef.value.splice(rowIndex, 1);
  }

  async function reload(opt) {
    return await fetch(opt);
  }

  onMounted(() => {
    useTimeoutFn(() => {
      unref(propsRef).immediate && fetch();
    }, 16);
  });

  return {
    getDataSourceRef,
    getDataSource,
    setTableData,
    fetch,
    reload,
    getRowKey,
    updateRowByIdx,
    deleteRowByIdx,
  };
}

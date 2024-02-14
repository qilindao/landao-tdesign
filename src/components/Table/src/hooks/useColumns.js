import { ref, unref, computed, toRaw, watch } from "vue";
import { isBoolean, isFunction } from "@/landao/utils/is";
import {
  PAGE_SIZE,
  INDEX_COLUMN_FLAG,
  INDEX_COLUMN_TITLE,
  DEFAULT_ALIGN,
} from "../constant";
import { usePermission } from "@/landao/hooks";
import { cloneDeep } from "lodash-es";

function handleItem(item, ellipsis) {
  const { colKey, children } = item;
  item.align = item.align || DEFAULT_ALIGN;
}

/**
 * 表格序列号
 * @param {*} propsRef
 * @param {*} getPaginationRef
 * @param {*} columns
 * @returns
 */
function handleIndexColumn(propsRef, getPaginationRef, columns) {
  const { showIndexColumn } = unref(propsRef);
  let pushIndexColumns = false;
  columns.forEach(() => {
    const indIndex = columns.findIndex(
      (column) => column.flag === INDEX_COLUMN_FLAG
    );
    if (showIndexColumn) {
      pushIndexColumns = indIndex === -1;
    } else if (!showIndexColumn && indIndex !== -1) {
      columns.splice(indIndex, 1);
    }
  });
  if (!pushIndexColumns) return;
  const isFixedLeft = columns.some((item) => item.fixed === "left");

  columns.unshift({
    title: INDEX_COLUMN_TITLE,
    colKey: INDEX_COLUMN_FLAG,
    align: "center",
    width: 70,
    cell: (h, { rowIndex, colIndex }) => {
      const getPagination = unref(getPaginationRef);
      if (isBoolean(getPagination)) {
        return `${rowIndex + 1}`;
      }
      const { current = 1, pageSize = PAGE_SIZE } = getPagination;
      return ((current < 1 ? 1 : current) - 1) * pageSize + index + 1;
    },
    ...(isFixedLeft ? { fixed: "left" } : {}),
  });
}

export function useColumns(propsRef, getPaginationRef) {
  const columnsRef = ref(unref(propsRef).columns);
  let cacheColumns = unref(propsRef).columns;

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef));
    handleIndexColumn(propsRef, getPaginationRef, columns);
    if (!columns) {
      return [];
    }
    columns.forEach((column) => {
      handleItem(column);
    });
    return columns;
  });

  function isIfShow(column) {
    const ifShow = column.ifShow;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column);
    }
    return isIfShow;
  }

  const { hasAuth } = usePermission();

  const getViewColumns = computed(() => {
    const viewColumns = unref(getColumnsRef);
    const columns = cloneDeep(viewColumns);
    return columns.filter((column) => hasAuth(column.auth) && isIfShow(column));
  });

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      columnsRef.value = columns;
      //   cacheColumns = columns?.filter(item);
    }
  );

  function getColumns() {
    const columns = toRaw(unref(getColumnsRef));
    return columns;
  }

  return {
    getColumnsRef,
    getColumns,
    getViewColumns,
  };
}

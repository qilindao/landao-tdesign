<template>
  <div ref="wrapRef">
    <t-table
      ref="tableElRef"
      v-bind="getBindValues"
      @page-change="handlePageChange"
      @row-edit="editTableRow"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <template #empty>
        <ld-empty :desc="emptyDesc" />
      </template>
    </t-table>
  </div>
</template>

<script>
import { computed, defineComponent, ref, toRaw, unref } from "vue";
import { basicProps } from "./props";
import { useLoading } from "./hooks/useLoading";
import { useDataSource } from "./hooks/useDataSource";
import { usePagination } from "./hooks/usePagination";
import { createTableContext } from "./hooks/useTableContext";
import { useColumns } from "./hooks/useColumns";
import { useEditTableRow } from "./hooks/useEditTableRow";
import { useRowSelection } from "./hooks/useRowSelection";
import { omit } from "lodash-es";

export default defineComponent({
  name: "LdTable",
  props: basicProps,
  emits: ["fetch-success", "fetch-error", "register", "select-change"],
  setup(props, { attrs, emit, slots, expose }) {
    const wrapRef = ref(null);

    const tableElRef = ref(null);

    const tableData = ref([]);

    const innerPropsRef = ref();

    const getProps = computed(() => {
      return { ...props, ...unref(innerPropsRef) };
    });

    const { getLoading, setLoading } = useLoading(getProps);

    const {
      getPaginationInfo,
      getPagination,
      setPagination,
      setShowPagination,
      getShowPagination,
    } = usePagination(getProps);

    const {
      getDataSourceRef,
      getDataSource,
      setTableData,
      fetch,
      getRowKey,
      reload,
      updateRowByIdx,
      deleteRowByIdx,
    } = useDataSource(
      getProps,
      { tableData, getPaginationInfo, setLoading, setPagination },
      emit
    );

    const { getColumnsRef, getColumns, getViewColumns } = useColumns(
      getProps,
      getPaginationInfo
    );

    const {
      onCancelEditRow,
      onEditRow,
      editTableRow,
      getEditableRowKeys,
      setCurrentSaveId,
      getEditableKeysMap,
      updateEditState,
      getCurrentSaveId,
      getIsEditable,
      validateRowData,
      validateTableData,
    } = useEditTableRow(tableElRef, getRowKey);

    const {
      getSelectRowKeys,
      setSelectedRow,
      getSelectRows,
      setSelectedRowKeys,
      clearSelectedRowKeys,
      deleteSelectRowByKey,
    } = useRowSelection(emit);

    const getBindValues = computed(() => {
      const dataSource = unref(getDataSourceRef);
      let propsData = {
        ...attrs,
        ...unref(getProps),
        loading: unref(getLoading),
        tableLayout: "fixed",
        data: dataSource,
        columns: toRaw(unref(getViewColumns)),
        disableDataPage: true,
        rowKey: unref(getRowKey),
        pagination: unref(getPaginationInfo)
          ? toRaw(unref(getPaginationInfo))
          : null,
        editableRowKeys: unref(getEditableRowKeys()), //修改行
        selectedRowKeys: getSelectRowKeys(), //单选，多选中行
        onSelectChange: (value, { selectedRowData }) => {
          //选中行发生变化时触发
          setSelectedRow(value, selectedRowData);
        },
      };
      propsData = omit(propsData, ["onPageChange", "dataSource"]);
      return propsData;
    });

    function setProps(props) {
      innerPropsRef.value = { ...unref(innerPropsRef), ...props };
    }

    //分页发生变化时触发
    async function handlePageChange(pagination) {
      setPagination(pagination);
      await reload();
    }

    const tableAction = {
      reload,
      setPagination,
      setTableData,
      setLoading,
      getDataSource,
      setProps,
      getPaginationRef: getPagination,
      getColumns,
      emit,
      getRowKey,
      getSize: () => {
        return unref(getBindValues).size;
      },
      onCancelEditRow,
      onEditRow,
      editTableRow,
      getEditableRowKeys,
      setCurrentSaveId,
      getEditableKeysMap,
      updateEditState,
      getCurrentSaveId,
      getIsEditable,
      validateRowData,
      validateTableData,
      updateRowByIdx,
      deleteRowByIdx,
      getSelectRowKeys,
      getSelectRows,
      setSelectedRowKeys,
      clearSelectedRowKeys,
      deleteSelectRowByKey,
    };
    createTableContext({ ...tableAction, wrapRef, getBindValues });
    expose(tableAction);
    emit("register", tableAction);

    return {
      wrapRef,
      tableElRef,
      getBindValues,
      handlePageChange,
      editTableRow,
    };
  },
});
</script>

<style scoped></style>

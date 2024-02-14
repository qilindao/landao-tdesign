<template>
  <div ref="wrapRef">
    <TableHeader v-bind="getToolbarProps" :tableAction="tableAction">
      <template v-if="$slots.toolbar" #toolbar="{}">
        <slot name="toolbar"></slot>
      </template>
    </TableHeader>
    <!-- 树形组件，columns 必须通过 LdTable 传递，不能通过 useTable 传递，否则 useTreeData.tsx 初始化报错-->
    <t-enhanced-table
      v-if="isTreeTable"
      ref="tableElRef"
      v-bind="getBindValues"
      @page-change="handlePageChange"
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <template #expandedRow="data">
        <slot name="expandedRow" v-bind="data || {}"></slot>
      </template>
      <template #empty>
        <ld-empty :desc="emptyDesc" />
      </template>
    </t-enhanced-table>
    <t-table
      ref="tableElRef"
      v-bind="getBindValues"
      @page-change="handlePageChange"
      @row-edit="editTableRow"
      v-else
    >
      <template #[item]="data" v-for="item in Object.keys($slots)" :key="item">
        <slot :name="item" v-bind="data || {}"></slot>
      </template>
      <template #expandedRow="data">
        <slot name="expandedRow" v-bind="data || {}"></slot>
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
import { useRowExpanded } from "./hooks/useRowExpanded";
import { omit } from "lodash-es";
import TableHeader from "./components/TableHeader";

export default defineComponent({
  name: "LdTable",
  props: basicProps,
  emits: [
    "fetch-success",
    "fetch-error",
    "register",
    "select-change",
    "expand-change",
  ],
  components: {
    TableHeader,
  },
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

    const { getExpandRowKeys, expandChange } = useRowExpanded(getProps, emit);
    
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
        //展开行keys
        expandedRowKeys: getExpandRowKeys(),
        //展开行发生变化时触发
        onExpandChange: (value, params) => {
          expandChange(value, params);
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

    //表格头部刷新按钮,button,在hook调用的时候合并
    const toolbarPropsRef = ref({});

    //TableHeader props
    const getToolbarProps = computed(() => {
      const { actionButtons = [] } = props;
      const opt = {
        buttons: [...actionButtons],
      };
      return {
        ...opt,
        ...unref(toolbarPropsRef),
      };
    });

    //设置toolbar button 属性
    const setToolbarProps = (props) => {
      toolbarPropsRef.value = { ...unref(toolbarPropsRef), ...props };
    };

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
      getExpandRowKeys,
      setToolbarProps,
    };
    createTableContext({ ...tableAction, wrapRef, getBindValues });
    expose(tableAction);
    emit("register", tableAction);

    return {
      wrapRef,
      tableElRef,
      getBindValues,
      getColumnsRef,
      handlePageChange,
      editTableRow,
      tableAction,
      getToolbarProps,
    };
  },
});
</script>

<style scoped></style>

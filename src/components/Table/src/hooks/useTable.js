import { ref, unref, onUnmounted, watch, toRaw } from "vue";
import { isProd } from "@/landao/env";
import { getDynamicProps } from "@/landao/utils";

export function useTable(tableProps) {
  const tableRef = ref(null);
  const loadedRef = ref(false);

  let stopWatch;

  function register(instance) {
    isProd() &&
      onUnmounted(() => {
        tableRef.value = null;
        loadedRef.value = null;
      });

    if (unref(loadedRef) && isProd() && instance === unref(tableRef)) return;

    tableRef.value = instance;
    tableProps && instance.setProps(getDynamicProps(tableProps));


    if (tableRef) {
      //设置表格头部刷新按钮
      const {
        actionButtons = []
      } = tableProps;
      instance.setToolbarProps({
        buttons: [...actionButtons],
      });
    }


    loadedRef.value = true;

    stopWatch?.();

    stopWatch = watch(
      () => tableProps,
      () => {
        tableProps && instance.setProps(getDynamicProps(tableProps));
      },
      {
        immediate: true,
        deep: true,
      }
    );
  }

  function getTableInstance() {
    const table = unref(tableRef);
    if (!table) {
      throw console.warn("table 实例获取不到，请确保 table 已渲染完成");
    }
    return table;
  }

  const methods = {
    reload: async (opt) => {
      return await getTableInstance().reload(opt);
    },
    setProps: (props) => {
      getTableInstance().setProps(props);
    },
    setLoading: (loading) => {
      getTableInstance().setLoading(loading);
    },
    getDataSource: () => {
      return getTableInstance().getDataSource();
    },
    getColumns: () => {
      const columns = getTableInstance().getColumns() || [];
      return toRaw(columns);
    },
    setPagination: (info) => {
      return getTableInstance().setPagination(info);
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef();
    },
    getSize: () => {
      return toRaw(getTableInstance().getSize());
    },
    /**
     * 根据索引更新指定数据源数据
     * @param {Number} rowIndex
     * @param {Object} editedRow
     * @returns
     */
    updateRowByIdx: (rowIndex, editedRow) => {
      return toRaw(getTableInstance().updateRowByIdx(rowIndex, editedRow));
    },
    /**
     * 根据索引删除某条数据
     * @param {Number} rowIndex
     * @returns
     */
    deleteRowByIdx: (rowIndex) => {
      return toRaw(getTableInstance().deleteRowByIdx(rowIndex));
    },
    //获取修改行信息
    getEditableRowKeys: () => {
      return toRaw(getTableInstance().getEditableRowKeys());
    },
    //设置当前修改行id
    setCurrentSaveId: (id) => {
      return toRaw(getTableInstance().setCurrentSaveId(id));
    },
    getEditableKeysMap: () => {
      return toRaw(getTableInstance().getEditableKeysMap());
    },
    updateEditState: (id) => {
      return toRaw(getTableInstance().updateEditState(id));
    },
    getCurrentSaveId: () => {
      return toRaw(getTableInstance().getCurrentSaveId());
    },
    getIsEditable: (id) => {
      return toRaw(getTableInstance().getIsEditable(id));
    },
    onCancelEditRow: (id) => {
      return toRaw(getTableInstance().onCancelEditRow(id));
    },
    editTableRow: (params) => {
      return toRaw(getTableInstance().editTableRow(params));
    },
    onEditRow: (id) => {
      return toRaw(getTableInstance().onEditRow(id));
    },
    validateRowData: (rowValue) => {
      return toRaw(getTableInstance().validateRowData(rowValue));
    },
    validateTableData: async () => {
      return toRaw(getTableInstance().validateTableData());
    },
    /**
     * 获取选中行key
     * @returns
     */
    getSelectRowKeys: () => {
      return toRaw(getTableInstance().getSelectRowKeys());
    },
    /**
     * 获取选中行数据
     * @returns
     */
    getSelectRows: () => {
      return toRaw(getTableInstance().getSelectRows());
    },
    /**
     * 设置默认选中行keys
     * @param {String | Number | Array} rowKeys
     */
    setSelectedRowKeys: (rowKeys) => {
      getTableInstance().setSelectedRowKeys(rowKeys);
    },
    /**
     * 清空选中行
     */
    clearSelectedRowKeys: () => {
      getTableInstance().clearSelectedRowKeys();
    },
    /**
     *  根据 key 删除取消选中行
     * @param {String | Number} rowKey
     */
    deleteSelectRowByKey: (rowKey) => {
      getTableInstance().deleteSelectRowByKey(rowKey);
    },
    /**
     * 获取展开行RowKeys
     */
    getExpandRowKeys: () => {
      getTableInstance().getExpandRowKeys();
    },
  };

  return [register, methods];
}

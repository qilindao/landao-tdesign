import { ref, unref } from "vue";

export function useEditTableRow(tableElRef, getRowKey) {
  const editableRowKeys = ref([]);

  //当前修改id
  const currentSaveId = ref("");
  //保存变化过的表格行信息
  const editableKeysMap = {};

  // 更新 editableRowKeys
  const updateEditState = (id) => {
    const index = editableRowKeys.value.findIndex((t) => t === id);
    editableRowKeys.value.splice(index, 1);
  };

  /**
   * 取消修改
   * @param {*} e
   */
  const onCancelEditRow = (id) => {
    updateEditState(id);
    tableElRef.value.clearValidateData();
  };

  /**
   * 修改行
   * @param {*} params
   */
  const editTableRow = (params) => {
    const { row, col, value } = params;
    const oldRowData = editableKeysMap[row[unref(getRowKey)]]?.editedRow || row;
    const editedRow = { ...oldRowData, [col.colKey]: value };
    editableKeysMap[row[unref(getRowKey)]] = {
      ...params,
      editedRow,
    };
  };

  const getEditableRowKeys = () => {
    return editableRowKeys;
  };

  const setCurrentSaveId = (id) => {
    currentSaveId.value = id;
  };

  const getCurrentSaveId = () => {
    return currentSaveId.value;
  };

  const getEditableKeysMap = () => {
    return editableKeysMap[currentSaveId.value];
  };

  const getIsEditable = (id) => {
    return editableRowKeys.value.includes(id);
  };

  const onEditRow = (id) => {
    if (!editableRowKeys.value.includes(id)) {
      editableRowKeys.value.push(id);
    }
  };

  /**
   * 校验行信息
   * @param {*} rowValue
   * @returns
   */
  const validateRowData = (rowValue) => {
    return tableElRef.value.validateRowData(rowValue);
  };

  const validateTableData = async () => {
    return await tableElRef.value.validateTableData();
  };

  return {
    onCancelEditRow,
    onEditRow,
    editTableRow,
    getEditableRowKeys,
    setCurrentSaveId,
    getCurrentSaveId,
    getEditableKeysMap,
    updateEditState,
    getIsEditable,
    validateRowData,
    validateTableData,
  };
}

import { ref, unref, watch, computed, onMounted } from "vue";
import { isFunction } from "lodash-es";
import { useMessage } from "../tdesign/useMessage";
import { DialogPlugin } from "tdesign-vue-next";

const DEFAULT_MESSAGE = {
  GET_DATA_IF_FAILED: "获取列表数据失败",
  EXPORT_DATA_IF_FAILED: "导出数据失败",
};
/**
 * 分页列表数据
 * @param {Function} apiRequestFn 数据列表请求函数
 * @param {Object} option {
 *                          immediate = true, // 是否立即请求
 *                          message, // 提示信息
 *                          filterOption, // ref 筛选条件
 *                          requestSuccess, // 数据列表请求成功后执行函数
 *                          afterFetch,//对请求返回的值进行处理，比如对加密字段进行解密
 *                          requestError, // 数据列表请求失败后执行函数
 *                          exportRequestFn,// 导出请求函数
 *                          exportSuccess,// 导出请求成功执行函数
 *                          exportError // 导出请求失败执行函数
 *                        }
 * @param {Function}  deleteDataFunc  删除函数
 *
 * @returns
 */
export function useFetchList(apiRequestFn, option = {}) {
  const {
    immediate = true, //是否立即请求
    message = DEFAULT_MESSAGE, //提示信息
    filterOption = ref(), //搜索条件
    exportRequestFn = undefined, //导出函数
    deleteDataFunc = undefined,
  } = option;
  const { GET_DATA_IF_FAILED, EXPORT_DATA_IF_FAILED } = message;
  /** 加载状态 */
  const loading = ref(false);
  /** 当前页 */
  const currentPage = ref(1);
  /** 每一页的数据量 */
  const pageSize = ref(20);
  /** 数据总条数 */
  const total = ref(0);

  //列表数据
  const dataSource = ref([]);

  /**
   * 设置加载状态
   * @param {Boolean} state
   */
  const setLoading = (state) => {
    loading.value = state || false;
  };

  const { createErrorMsg, createSuccessMsg, createWarningMsg } = useMessage();

  /**
   * 获取列表数据
   * @param {Number} page 页码
   */
  const fetch = (page = currentPage.value, size = pageSize.value) => {
    if (!apiRequestFn || !isFunction(apiRequestFn)) {
      throw console.error("useFetchList 当前没有提供 apiRequestFn 函数。");
    }
    // 兼容page可能是event
    const requestPage = typeof page === "object" ? unref(currentPage) : page;
    return new Promise(async (resolve) => {
      setLoading(true);
      try {
        const { data, code, message } = await apiRequestFn({
          page: requestPage,
          page_size: size,
          ...filterOption.value,
        });
        const isArrayResult = Array.isArray(data);
        let resultItem = [];
        if (isArrayResult) {
          resultItem = data;
        } else {
          const { list, pagination } = data;
          resultItem = list;
          if (pagination) {
            //设置页码
            currentPage.value = pagination.current_page || 1;
            //设置总条数
            total.value = pagination.total || 0;
          }
        }
        //对返回值进行处理，比如将数据转成树形数据，或对加密数据进行解密或脱敏
        if (option.afterFetch && isFunction(option.afterFetch)) {
          resultItem = (await option.afterFetch(resultItem)) || resultItem;
        }
        dataSource.value = resultItem;
        /** 请求成功之后执行函数 */
        option?.requestSuccess?.();
        resolve({
          list: dataSource.value,
          pagination,
        });
      } catch (error) {
        createErrorMsg(GET_DATA_IF_FAILED);
        /** 请求失败之后执行函数 */
        option?.requestError?.();
      } finally {
        //取消加载
        setLoading(false);
      }
    });
  };

  /**
   * 清空筛选器字段
   * @returns
   */
  const reset = () => {
    if (!filterOption.value) return;
    const keys = Reflect.ownKeys(filterOption.value);
    keys.forEach((key) => {
      Reflect.set(filterOption.value, key, "");
    });
    fetch();
  };

  /**
   * 筛选
   */
  const filter = () => {
    //当前分页为第一页时，需要执行fetch。否则直接设置分页，监听分页自动请求
    if (currentPage.value == 1) {
      fetch(currentPage.value);
    } else {
      currentPage.value = 1;
    }
  };

  /**
   * 导出数据
   */
  const exportFile = async () => {
    if (!exportRequestFn || !isFunction(exportRequestFn)) {
      throw console.error("useFetchList 当前没有提供 exportRequestFn 函数。");
    }
    try {
      const {
        data: { link },
      } = await exportRequestFn(filterOption.value);
      window.open(link);
      option?.exportSuccess?.();
    } catch (error) {
      createErrorMsg(EXPORT_DATA_IF_FAILED);
      option?.exportError?.();
    }
  };

  //表格当前选中行的唯一标识数组
  const selectedRowKeys = ref([]);
  /**
   * 选中行发生变化时触发
   * @param {*} value
   * @param {*} param1
   */
  const handleSelectionChange = (value, { selectedRowData }) => {
    selectedRowKeys.value = value;
  };

  /**
   * 单个/批量删除
   * @param {*} id
   * @returns
   */
  const doDelete = (id) => {
    if (!deleteDataFunc || !isFunction(deleteDataFunc)) {
      throw console.error("useFetchList 当前没有提供 deleteDataFunc 函数。");
    }
    let ids = [];
    if (id !== undefined) {
      ids = [id];
    } else {
      ids = selectedRowKeys.value;
    }
    if (!ids || ids.length === 0) {
      createWarningMsg("请选择要删除的数据");
      return;
    }
    const confirmDia = DialogPlugin({
      body: "确定删除？此操作不可恢复。",
      header: "提示",
      theme: "warning",
      confirmBtn: "确定",
      cancelBtn: "取消",
      closeBtn: false,
      closeOnEscKeydown: false,
      closeOnOverlayClick: false,
      onConfirm: async ({ e }) => {
        try {
          // 更新确认按钮组件属性
          confirmDia.update({
            confirmBtn: {
              content: "删除中...",
              theme: "primary",
              loading: true,
            },
          });
          await deleteDataFunc({ ids });
          createSuccessMsg("删除成功");
          fetch();
        } catch (error) {
          createErrorMsg("删除失败");
        } finally {
          confirmDia.destroy();
        }
      },
      onClose: ({ e, trigger }) => {
        console.log("e: ", e);
        console.log("trigger: ", trigger);
        confirmDia.destroy();
      },
    });
  };

  /** 监听分页数据改变 */
  watch([currentPage, pageSize], () => {
    fetch(currentPage.value);
  });

  onMounted(() => {
    if (immediate) {
      fetch(currentPage.value);
    }
  });

  /** 适用 TDesign */
  const pagination = computed(() => {
    return {
      defaultPageSize: pageSize.value,
      total: total.value,
      defaultCurrent: currentPage.value,
    };
  });

  /**
   * 设置分页
   * @param {Object} pagination
   */
  const setPagination = (pagination) => {
    currentPage.value = pagination.current;
    if (parseInt(pagination.pageSize) != pageSize.value) {
      pageSize.value = pagination.pageSize;
    }
  };

  /**
   * 刷新页面，重置第一页，不重置搜索条件
   */
  const refresh = async () => {
    await fetch(1);
  };

  /**
   * 刷新当前页，不重置页码，也不重置搜索条件
   */
  const refreshCurPage = async () => {
    await fetch(currentPage.value);
  };

  return {
    loading,
    pagination,
    dataSource,
    // filterOption,
    // currentPage,
    // pageSize,
    // total,
    setLoading,
    fetch,
    reset,
    filter,
    exportFile,
    handleSelectionChange,
    doDelete,
    setPagination,
    refresh,
    refreshCurPage,
  };
}

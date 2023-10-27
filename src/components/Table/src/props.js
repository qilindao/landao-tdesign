export const basicProps = {
  //是否显示斑马纹
  stripe: { type: Boolean, default: true },
  api: {
    type: Function,
    default: null,
  },
  //请求之前对参数进行处理
  beforeFetch: {
    type: Function,
    default: null,
  },
  //请求之后对返回值进行处理
  afterFetch: {
    type: Function,
    default: null,
  },
  // 立即请求接口
  immediate: { type: Boolean, default: true },
  // 额外的请求参数
  searchInfo: {
    type: Object,
    default: null,
  },
  //表格的列配置
  columns: {
    type: Array,
    default: () => [],
  },
  //是否展示序号列
  showIndexColumn: { type: Boolean, default: false },
  //数据源
  dataSource: {
    type: Array,
    default: [],
  },
  rowKey: {
    type: String,
    default: "id",
  },
  //是否显示表格边框
  bordered: {
    type: Boolean,
    default: false,
  },
  //加载中状态
  loading: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: "medium",
    validator(val) {
      if (!val) return true;
      return ["small", "medium", "large"].includes(val);
    },
  },
  pagination: {
    type: [Object, Boolean],
    default: null,
  },
  //空表格呈现样式
  emptyDesc: {
    type: String,
    default: "暂无数据",
  },
};

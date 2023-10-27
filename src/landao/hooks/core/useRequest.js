import { ref } from "vue";

export function useRequest(service, options) {
  //初始化响应数据
  const loading = ref(false); //是否正在执行
  const error = ref(null); //抛出的异常
  const data = ref([]);

  const DefaultOptions = {
    manual: false,
    onSuccess: undefined,
    onError: undefined,
    onFinally: undefined,
    defaultParams: {},
  };

  //合并配置项
  const finalOptions = Object.assign({}, DefaultOptions, options);

  const { manual, onSuccess, onError, onFinally, defaultParams } = finalOptions;

  //设置loading状态
  const setLoading = (value) => {
    loading.value = value;
  };

  let promiseService = async (args) =>
    new Promise((resolve, reject) => {
      service(args).then(resolve).catch(reject);
    });

  const run = async (args) => {
    setLoading(true);
    return promiseService(args)
      .then((res) => {
        onSuccess && onSuccess(res, args);
        data.value = res.data;
        return res;
      })
      .catch((err) => {
        error.value = err;
        onError && onError(err, args);
      })
      .finally(() => {
        setLoading(false);
        onFinally && onFinally();
      });
  };

  // //是否手动执行，默认flase。即在初始化自动执行 service
  if (!manual) {
    run(defaultParams);
  }

  return {
    loading,
    setLoading,
    data,
    run,
    error,
  };
}

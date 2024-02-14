import { unref, ref } from "vue";

const useLoadingDelayPlugin = (fetchInstance, { loadingDelay }) => {
  const timerRef = ref();
  if (!unref(loadingDelay)) {
    return {};
  }

  const cancelTimeout = () => {
    if (timerRef.value) {
      clearTimeout(timerRef.value);
    }
  };

  return {
    name: "loadingDelayPlugin",
    onBefore: () => {
      cancelTimeout();
      timerRef.value = setTimeout(() => {
        fetchInstance.setState({
          loading: true,
        });
      }, unref(loadingDelay));

      return {
        loading: false,
      };
    },
    onFinally: () => {
      cancelTimeout();
    },
    onCancel: () => {
      cancelTimeout();
    },
  };
};

export default useLoadingDelayPlugin;

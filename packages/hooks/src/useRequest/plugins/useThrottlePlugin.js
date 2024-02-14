import { computed, unref, watchEffect } from "vue";
import { throttle } from "lodash-es";

const useThrottlePlugin = (
  fetchInstance,
  { throttleWait, throttleLeading, throttleTrailing }
) => {
  const options = computed(() => {
    const ret = {};
    if (unref(throttleLeading) !== undefined) {
      ret.leading = unref(throttleLeading);
    }
    if (unref(throttleTrailing) !== undefined) {
      ret.trailing = unref(throttleTrailing);
    }
    return ret;
  });

  const throttledRef = computed(() =>
    throttle(
      (callback) => {
        callback();
      },
      unref(throttleWait),
      options.value
    )
  );

  watchEffect((onInvalidate) => {
    if (unref(throttleWait)) {
      const _originRunAsync = fetchInstance.runAsync.bind(fetchInstance);
      fetchInstance.runAsync = (...args) => {
        return new Promise((resolve, reject) => {
          throttledRef.value?.(() => {
            _originRunAsync(...args)
              .then(resolve)
              .catch(reject);
          });
        });
      };
      onInvalidate(() => {
        fetchInstance.runAsync = _originRunAsync;
        throttledRef.value?.cancel();
      });
    }
  });

  if (!unref(throttleWait)) {
    return {};
  }

  return {
    name: "throttlePlugin",
    onCancel: () => {
      throttledRef.value?.cancel();
    },
  };
};

export default useThrottlePlugin;

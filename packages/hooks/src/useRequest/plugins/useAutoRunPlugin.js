import { unref, ref, watch, watchEffect } from "vue";

const useAutoRunPlugin = (
  fetchInstance,
  { manual, ready = true, refreshDeps = [], refreshDepsAction }
) => {
  const hasAutoRun = ref(false);

  watchEffect(() => {
    if (!manual && fetchInstance.options.refreshDeps !== true) {
      hasAutoRun.value = unref(ready);
    }
  });

  if (refreshDeps instanceof Array)
    watch(
      [hasAutoRun, ...refreshDeps],
      ([autoRun]) => {
        if (!autoRun) return;
        if (!manual && autoRun) {
          if (refreshDepsAction) {
            refreshDepsAction();
          } else {
            fetchInstance.refresh();
          }
        }
      },
      {
        deep: true,
        immediate: false,
      }
    );
  else
    watch(hasAutoRun, (h) => {
      if (!manual && h) {
        if (refreshDepsAction) {
          refreshDepsAction();
        } else {
          fetchInstance.refresh();
        }
      }
    });

  return {
    name: "autoRunPlugin",
    onBefore: () => {
      if (!unref(ready)) {
        return {
          stopNow: true,
        };
      }
    },
  };
};

useAutoRunPlugin.onInit = ({ ready = true, manual }) => {
  return {
    loading: (!manual && unref(ready)),
  };
};

export default useAutoRunPlugin;

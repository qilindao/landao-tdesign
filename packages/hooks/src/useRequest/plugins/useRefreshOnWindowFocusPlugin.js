import { ref, watchEffect, onScopeDispose, unref } from "vue";
import limit from "../utils/limit";
import subscribeFocus from "../utils/subscribeFocus";

const useRefreshOnWindowFocusPlugin = (
  fetchInstance,
  { refreshOnWindowFocus, focusTimespan = 5000 }
) => {
  const unsubscribeRef = ref();

  const stopSubscribe = () => {
    unsubscribeRef.value?.();
  };

  watchEffect((onInvalidate) => {
    if (unref(refreshOnWindowFocus)) {
      const limitRefresh = limit(
        fetchInstance.refresh.bind(fetchInstance),
        unref(focusTimespan)
      );
      unsubscribeRef.value = subscribeFocus(() => {
        limitRefresh();
      });
    }
    onInvalidate(() => {
      stopSubscribe();
    });
  });

  onScopeDispose(() => {
    stopSubscribe();
  });

  return {
    name: "refreshOnWindowFocusPlugin",
  };
};

export default useRefreshOnWindowFocusPlugin;

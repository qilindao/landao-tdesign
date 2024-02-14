import { unref, ref, watchEffect } from "vue";
import isDocumentVisible from "../utils/isDocumentVisible";
import subscribeReVisible from "../utils/subscribeReVisible";

const usePollingPlugin = (
  fetchInstance,
  { pollingInterval, pollingWhenHidden = true, pollingErrorRetryCount = -1 }
) => {
  const timerRef = ref();
  const unsubscribeRef = ref();
  const countRef = ref(0);

  const stopPolling = () => {
    if (timerRef.value) {
      clearInterval(timerRef.value);
    }
    unsubscribeRef.value?.();
  };

  watchEffect(() => {
    if (!unref(pollingInterval)) {
      stopPolling();
    }
  });

  if (!unref(pollingInterval)) {
    return {};
  }

  return {
    name: "pollingPlugin",
    onBefore: () => {
      stopPolling();
    },
    onError: () => {
      countRef.value += 1;
    },
    onSuccess: () => {
      countRef.value = 0;
    },
    onFinally: () => {
      if (
        pollingErrorRetryCount === -1 ||
        // When an error occurs, the request is not repeated after pollingErrorRetryCount retries
        (pollingErrorRetryCount !== -1 &&
          countRef.value <= pollingErrorRetryCount)
      ) {
        timerRef.value = setTimeout(() => {
          // if pollingWhenHidden = false && document is hidden, then stop polling and subscribe revisible
          if (!pollingWhenHidden && !isDocumentVisible()) {
            unsubscribeRef.value = subscribeReVisible(() => {
              fetchInstance.refresh();
            });
          } else {
            fetchInstance.refresh();
          }
        }, unref(pollingInterval));
      } else {
        countRef.value = 0;
      }
      // if (!pollingWhenHidden && !isDocumentVisible()) {
      //   unsubscribeRef.value = subscribeReVisible(() => {
      //     fetchInstance.refresh();
      //   });
      //   return;
      // }
      // timerRef.value = setInterval(() => {
      //   fetchInstance.refresh();
      // },unref(pollingInterval));
    },
    onCancel: () => {
      stopPolling();
    },
  };
};

export default usePollingPlugin;

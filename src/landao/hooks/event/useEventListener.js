import { ref, unref, watch } from "vue";
import { useDebounceFn, useThrottleFn } from "@vueuse/core";

export function useEventListener({
  el = window,
  name,
  listener,
  options,
  autoRemove = true,
  isDebounce = true,
  wait = 80,
}) {
  let remove = () => {};
  const isAddRef = ref(false);

  if (el) {
    const element = ref(el);
    const handler = isDebounce
      ? useDebounceFn(listener, wait)
      : useThrottleFn(listener, wait);
    const realHandler = wait ? handler : listener;
    const removeEventListener = (e) => {
      isAddRef.value = true;
      e.removeEventListener(name, realHandler, options);
    };
    const addEventListener = (e) =>
      e.addEventListener(name, realHandler, options);

    const removeWatch = watch(
      element,
      (v, _ov, cleanUp) => {
        if (v) {
          !unref(isAddRef) && addEventListener(v);
          cleanUp(() => {
            autoRemove && removeEventListener(v);
          });
        }
      },
      { immediate: true }
    );
  }

  remove = () => {
    removeEventListener(element.value);
    removeWatch();
  };
  return { removeEvent: remove };
}

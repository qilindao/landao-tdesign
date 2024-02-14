import { onUnmounted, ref, computed } from "vue";
import { throttle } from "lodash-es";

/**
 * 用来处理函数节流的 Hook
 * @param {Function} fn 需要节流的函数
 * @param {Object} options 配置节流的行为配置节流的行为 (wait = 1000,leading = true,trailing = true)
 * @returns (run = (...args) => any ,cancel = () => void,flush = () => void)
 */
export default function useThrottleFn(fn, options) {
  const fnRef = ref(fn);

  const wait = options?.wait ?? 1000;

  const throttled = computed(() =>
    throttle(
      (...args) => {
        return fnRef.value([...args]);
      },
      wait,
      options
    )
  );

  onUnmounted(() => {
    throttled.value.cancel();
  });

  return {
    run: throttled,
    cancel: throttled.value.cancel,
    flush: throttled.value.flush,
  };
}

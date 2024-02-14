import { ref, watch } from "vue";
import useThrottleFn from "../useThrottleFn";

/**
 *
 * @param {*} value 需要节流的值
 * @param {*} options 	配置节流的行为 (wait = 1000,leading = true,trailing = true)
 * @returns
 */
export default function useThrottle(value, options) {
  const throttled = ref();
  throttled.value = value.value;
  const { run } = useThrottleFn(() => {
    throttled.value = value.value;
  }, options);

  watch(
    value,
    () => {
      run.value();
    },
    {
      immediate: true,
    }
  );

  return throttled;
}

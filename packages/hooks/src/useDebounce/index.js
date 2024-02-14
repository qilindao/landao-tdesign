import { ref, watch } from "vue";
import useDebounceFn from "../useDebounceFn";

/**
 * 用来处理防抖值的 Hook
 * @param {*} value 需要防抖的值
 * @param {*} options 需要防抖的值 (wait = 1000,leading = false,trailing = true,maxWait = -)
 * @returns
 */
export default function useDebounce(value, options) {
  const debounced = ref(value.value);
  const { run } = useDebounceFn(() => (debounced.value = value.value), options);
  watch(value, () => run(), { deep: true });
  return debounced;
}

import { debounce } from "lodash-es";

/**
 * 用来处理防抖函数的 Hook
 * @param {Function} fn 需要防抖执行的函数
 * @param {Object} options (wait = 1000,leading = false,trailing = true,maxWait = -)
 * @returns (run = (...args) => any ,cancel = () => void,flush = () => void)
 */
export default function useDebounceFn(fn, options) {
  const wait = options?.wait ?? 1000;
  const debounced = debounce(fn, wait, options);
  return {
    /**
     * Invode and pass parameters to fn.
     * `(...args: any[]) => any`
     */
    run: debounced,

    /**
     * Cancel the invocation of currently debounced function.
     *  `() => void`
     */
    cancel: debounced.cancel,

    /**
     * Immediately invoke currently debounced function.
     *  `() => void`
     */
    flush: debounced.flush,
  };
}

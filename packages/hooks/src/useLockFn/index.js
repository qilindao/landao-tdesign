/**
 * 用于给一个异步函数增加竞态锁，防止并发执行。
 * @param {Function} fn 增加了竞态锁的函数
 * @returns
 */
export default function useLockFn(fn) {
  let lock = false;
  return async (...args) => {
    if (lock) return;
    lock = true;
    try {
      const ret = await fn(...args);
      lock = false;
      return ret;
    } catch (e) {
      lock = false;
      throw e;
    }
  };
}

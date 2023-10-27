import store from "store";

export function useLocalStorage() {
  const _suffix = "_expirationTime"; //后缀标识

  //读取
  function readItem(key) {
    return store.get(key);
  }

  //写
  function writeItem(key, value, expires) {
    store.set(key, value);
    if (expires) {
      store.set(`${key}${_suffix}`, Date.parse(new Date()) + expires * 1000);
    }
  }

  /**
   * 移除过期时间
   * @param {string} key  关键字
   */
  function removeExpiration(key) {
    store.remove(`${key}${_suffix}`);
  }

  /**
   * 移除
   * @param {*} key
   */
  function removeItem(key) {
    store.remove(key);
    removeExpiration(key);
  }

  //清除所有
  function clearAll() {
    store.clearAll();
  }

  /**
   * 判断是否过期
   * @param {string} key 关键字
   * @returns bool
   */
  function hasExpired(key) {
    return (getExpiration(key) || 0) - Date.parse(new Date()) <= 2000;
  }
  /**
   * 获取过期时间
   * @param {string} key
   * @returns
   */
  function getExpiration(key) {
    return readItem(`${key}${_suffix}`);
  }

  return {
    readItem,
    writeItem,
    removeItem,
    hasExpired,
    clearAll,
  };
}

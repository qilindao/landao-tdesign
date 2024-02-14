const cachePromise = new Map();

const getCachePromise = (cacheKey) => {
  return cachePromise.get(cacheKey);
};

const setCachePromise = (cacheKey, promise) => {
  // 应该缓存同样的请求
  cachePromise.set(cacheKey, promise);

  // 兼容-不使用promise.finally
  promise
    .then((res) => {
      cachePromise.delete(cacheKey);
      return res;
    })
    .catch((err) => {
      cachePromise.delete(cacheKey);
      throw err;
    });
};

export { getCachePromise, setCachePromise };

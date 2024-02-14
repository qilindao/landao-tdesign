/**
 * api 请求代理
 * @param {Array} proxyList
 * @returns
 */
export function createProxy(proxyList = []) {
  const httpsReg = /^https:\/\//;
  const httpProxy = [];
  for (const [prefix, target] of proxyList) {
    //判断是否ssl
    const isHttps = httpsReg.test(target);
    // 需要代理的路径   例如 '/api'
    httpProxy[prefix] = {
      target: `${target}`,
      changeOrigin: true,
      rewrite: (path) => path.replace(new RegExp(`^${prefix}`), `${prefix}`),
      ...(isHttps ? { secure: false } : {}),
    };
  }
  return httpProxy;
}

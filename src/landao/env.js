/**
 *
 * @returns
 */
export function getEnv(name) {
  return import.meta.env[name];
}

/**
 * 获取模式
 * @returns
 */
export function getEnvMode() {
  return import.meta.env.MODE || "development";
}

/**
 * 开发环境
 * @returns Boolean
 */
export function isDev() {
  return import.meta.env.DEV;
}

/**
 * 生成环境
 * @returns Boolean
 */
export function isProd() {
  return import.meta.env.PROD;
}

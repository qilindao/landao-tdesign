import axios from "axios";
import { isFunction } from "lodash-es";

// 存储请求与取消令牌的键值对列表
let pendingMap = new Map();
/**
 * 获取请求Url
 * @param {*} config
 * @returns
 */
export const getPendingUrl = (config) => [config.method, config.url].join("&");

export class AxiosCanceler {
  /**
   * 添加请求到列表中
   * @param {*} config
   */
  addPending(config) {
    this.removePending(config);
    const url = getPendingUrl(config);
    config.cancelToken =
      config.cancelToken ||
      new axios.CancelToken((cancel) => {
        if (!pendingMap.has(url)) {
          // 如果当前没有相同请求就添加
          pendingMap.set(url, cancel);
        }
      });
  }

  /**
   * 移除现有的所有请求
   */
  removeAllPending() {
    pendingMap.forEach((cancel) => {
      if (cancel && isFunction(cancel)) cancel();
    });
    pendingMap.clear();
  }

  /**
   * 移除指定请求
   * @param {*} config
   */
  removePending(config) {
    const url = getPendingUrl(config);

    if (pendingMap.has(url)) {
      // If there is a current request identifier in pending,
      // the current request needs to be cancelled and removed
      const cancel = pendingMap.get(url);
      if (cancel) cancel(url);
      pendingMap.delete(url);
    }
  }

  reset() {
    pendingMap = new Map();
  }
}

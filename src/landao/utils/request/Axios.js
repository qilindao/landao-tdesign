import axios from "axios";
import { cloneDeep, debounce, isFunction, throttle } from "lodash-es";
import { stringify } from "qs";

import { ContentTypeEnum } from "@/constants";

import { AxiosCanceler } from "./AxiosCancel";

const map = new WeakMap();

/**
 * 创建一个在每个实例中存储私有变量的对象
 * @param {*} obj
 * @returns
 */
const internal = (obj) => {
  if (!map.has(obj)) {
    map.set(obj, {});
  }
  return map.get(obj);
};

export class VAxios {
  constructor(options) {
    internal(this).options = options; //Axios配置
    internal(this).instance = axios.create(options); //Axios实例句柄
    this.setupInterceptors();
  }
  /**
   * 创建Axios实例
   * @param {*} config
   */
  createAxios(config) {
    internal(this).instance = axios.create(config);
  }
  getTransform() {
    const { transform } = internal(this).options;
    return transform;
  }
  /**
   * 获取Axios实例
   * @returns
   */
  getAxios() {
    return internal(this).instance;
  }
  /**
   * 配置Axios
   * @param {*} config
   * @returns
   */
  configAxios(config) {
    if (!internal(this).instance) return;
    this.createAxios(config);
  }

  setHeader(headers) {
    if (!internal(this).instance) return;
    Object.assign(internal(this).instance.defaults.headers, headers);
  }
  /**
   * 设置拦截器
   * @returns
   */
  setupInterceptors() {
    const transform = this.getTransform();
    if (!transform) return;
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;
    const axiosCanceler = new AxiosCanceler();
    //请求拦截器
    internal(this).instance.interceptors.request.use((config) => {
      // 如果忽略取消令牌，则不会取消重复的请求
      const { ignoreCancelToken } = config.requestOptions;
      const ignoreCancel =
        ignoreCancelToken ??
        internal(this).options.requestOptions?.ignoreCancelToken;
      if (!ignoreCancel) axiosCanceler.addPending(config);
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, internal(this).options);
      }

      return config;
    }, undefined);

    // 请求错误处理
    if (requestInterceptorsCatch && isFunction(requestInterceptorsCatch)) {
      internal(this).instance.interceptors.request.use(
        undefined,
        requestInterceptorsCatch
      );
    }
    // 响应结果处理
    internal(this).instance.interceptors.response.use((res) => {
      if (res) axiosCanceler.removePending(res.config);
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res);
      }
      return res;
    }, undefined);

    // 响应错误处理
    if (responseInterceptorsCatch && isFunction(responseInterceptorsCatch)) {
      internal(this).instance.interceptors.response.use(undefined, (error) =>
        responseInterceptorsCatch(error, internal(this).instance)
      );
    }
  }
  /**
   * 支持 FormData 请求格式
   * @param {*} config
   * @returns
   */
  supportFormData(config) {
    const headers = config.headers || internal(this).options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];

    if (
      contentType !== ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, "data") ||
      config.method?.toUpperCase() === "GET"
    ) {
      return config;
    }

    return {
      ...config,
      data: stringify(config.data, { arrayFormat: "brackets" }),
    };
  }
  /**
   *支持 params 序列化
   * @param {*} config
   * @returns
   */
  supportParamsStringify(config) {
    const headers = config.headers || internal(this).options.headers;
    const contentType = headers?.["Content-Type"] || headers?.["content-type"];

    if (
      contentType === ContentTypeEnum.FormURLEncoded ||
      !Reflect.has(config, "params")
    ) {
      return config;
    }

    return {
      ...config,
      paramsSerializer: (params) =>
        stringify(params, { arrayFormat: "brackets" }),
    };
  }
  get(config, options) {
    return this.request({ ...config, method: "GET" }, options);
  }

  post(config, options) {
    return this.request({ ...config, method: "POST" }, options);
  }

  put(config, options) {
    return this.request({ ...config, method: "PUT" }, options);
  }

  delete(config, options) {
    return this.request({ ...config, method: "DELETE" }, options);
  }

  patch(config, options) {
    return this.request({ ...config, method: "PATCH" }, options);
  }

  /**
   * 上传文件封装
   * @param {*} key 文件所属的key
   * @param {*} file 文件
   * @param {*} config 请求配置
   * @param {*} options
   * @returns
   */
  upload(key, file, config, options) {
    const params = config.params ?? new FormData();
    params.append(key, file);

    return this.request(
      {
        ...config,
        method: "POST",
        headers: {
          "Content-Type": ContentTypeEnum.FormData,
        },
        params,
      },
      options
    );
  }
  /**
   * 请求封装
   * @param {*} config
   * @param {*} options
   * @returns
   */
  request(config, options) {
    const { requestOptions } = internal(this).options;

    if (
      requestOptions.throttle !== undefined &&
      requestOptions.debounce !== undefined
    ) {
      throw new Error("throttle and debounce cannot be set at the same time");
    }

    if (requestOptions.throttle && requestOptions.throttle.delay !== 0) {
      return new Promise((resolve) => {
        throttle(
          () => resolve(this.synthesisRequest(config, options)),
          requestOptions.throttle.delay
        );
      });
    }

    if (requestOptions.debounce && requestOptions.debounce.delay !== 0) {
      return new Promise((resolve) => {
        debounce(
          () => resolve(this.synthesisRequest(config, options)),
          requestOptions.debounce.delay
        );
      });
    }

    return this.synthesisRequest(config, options);
  }
  async synthesisRequest(config, options) {
    let conf = cloneDeep(config);
    const transform = this.getTransform();
    const { requestOptions } = internal(this).options;

    const opt = { ...requestOptions, ...options };
    const { beforeRequestHook, requestCatchHook, transformRequestHook } =
      transform || {};
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt);
    }
    conf.requestOptions = opt;

    conf = this.supportFormData(conf);

    // 支持params数组参数格式化，因axios默认的toFormData即为brackets方式，无需配置paramsSerializer为qs，有需要可解除注释，参数参考qs文档
    // conf = this.supportParamsStringify(conf);

    return new Promise((resolve, reject) => {
      internal(this)
        .instance.request(!config.retryCount ? conf : config)
        .then((res) => {
          if (transformRequestHook && isFunction(transformRequestHook)) {
            try {
              const ret = transformRequestHook(res, opt);
              const { code, message } = ret;
              // 业务逻辑代码错误，直接抛出
              if (code === 400 || code === 403) {
                return reject({ code, message });
              }
              resolve(ret);
            } catch (err) {
              reject(err || new Error("请求错误!"));
            }
            return;
          }
          resolve(res);
        })
        .catch((e) => {
          if (requestCatchHook && isFunction(requestCatchHook)) {
            reject(requestCatchHook(e, opt));
            return;
          }
          if (axios.isAxiosError(e)) {
            // 在这里重写Axios的错误信息
          }
          reject(e);
        });
    });
  }
}

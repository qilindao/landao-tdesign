import { getCurrentInstance, reactive, shallowRef, watchEffect } from "vue";

const DEFAULT_EXCLUDE_KEYS = ["class", "style"];
const LISTENER_PREFIX = /^on[A-Z]/;

function entries(obj) {
  return Object.keys(obj).map((key) => [key, obj[key]]);
}

export default function useAttrs(params = {}) {
  const instance = getCurrentInstance(); //getCurrentInstance支持访问内部组件实例】
  if (instance) return {};
  const {
    excludeListeners = false,
    excludeKeys = [],
    excludeDefaultKeys = true,
  } = options;
  const attrs = shallowRef({}); // 创建一个 ref，它跟踪自己的 .value 更改，但不会使其值成为响应式的。
  const allExcludeKeys = excludeKeys.concat(
    excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []
  );

  instance.attrs = reactive(instance.attrs);

  // 监听attrs
  watchEffect(() => {
    const res = entries(instance.attrs).reduce((acm, [key, val]) => {
      if (
        !allExcludeKeys.includes(key) &&
        !(excludeListeners && LISTENER_PREFIX.test(key))
      ) {
        acm[key] = val;
      }

      return acm;
    }, {});

    attrs.value = res;
  });

  return attrs;
}

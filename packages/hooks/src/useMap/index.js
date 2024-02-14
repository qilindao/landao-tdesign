import { ref, markRaw } from "vue";
/**
 * 管理 Map 类型状态的 Hook
 * @param {*} initialValue 可选项，传入默认的 Map 参数
 * @returns ( map = Map() set = (key, value) => void , get = (key) => void , setAll = (newMap) => void , remove = (key) => void , reset = () => void)
 */
export default function useMap(initialValue) {
  const getInitValue = () => {
    return initialValue ? new Map(initialValue) : new Map();
  };

  const state = ref(getInitValue());

  const actions = {
    /**
     * 添加元素
     * @param {*} key
     * @param {*} value
     */
    set: (key, value) => {
      state.value.set(key, value);
    },
    /**
     * 	获取元素
     * @param {*} key
     * @returns
     */
    get: (key) => {
      return state.value.get(key);
    },
    /**
     * 移除元素
     * @param {*} key
     */
    remove: (key) => {
      state.value.delete(key);
    },
    has: (key) => state.value.has(key),
    clear: () => state.value.clear(),
    /**
     * 生成一个新的 Map 对象
     * @param {*} newMap
     */
    setAll: (newMap) => {
      state.value = new Map(newMap);
    },
    /**
     * 重置为默认值
     * @returns
     */
    reset: () => (state.value = getInitValue()),
  };

  return [state, markRaw(actions)];
}

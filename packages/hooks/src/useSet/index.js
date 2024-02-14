import { ref, markRaw, readonly } from "vue";

/**
 * 管理 Set 类型状态的 Hook
 * @param {*} initialValue 可选项，传入默认的 Set 参数
 * @returns ( set = Set , add = (key) => void , remove = (key) => void , reset = () => void)
 */
export default function useSet(initialValue) {
  const getInitValue = () => {
    return initialValue === undefined ? new Set() : new Set(initialValue);
  };
  const state = ref(getInitValue());

  const actions = {
    /**
     *  添加元素
     * @param value T
     */
    add: (value) => {
      state.value.add(value);
    },

    /**
     *  移除元素
     * @param value T
     */
    remove: (value) => {
      state.value.delete(value);
    },

    /**
     * Set has
     * @param value T
     */
    has: (value) => state.value.has(value),

    /**
     * 清除 Set
     */
    clear: () => state.value.clear(),

    /**
     * 重置为默认值
     */
    reset: () => {
      state.value = getInitValue();
    },
  };

  return [readonly(state), markRaw(actions)];
}

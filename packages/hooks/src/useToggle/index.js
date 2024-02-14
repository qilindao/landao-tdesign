import { computed, ref, shallowReadonly } from "vue";

/**
 * 用于在两个状态值间切换的 Hook。
 * @param {*} defaultValue 可选项，传入默认的状态值
 * @param {*} reverseValue 可选项，传入取反的状态值
 * @returns
 */
export default function useToggle(defaultValue = false, reverseValue) {
  const state = ref(defaultValue);

  const actions = computed(() => {
    const reverseValueOrigin =
      reverseValue === undefined ? !defaultValue : reverseValue;
    const toggle = () => {
      state.value =
        state.value === defaultValue ? reverseValueOrigin : defaultValue;
    };

    const set = (value) => (state.value = value);
    const setLeft = () => (state.value = defaultValue);
    const setRight = () => (state.value = reverseValueOrigin);

    return {
      toggle,
      set,
      setLeft,
      setRight,
    };
  });
  return [shallowReadonly(state), actions.value];
}

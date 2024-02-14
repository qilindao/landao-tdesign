import useToggle from "../useToggle";

/**
 * 优雅的管理 boolean 状态的 Hook
 * @param {Boolean} defaultValue 可选项，传入默认的状态值
 * @returns
 */
export default function useBoolean(defaultValue = false) {
  const [state, { toggle, set }] = useToggle(!!defaultValue);

  const actions = {
    set: (v) => set(!!v),
    setTrue: () => set(true),
    setFalse: () => set(false),
    toggle,
  };
  return [state, actions];
}

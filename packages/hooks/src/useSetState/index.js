import { ref, unref, readonly } from "vue";
import { merge } from "lodash-es";

export default function useSetState(initialState) {
  const getInitialState = () => unref(initialState);

  const state = ref(getInitialState());

  const setMergeState = (patch, cover = false) => {
    const newState = unref(patch);
    if (cover) state.value = newState;
    else state.value = newState ? merge(state.value, newState) : state.value;
  };
  return [readonly(state), setMergeState];
}

import { ref, nextTick } from "vue";
export function useFixedHeight(elRef, deduct = 0) {
  const height = ref(0);
  nextTick(() => {
    const el = elRef.value.getBoundingClientRect();
    height.value = el.height - deduct;
  });
  return {
    height,
  };
}

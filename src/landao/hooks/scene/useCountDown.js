import { ref, onUnmounted } from "vue";
/**
 * 一个用于管理倒计时的 Hook
 * @param {*} duration
 * @returns
 */
export const useCountdown = (duration = 60) => {
  let intervalTimer;
  onUnmounted(() => {
    clearInterval(intervalTimer);
  });
  const countDown = ref(0);

  return [
    countDown,
    () => {
      countDown.value = duration;
      intervalTimer = setInterval(() => {
        if (countDown.value > 0) {
          countDown.value -= 1;
        } else {
          clearInterval(intervalTimer);
          countDown.value = 0;
        }
      }, 1000);
    },
  ];
};

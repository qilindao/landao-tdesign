<template>
  <div class="ld-layout-container">
    <div class="ld-layout">
      <div
        class="ld-layout__left"
        v-if="ifLeft"
        v-show="leftShow"
        :style="leftSideStyle"
      >
        <slot name="left"></slot>
      </div>
      <div class="ld-layout__main">
        <span class="left-side-icon" v-if="ifLeft" @click="handleLeftSlide">
          <span :class="{ 'pin-arrow': true, 'arrow-right': !leftShow }"></span>
        </span>
        <div class="ld-layout__main--container">
          <slot></slot>
        </div>
        <span class="right-side-icon" v-if="ifRight" @click="handleRightSlide">
          <span :class="{ 'pin-arrow': true, 'arrow-right': rightShow }"></span>
        </span>
      </div>
      <div
        class="ld-layout__right"
        v-if="ifRight"
        v-show="rightShow"
        :style="rightSideStyle"
      >
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, defineComponent, computed } from "vue";
import { isNumber } from "lodash-es";

export default defineComponent({
  name: "LdLayout",
  props: {
    enableLeftSide: {
      type: Boolean,
      default: false,
    },
    enableRightSide: {
      type: Boolean,
      default: false,
    },
    leftSideWidth: {
      type: [String, Number],
      default: 260,
    },
    rightSideWidth: {
      type: [String, Number],
      default: 260,
    },
  },
  setup(props, { slots }) {
    const leftShow = ref(true),
      rightShow = ref(true);

    const leftSideStyle = computed(() => {
      const width = isNumber(props.leftSideWidth)
        ? `${props.leftSideWidth}px`
        : props.leftSideWidth;
      return { width };
    });

    const rightSideStyle = computed(() => {
      const width = isNumber(props.rightSideWidth)
        ? `${props.rightSideWidth}px`
        : props.rightSideWidth;
      return {
        width,
      };
    });

    const ifLeft = computed(() => props.enableLeftSide && !!slots.left);
    const ifRight = computed(() => props.enableRightSide && !!slots.right);

    // const rootHeight=computed(())

    const handleLeftSlide = () => {
      leftShow.value = !leftShow.value;
    };
    const handleRightSlide = () => {
      rightShow.value = !rightShow.value;
    };

    return {
      leftSideStyle,
      rightSideStyle,
      ifLeft,
      ifRight,
      leftShow,
      rightShow,
      handleLeftSlide,
      handleRightSlide,
    };
  },
});
</script>

<style lang="less" scoped>
.ld-layout-container {
  display: flex;
  position: relative;
  width: 100%;
  height: calc(100vh - var(--td-comp-size-xxxl) - var(--td-comp-paddingTB-xl));
  z-index: 6;
}
.ld-layout {
  font: var(--td-font-body-medium);
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  box-sizing: border-box;

  color: var(--td-text-color-primary);
  transition: box-shadow 0.2s cubic-bezier(0.38, 0, 0.24, 1);
  display: flex;
  height: 100%;
  width: 100%;
  z-index: 10;
  &__left,
  &__right,
  &__main {
    height: 100%;
    background-color: var(--td-bg-color-container);
    border-radius: var(--td-radius-medium);
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);
  }
  &__left {
    margin-right: var(--td-comp-margin-m);
  }
  &__right {
    margin-left: var(--td-comp-margin-m);
  }
  &__main {
    flex: 1;
    position: relative;
    width: 100%;
    .left-side-icon,
    .right-side-icon {
      font-size: 18px;
      background-color: var(--td-bg-color-container);
      // transition: background-color 0.3s, var(--el-transition-color);
      transition: top 0.2s ease, opacity 0.2s ease;
      border-radius: 8px;
      height: 44px;
      width: 14px;
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      border: 1px solid var(--td-border-level-1-color);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px 0 rgb(0 0 0 / 6%);
      opacity: 1;
      will-change: top, opacity;
      z-index: 1000;
      .pin-arrow {
        display: inline-block;
        border-left: 5px solid #8a8f8d;
        border-top: 5px solid rgba(0, 0, 0, 0);
        border-right: 5px solid rgba(0, 0, 0, 0);
        border-bottom: 5px solid rgba(0, 0, 0, 0);
        align-self: center;
        transform: rotate(180deg);
        margin-left: -5px;
        &.arrow-right {
          margin-left: 4px;
          transform: rotate(0deg);
        }
      }
    }
    .left-side-icon {
      left: -8px;
    }

    .right-side-icon {
      right: -8px;
    }
    &--container {
      position: absolute;
      width: calc(100% - var(--td-comp-paddingTB-l) * 2);
      height: calc(100% - var(--td-comp-paddingTB-l) * 2);
      overflow: auto;
    }
  }
}
</style>

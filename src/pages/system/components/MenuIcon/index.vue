<template>
  <t-select-input
    :value="modelValue"
    placeholder="请选择"
    :popup-props="{
      overlayInnerClassName: ['ld-icon-popup'],
    }"
    :popup-visible="visible"
    clearable
    allow-input
    @popup-visible-change="onPopupVisibleChange"
    @input-change="onInputChange"
  >
    <template #panel>
      <ul class="t-icons-view">
        <li
          class="t-icons-view__wrapper"
          :class="{ selected: modelValue == item.stem }"
          v-for="item in options"
          :key="item.stem"
          @click="() => onOptionClick(item.stem)"
        >
          <t-icon :name="item.stem" size="22px" class="t-icons-view__icon" />
          <div class="t-icons-view__name">{{ item.stem }}</div>
        </li>
      </ul>
    </template>
    <template #label>
      <t-icon :name="modelValue" :style="{ marginRight: '8px' }" />
    </template>
  </t-select-input>
</template>
<script setup>
import { ref } from "vue";
import { manifest } from "tdesign-icons-vue-next";
import { useBoolean } from "@landao/hooks";

defineOptions({
  name: "MenuIcon",
});
// 获取全部图标的列表
const options = ref(manifest);
const modelValue = defineModel({ type: String });

const [visible, { set: setVisible }] = useBoolean(false);

function debounce(func, delay) {
  let timer;

  return function (...args) {
    clearTimeout(timer);

    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

const onInputChange = debounce((val) => {
  if (val != "") {
    options.value = manifest.filter((item) => {
      return item.stem.indexOf(val) !== -1;
    });
  }
}, 500);

const onPopupVisibleChange = (val, context) => {
  setVisible(val);
};

const onOptionClick = (item) => {
  modelValue.value = item;
  // 选中后立即关闭浮层
  setVisible(false);
};
</script>
<style lang="less" scoped>
.t-icons-view {
  display: flex;
  flex-wrap: wrap;
  &__wrapper {
    width: 20%;
    height: 90px;
    font-size: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    border-radius: 6px;
    padding-top: 16px;
    position: relative;
    box-sizing: border-box;
    &.selected {
      color: var(--td-brand-color);
      background-color: var(--td-brand-color-light);
      transition: all 0.2s linear;
    }
  }
  &_icon {
    font-size: 28px;
  }
  &__name {
    margin-top: 8px;
    font-size: 10px;
  }
}
</style>
<style lang="less">
.ld-icon-popup {
  scrollbar-color: var(--td-scrollbar-color) transparent;
  scrollbar-width: thin;
  margin: var(--td-comp-paddingTB-s) 0;
  padding: 6px;
  max-height: 300px;
  width: 500px;
  overflow-y: auto;
  overscroll-behavior: contain;
  box-shadow: var(--td-shadow-2);
  &::-webkit-scrollbar-thumb {
    background-clip: content-box;
    :vertical:hover,
    :horizontal:hover {
      background-color: var(--td-scrollbar-hover-color);
    }
  }
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}
</style>

<template>
  <t-drawer
    v-model:visible="showSettingPanel"
    size="360px"
    :footer="false"
    :header="false"
    :close-btn="false"
    class="setting-drawer-container"
    @close-btn-click="handleCloseDrawer"
  >
    <div class="setting-container">
      <t-form ref="form" :data="formData" label-align="left">
        <div class="setting-container-subgroup">
          <div class="setting-group-title">主题模式</div>
          <t-radio-group v-model="formData.mode">
            <div
              v-for="(item, index) in MODE_OPTIONS"
              :key="index"
              class="setting-layout-drawer"
            >
              <div>
                <t-radio-button :key="index" :value="item.type"
                  ><component :is="getModeIcon(item.type)" />
                  <picked-icon v-if="formData.mode == item.type" />
                </t-radio-button>
                <p :style="{ textAlign: 'center', marginTop: '8px' }">
                  {{ item.text }}
                </p>
              </div>
            </div>
          </t-radio-group>
        </div>
        <div class="setting-container-subgroup">
          <div class="setting-group-title">主题色</div>
          <t-radio-group v-model="formData.brandTheme">
            <div
              v-for="(item, index) in DEFAULT_COLOR_OPTIONS"
              :key="index"
              class="setting-layout-drawer"
            >
              <t-radio-button
                :key="index"
                :value="item"
                class="setting-layout-color-group"
              >
                <color-container :value="item" />
              </t-radio-button>
            </div>
            <div class="setting-layout-drawer">
              <t-popup
                destroy-on-close
                expand-animation
                placement="bottom-right"
                trigger="click"
                :visible="isColoPickerDisplay"
                :overlay-style="{ padding: 0 }"
                @visible-change="onPopupVisibleChange"
              >
                <template #content>
                  <t-color-picker-panel
                    :on-change="changeColor"
                    :color-modes="['monochrome']"
                    format="HEX"
                    :swatch-colors="[]"
                  />
                </template>
                <t-radio-button
                  :value="dynamicColor"
                  class="setting-layout-color-group dynamic-color-btn"
                >
                  <color-container :value="dynamicColor" />
                </t-radio-button>
              </t-popup>
            </div>
          </t-radio-group>
        </div>
        <div class="setting-container-subgroup">
          <div class="setting-group-title">导航布局</div>
          <t-radio-group v-model="formData.layout">
            <div
              v-for="(item, index) in LAYOUT_OPTION"
              :key="index"
              class="setting-layout-drawer"
            >
              <t-radio-button :key="index" :value="item">
                <component :is="getLayoutIcon(item)" />
                <picked-icon v-if="formData.layout == item" />
              </t-radio-button>
            </div>
          </t-radio-group>

          <t-form-item
            v-show="formData.layout === 'mix'"
            label="分割菜单（混合模式下有效）"
            name="splitMenu"
          >
            <t-switch v-model="formData.splitMenu" />
          </t-form-item>

          <t-form-item
            v-show="formData.layout === 'mix'"
            label="固定 Sidebar"
            name="isSidebarFixed"
          >
            <t-switch v-model="formData.isSidebarFixed" />
          </t-form-item>
        </div>
        <div class="setting-container-subgroup">
          <div class="setting-group-title">元素开关</div>
          <div class="setting-container-subgroup setting-config-list">
            <t-form-item
              v-show="formData.layout === 'side'"
              label="显示 Header"
              name="showHeader"
            >
              <t-switch v-model="formData.showHeader" />
            </t-form-item>
            <t-form-item label="显示 Breadcrumbs" name="showBreadcrumb">
              <t-switch v-model="formData.showBreadcrumb" />
            </t-form-item>
            <t-form-item label="显示 Footer" name="showFooter">
              <t-switch v-model="formData.showFooter" />
            </t-form-item>
            <t-form-item label="使用 多标签Tab页" name="isUseTabsRouter">
              <t-switch v-model="formData.isUseTabsRouter"></t-switch>
            </t-form-item>
          </div>
        </div>
      </t-form>
      <div class="setting-info">
        <p>请复制后手动修改配置文件: /src/config/style.ts</p>
        <t-button theme="primary" variant="text" @click="handleCopy">
          复制配置项
        </t-button>
      </div>
    </div>
  </t-drawer>
</template>
<script setup>
import { MessagePlugin } from "tdesign-vue-next";
import { computed, onMounted, ref, watchEffect } from "vue";
import useClipboard from "vue-clipboard3";

import SettingAutoIcon from "@/assets/svg/assets-setting-auto.svg";
import SettingDarkIcon from "@/assets/svg/assets-setting-dark.svg";
import SettingLightIcon from "@/assets/svg/assets-setting-light.svg";

import LayoutSideIcon from "@/assets/svg/assets-layout-side.svg";
import LayoutTopIcon from "@/assets/svg/assets-layout-top.svg";
import LayoutMixIcon from "@/assets/svg/assets-layout-mix.svg";

import PickedIcon from "@/assets/svg/assets-picked.svg";

import ColorContainer from "@/components/color/index.vue";
import Thumbnail from "@/components/thumbnail/index.vue";
import { DEFAULT_COLOR_OPTIONS } from "@/config/color";
import STYLE_CONFIG from "@/config/style";
import { useSettingStore } from "@/store";

const settingStore = useSettingStore();

const LAYOUT_OPTION = ["side", "top", "mix"];

const MODE_OPTIONS = [
  { type: "light", text: "明亮" },
  { type: "dark", text: "暗黑" },
  { type: "auto", text: "跟随系统" },
];

const initStyleConfig = () => {
  const styleConfig = STYLE_CONFIG;
  for (const key in styleConfig) {
    if (Object.prototype.hasOwnProperty.call(styleConfig, key)) {
      styleConfig[key] = settingStore[key];
    }
  }

  return styleConfig;
};

const dynamicColor = computed(() => {
  const isDynamic =
    DEFAULT_COLOR_OPTIONS.indexOf(formData.value.brandTheme) === -1;
  return isDynamic ? formData.value.brandTheme : "";
});
const formData = ref({ ...initStyleConfig() });
const isColoPickerDisplay = ref(false);

const showSettingPanel = computed({
  get() {
    return settingStore.showSettingPanel;
  },
  set(newVal) {
    settingStore.updateConfig({
      showSettingPanel: newVal,
    });
  },
});

const changeColor = (hex) => {
  formData.value.brandTheme = hex;
};

onMounted(() => {
  document.querySelector(".dynamic-color-btn").addEventListener("click", () => {
    isColoPickerDisplay.value = true;
  });
});

const onPopupVisibleChange = (visible, context) => {
  if (!visible && context.trigger === "document") {
    isColoPickerDisplay.value = visible;
  }
};

const handleCopy = () => {
  const text = JSON.stringify(formData.value, null, 4);
  const { toClipboard } = useClipboard();
  toClipboard(text)
    .then(() => {
      MessagePlugin.closeAll();
      MessagePlugin.success("复制成功");
    })
    .catch(() => {
      MessagePlugin.closeAll();
      MessagePlugin.error("复制失败");
    });
};
/** 主题 */
const getModeIcon = (mode) => {
  if (mode === "light") {
    return SettingLightIcon;
  }
  if (mode === "dark") {
    return SettingDarkIcon;
  }
  return SettingAutoIcon;
};

const handleCloseDrawer = () => {
  settingStore.updateConfig({
    showSettingPanel: false,
  });
};
/**布局 */
const getLayoutIcon = (mode) => {
  if (mode === "top") {
    return LayoutTopIcon;
  }
  if (mode === "mix") {
    return LayoutMixIcon;
  }
  return LayoutSideIcon;
};

watchEffect(() => {
  if (formData.value.brandTheme) settingStore.updateConfig(formData.value);
});
</script>
<!-- teleport导致drawer 内 scoped样式问题无法生效 先规避下 -->
<!-- eslint-disable-next-line vue-scoped-css/enforce-style-type -->
<style lang="less">
.setting-drawer-container {
  .t-drawer__mask {
    background: none;
  }
  .t-drawer__body {
    padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-s);
    background-color: var(--td-bg-color-secondarycontainer);
  }

  .t-radio-group.t-size-m {
    min-height: 32px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .t-radio-group {
    margin: var(--td-comp-margin-m) 0;
  }

  .t-radio-group.t-size-m .t-radio-button {
    height: auto;
  }

  .setting-container {
    background-color: var(--td-bg-color-container);
    padding: var(--td-comp-paddingTB-l) var(--td-comp-paddingLR-l);
    border-radius: var(--td-radius-extraLarge);
    height: 100%;
    &-subgroup {
      margin: var(--td-comp-margin-m) 0;
    }
  }

  .setting-config-list {
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-large);
    padding: var(--td-comp-paddingTB-xs) var(--td-comp-paddingLR-xs);
    > .t-form__item {
      background-color: var(--td-bg-color-container);
      margin-bottom: var(--td-comp-margin-xs);
      padding: var(--td-comp-paddingTB-s) var(--td-comp-paddingLR-m);
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: var(--td-radius-medium);
    }
  }
  .setting-group-title {
    text-align: left;
    font: var(--td-font-title-medium);
    color: var(--td-text-color-primary);
  }

  .setting-layout-drawer {
    display: flex;
    flex-direction: column;
    align-items: center;

    .t-radio-button {
      display: inline-flex;
      max-height: 78px;
      padding: 0;
      border-radius: var(--td-radius-default);
      border: none;
      > .t-radio-button__label {
        display: inline-flex;
        position: relative;
        .mode-img,
        .layout-img {
          border-radius: 9px;
        }
        .picked {
          position: absolute;
          right: 0;
          bottom: 0;
        }
      }
    }

    .t-is-checked {
      border: none;
    }

    .t-form__controls-content {
      justify-content: end;
    }
  }

  .t-form__controls-content {
    justify-content: end;
  }

  .setting-info {
    position: absolute;
    padding: 24px;
    bottom: 0;
    left: 0;
    line-height: 20px;
    font-size: 12px;
    text-align: center;
    color: var(--td-text-color-placeholder);
    width: 100%;
    background: var(--td-bg-color-container);
  }
}
</style>

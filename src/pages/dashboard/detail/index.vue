<template>
  <div class="dashboard-panel-detail">
    <t-card
      title="本月采购申请情况"
      class="dashboard-detail-card"
      :bordered="false"
    >
      <t-row :gutter="[16, 16]">
        <t-col
          v-for="(item, index) in PANE_LIST_DATA"
          :key="index"
          :xs="6"
          :xl="3"
        >
          <t-card class="dashboard-list-card" :description="item.title">
            <div class="dashboard-list-card__number">{{ item.number }}</div>
            <div class="dashboard-list-card__text">
              <div class="dashboard-list-card__text-left">
                环比
                <trend class="icon" :type="item.upTrend ? 'up' : 'down'" :describe="item.upTrend || item.downTrend" />
              </div>
              <t-icon name="chevron-right" />
            </div>
          </t-card>
        </t-col>
      </t-row>
    </t-card>
    <t-row :gutter="[16, 16]" class="row-margin">
      <t-col :xs="12" :xl="9">
        <t-card
          class="dashboard-detail-card"
          title="采购商品申请趋势"
          subtitle="(件)"
          :bordered="false"
        >
          <template #actions>
            <t-date-range-picker
              class="card-date-picker-container"
              :default-value="LAST_7_DAYS"
              theme="primary"
              mode="date"
              style="width: 248px"
              @change="onMaterialChange"
            />
          </template>
          <div
            id="lineContainer"
            ref="lineContainer"
            style="width: 100%; height: 416px"
          />
        </t-card>
      </t-col>
      <t-col :xs="12" :xl="3">
        
      </t-col>
    </t-row>
    <t-card
      :class="['dashboard-detail-card', 'row-margin']"
      title="采购商品满意度分布"
      :bordered="false"
    >
      <template #actions>
        <t-date-range-picker
          class="card-date-picker-container"
          :default-value="LAST_7_DAYS"
          theme="primary"
          mode="date"
          style="
            display: inline-block;
            margin-right: var(--td-comp-margin-s);
            width: 248px;
          "
          @change="onSatisfyChange"
        />
        <t-button class="card-date-button"> 导出数据 </t-button>
      </template>
      <div
        id="scatterContainer"
        ref="scatterContainer"
        style="width: 100%; height: 434px"
      />
    </t-card>
  </div>
</template>

<script>
export default {
  name: "DashboardDetail",
};
</script>

<script setup>
import { useECharts } from "@landao/hooks";
import {
  computed,
  nextTick,
  onDeactivated,
  onMounted,
  onUnmounted,
  watch,
  ref,
} from "vue";

import Trend from '@/components/trend/index.vue';
import { useSettingStore } from "@/store";
// import { changeChartsTheme } from '@/utils/color';
import { LAST_7_DAYS } from "@/utils/date";

import { PANE_LIST_DATA, PRODUCT_LIST } from "./constants";
import { getFolderLineDataSet, getScatterDataSet } from "./index";

const store = useSettingStore();
const chartColors = computed(() => store.chartColors);

// // lineChart logic
const lineContainer = ref(null);
const { setOption: setLineOption, getInstance: getLineInstance } =
  useECharts(lineContainer);

// // scatterChart logic
const scatterContainer = ref(null);
const { setOption: setScatterOption, getInstance: getScatterInstance } =
  useECharts(scatterContainer);

// // chartSize update
const updateContainer = () => {
  getLineInstance()?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  });
  getScatterInstance()?.resize({
    width: scatterContainer.clientWidth,
    height: scatterContainer.clientHeight,
  });
};

const renderCharts = () => {
  setScatterOption(getScatterDataSet({ ...chartColors.value }));
  setLineOption(getFolderLineDataSet({ ...chartColors.value }));
};

onMounted(() => {
  renderCharts();
  nextTick(() => {
    updateContainer();
  });
  window.addEventListener("resize", updateContainer, false);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateContainer);
});

// onDeactivated(() => {
//   storeModeWatch();
//   storeBrandThemeWatch();
// });

// const storeModeWatch = watch(
//   () => store.mode,
//   () => {
//     renderCharts();
//   },
// );

// const storeBrandThemeWatch = watch(
//   () => store.brandTheme,
//   () => {
//     // changeChartsTheme([lineChart, scatterChart]);
//   },
// );

const onSatisfyChange = () => {
  setScatterOption(getScatterDataSet({ ...chartColors.value }));
};

const onMaterialChange = (value) => {
  const chartColors = computed(() => store.chartColors);
  setLineOption(
    getFolderLineDataSet({ dateTime: value, ...chartColors.value })
  );
};
</script>

<style lang="less" scoped>
.row-margin {
  margin-top: 16px;
}

.product-card {
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingTB-xl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__footer) {
    padding: 0;
  }
}
// 统一增加8px;
.dashboard-detail-card {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__title) {
    font: var(--td-font-title-large);
    font-weight: 400;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }

  :deep(.t-card__actions) {
    display: flex;
    align-items: center;
  }
}

.dashboard-list-card {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);

  :deep(.t-card__description) {
    margin: 0;
  }

  :deep(.t-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: var(--td-comp-margin-s);
  }

  &.dark {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &.light {
    &:hover {
      background: var(--td-gray-color-14);
      cursor: pointer;
    }
  }

  &__number {
    font-size: var(--td-font-size-headline-medium);
    line-height: var(--td-font-size-headline-medium);
    color: var(--td-text-color-primary);
    margin-bottom: var(--td-comp-margin-xxl);
  }

  &__text {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font: var(--td-font-body-medium);
    color: var(--td-text-color-placeholder);
    text-align: left;

    .t-icon {
      font-size: var(--td-comp-size-xxxs);
    }
    &-left {
      display: flex;

      .icon {
        margin: 0 var(--td-comp-margin-s);
      }
    }
  }
}
</style>

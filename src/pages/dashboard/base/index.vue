<template>
  <div>
    <t-button
      @click="
        openDrawer(true, {
          deptId: 0,
        })
      "
      >打开Dialog</t-button
    >
    <ld-help content="提示内容"></ld-help>

    <ld-help
      :content="['提示内容', '提示内容1']"
      showIndex
      iconSize="2em"
    ></ld-help>

    <icon-svg style="color: red" name="dashboard" size="medium"></icon-svg>
    <icon-svg name="empty" size="3rem" @click="handleClick"></icon-svg>
    <div style="background-color: #fff">
      <ld-empty desc="暂无通知"></ld-empty>
    </div>
    <p></p>
    <!-- 顶部 card  -->
    <top-panel class="row-container" />
    <!-- 中部图表  -->
    <middle-chart class="row-container" />
    <!-- 列表排名 -->
    <rank-list class="row-container" />
    <!-- 出入库概览 -->
    <output-overview class="row-container" />
    <DemoDialog @register="registerForm" />
  </div>
</template>

<script>
export default {
  name: "DashboardBase",
};
</script>

<script setup>
import MiddleChart from "./components/MiddleChart.vue";
import OutputOverview from "./components/OutputOverview.vue";
import RankList from "./components/RankList.vue";
import TopPanel from "./components/TopPanel.vue";
import DemoDialog from "./DemoDialog.vue";
import { useDrawer } from "@/components/Drawer/useDrawer";
import { DialogPlugin } from "tdesign-vue-next";
const [registerForm, { openDrawer }] = useDrawer();
function handleClick(e) {
  console.log("iconSvg", e);
}
</script>

<style scoped>
.row-container:not(:last-child) {
  margin-bottom: 16px;
}
</style>

<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，{{ userInfo.mobile }}
          <span class="regular">
            {{ currentTimeStr }}，生活变的再糟糕，也不妨碍我变得更好！</span
          >
        </div>
      </div>

      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <!-- <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="ellipsis" />
          </t-button>
        </template> -->
        <t-row class="content" justify="space-between">
          <t-col class="contract" :span="3">
            <div class="contract-title">手机号</div>
            <div class="contract-detail">
              {{ userInfo.mobile }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">用户名</div>
            <div class="contract-detail">
              {{ userInfo.username }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">真实姓名</div>
            <div class="contract-detail">
              {{ userInfo.realname || "-" }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">昵称</div>
            <div class="contract-detail">
              {{ userInfo.nickname || "-" }}
            </div>
          </t-col>
          <t-col class="contract" :span="3">
            <div class="contract-title">最后登录时间</div>
            <div class="contract-detail">
              {{
                formatDateStr(userInfo.last_login_time, "YYYY-MM-DD HH:mm:ss")
              }}
            </div>
          </t-col>
        </t-row>
      </t-card>
    </t-col>

    
  </t-row>
</template>

<script setup>
import { computed } from "vue";
import { useUserStore } from "@/store";
import { formatAxis, formatDateStr } from "@/landao/utils/date";
defineOptions({
  name: "UserIndex",
});
// 当前时间提示语
const currentTimeStr = computed(() => {
  return formatAxis(new Date());
});
const { userInfo } = useUserStore();
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

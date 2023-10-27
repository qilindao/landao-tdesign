<template>
  <result title="403 Forbidden" tip="抱歉，您无权限访问此页面。">
    <t-button @click="() => $router.push('/')">返回首页</t-button>
  </result>
</template>
<script>
export default {
  name: 'Result403',
};
</script>
<script setup >
import Result from '@/components/result/index.vue';
</script>

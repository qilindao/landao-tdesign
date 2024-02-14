<template>
  <div class="login-wrapper">
    <login-header />

    <div class="login-container">
      <div class="title-container">
        <h1 class="title margin-no">登录到</h1>
        <h1 class="title">LanDao Admin</h1>
      </div>

      <login />
    </div>

    <footer class="copyright">
      Copyright @ 2021-2023 LanDaoAdmin. All Rights Reserved
    </footer>
  </div>
</template>

<script setup>
defineOptions({
  name: "LoginIndex",
});

import LoginHeader from "./components/Header.vue";
import Login from "./components/Login.vue";
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

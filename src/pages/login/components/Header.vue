<template>
  <header class="login-header">
    <logo-full-icon class="logo" />
    <div class="operations-container">LanDao Admin</div>
  </header>
</template>

<script setup>
import LogoFullIcon from "@/assets/svg/assets-logo-full.svg?component";
</script>

<style lang="less" scoped>
.login-header {
  padding: 0 var(--td-comp-paddingLR-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(10px);
  color: var(--td-text-color-primary);
  height: var(--td-comp-size-xxxl);

  .logo {
    width: 178px;
    height: var(--td-comp-size-s);
  }

  .operations-container {
    display: flex;
    align-items: center;
    .t-button {
      margin-left: var(--td-comp-margin-l);
    }
  }
}
</style>

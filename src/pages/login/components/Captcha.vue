<template>
  <div class="captcha" @click="refresh">
    <t-loading
      size="small"
      :loading="loading"
      show-overlay
      style="height: 100%; width: 100%"
    >
      <img id="captchaImg" class="img" :src="base64" alt="刷新验证码" />
    </t-loading>
  </div>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useRequest } from "@landao/hooks";
import { getCaptcha } from "@/api/passport";
export default defineComponent({
  name: "Captcha",
  emits: ["update:modelValue", "change"],
  setup(_, { emit }) {
    const base64 = ref("");
    const { loading, run: refresh } = useRequest(getCaptcha, {
      debounceWait: 300,
      onSuccess: (res) => {
        const { captcha, captchaUniqId } = res.data;
        base64.value = captcha;
        emit("update:modelValue", captchaUniqId);
        emit("change", { captcha, captchaUniqId });
      },
    });
    return {
      refresh,
      base64,
      loading,
    };
  },
});
</script>
<style lang="less" scoped>
.captcha {
  width: 120px;
  height: 40px;
  margin-left: 3px;
  float: right !important;
  background: #ccc;
  cursor: pointer;
  .img {
    width: 100%;
    height: 100%;
  }
  .svg {
    height: 100%;
    width: 100%;
    position: relative;
  }
}
</style>

<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <t-form-item name="username">
      <t-input
        v-model="formData.username"
        size="large"
        placeholder="请输入手机号"
      >
        <template #prefix-icon>
          <t-icon name="user" />
        </template>
      </t-input>
    </t-form-item>

    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon
            :name="showPsw ? 'browse' : 'browse-off'"
            @click="showPsw = !showPsw"
          />
        </template>
      </t-input>
    </t-form-item>
    <t-form-item name="verifyCode">
      <t-input-group separate style="width: 100%">
        <t-input
          :style="{ width: '70%' }"
          placeholder="请输入图片验证码"
          size="large"
          :maxlength="4"
          v-model="formData.verifyCode"
        />
        <Captcha
          ref="captchaRef"
          v-model="formData.captchaUniqId"
          @change="
            () => {
              formData.verifyCode = '';
            }
          "
        />
      </t-input-group>
    </t-form-item>

    <div class="check-container remember-pwd">
      <!-- <t-checkbox>记住账号</t-checkbox> -->
      <!-- <span class="tip">忘记账号？</span> -->
    </div>

    <t-form-item class="btn-container">
      <t-button block size="large" type="submit" :loading="saving">
        登录
      </t-button>
    </t-form-item>
  </t-form>
</template>

<script setup>
import { MessagePlugin } from "tdesign-vue-next";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Captcha from "./Captcha";
import { useCryptoJS } from "@/landao/hooks";

import { useUserStore } from "@/store";

const userStore = useUserStore();

const INITIAL_DATA = {
  username: "peadmin",
  password: "123456qwe@A",
  verifyCode: "",
  captchaUniqId: "",
};

const FORM_RULES = {
  username: [{ required: true, message: "账号必填", type: "error" }],
  password: [{ required: true, message: "密码必填", type: "error" }],
  verifyCode: [{ required: true, message: "验证码必填", type: "error" }],
};

const type = ref("password");

const form = ref();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const router = useRouter();
const route = useRoute();
const captchaRef = ref(null);
const saving = ref(false);

const onSubmit = async (ctx) => {
  if (ctx.validateResult === true) {
    saving.value = true;
    try {
      const { username, password, verifyCode, captchaUniqId } = formData.value;
      //密码加密
      const { aesValue } = useCryptoJS(password, captchaUniqId);
      await userStore.login({
        username,
        password: aesValue,
        verifyCode,
        captchaUniqId,
      });

      MessagePlugin.success("登陆成功");
      const redirect = route.query.redirect;
      const redirectUrl = redirect
        ? decodeURIComponent(redirect)
        : "/dashboard";
      router.push(redirectUrl);
    } catch (e) {
      //刷新验证码
      captchaRef.value.refresh();
      MessagePlugin.error(e.message);
    } finally {
      saving.value = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import url("../index.less");
</style>

<template>
  <LdDialog
    v-bind="$attrs"
    :title="title"
    width="700px"
    @register="registerDialog"
    :helpMessage="['提示1', '提示2']"
    @ok="handleSubmit"
  >
    <LdForm @register="registerForm"> </LdForm>
  </LdDialog>
</template>

<script>
import { defineComponent, toRefs } from "vue";

import { useUserFormStates, useUserForm } from "./useUserForm";

export default defineComponent({
  name: "UserForm",
  emits: ["success", "register"],
  setup() {
    const states = useUserFormStates();
    const { registerForm, doSubmit, registerDialog } = useUserForm(states);

    async function handleSubmit() {
      await doSubmit();
    }

    return {
      ...toRefs(states),
      registerForm,
      registerDialog,
      handleSubmit,
    };
  },
});
</script>

<style scoped></style>

<template>
  <LdDialog
    v-bind="$attrs"
    :title="title"
    @register="registerDialog"
    @ok="handleSubmit"
  >
    <LdForm @register="registerForm"> </LdForm>
  </LdDialog>
</template>

<script>
import { defineComponent, toRefs } from "vue";

import { useRoleFormStates, useRoleForm } from "./useRoleForm";

export default defineComponent({
  name: "RoleForm",
  emits: ["success", "register"],
  setup() {
    const states = useRoleFormStates();
    const { registerForm, doSubmit, registerDialog } = useRoleForm(states);

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

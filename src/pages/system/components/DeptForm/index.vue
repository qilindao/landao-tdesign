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
import { useDeptFormStates, useDeptForm } from "./useDeptForm";
export default defineComponent({
  name: "DeptMenuForm",
  emits: ["success", "register"],
  setup() {
    const states = useDeptFormStates();
    const { registerDialog, registerForm, doSubmit } = useDeptForm(states);
    async function handleSubmit() {
      await doSubmit();
    }
    return {
      ...toRefs(states),
      registerDialog,
      registerForm,
      handleSubmit,
    };
  },
});
</script>

<style scoped></style>

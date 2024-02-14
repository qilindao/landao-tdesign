<template>
  <LdDialog
    v-bind="$attrs"
    :title="title"
    @register="registerDialog"
    @ok="handleSubmit"
  >
    <LdForm @register="registerForm">
      <template #menuIconSlot="{ model, field }">
        <MenuIcon v-model="model[field]"></MenuIcon>
      </template>
    </LdForm>
  </LdDialog>
</template>

<script>
import { defineComponent, toRefs } from "vue";
import { useMenuFormStates, useMenuForm } from "./useMenuForm";
import MenuIcon from "../MenuIcon";
export default defineComponent({
  name: "OrganMenuForm",
  components: {
    MenuIcon,
  },
  emits: ["success", "register"],
  setup() {
    const states = useMenuFormStates();
    const { registerDialog, registerForm, doSubmit } = useMenuForm(states);
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

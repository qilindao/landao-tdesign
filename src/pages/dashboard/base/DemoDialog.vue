<template>
  <ld-drawer v-bind="$attrs" title="测试标题" @register="registerDrawer" size="50%" placement="bottom">
    fdsfdfsdfd
    <template #insertFooter>
      <span class="mr-2" style="font-size: 14px">默认密码：123qwe@ASD</span>
    </template>
  </ld-drawer>
</template>

<script>
import { defineComponent } from "vue";
import { useDrawerInner } from "@/components/Drawer/useDrawer";

export default defineComponent({
  emits: ["success", "register"],
  setup() {
    const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(
      async (data) => {
        setDrawerProps({ confirmLoading: true, loading: true });
        console.log(data);
      }
    );
    return { registerDrawer };
  },
});
</script>

<style scoped></style>

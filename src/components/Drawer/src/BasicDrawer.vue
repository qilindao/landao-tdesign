<template>
  <t-drawer v-model:visible="visibleRef" v-bind="getBindValues" :header="title">
    <template #body>
      <div v-loading="getLoading"><slot></slot></div>
    </template>
    <template #footer>
      <DrawerFooter v-bind="getProps" @close="handleClose" @ok="handleOk">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot> </template
      ></DrawerFooter>
    </template>
  </t-drawer>
</template>

<script>
import {
  ref,
  computed,
  unref,
  toRaw,
  watch,
  defineComponent,
  getCurrentInstance,
} from "vue";
import { omit, merge } from "lodash-es";
import { useAttrs } from "@/landao/hooks";
import { DrawerProps } from "./props";
import DrawerFooter from "./components/Footer";

export default defineComponent({
  name: "LdDrawer",
  emits: ["register", "visible-change", "close", "ok"],
  components: { DrawerFooter },
  props: DrawerProps,
  setup(props, { emit }) {
    /** t-drawer 显示隐藏 */
    const visibleRef = ref(false);
    /** 最后一次 props */
    const propsRef = ref(null);
    const attrs = useAttrs();

    const getProps = computed(() => {
      return {
        ...unref(attrs),
        ...unref(getMergeProps),
        visible: unref(visibleRef),
      };
    });

    /** @description 合并 初始props 和 最后一次props */
    const getMergeProps = computed(() => {
      return merge(toRaw(props), unref(propsRef));
    });

    const getBindValues = computed(() => {
      return {
        ...attrs,
        ...omit(unref(getProps), [
          "loading",
          "title",
          "visible",
          "closeFunc",
          "confirmLoading",
          "isShowCancelBtn",
          "isShowOkBtn",
          "isShowFooter",
          "alignCenter",
          "cancelButtonProps",
          "cancelText",
          "okButtonProps",
          "okText",
          "footerAlign",
          "okType",
        ]),
      };
    });

    /** 内容区域 loading */
    const getLoading = computed(() => {
      return !!unref(getProps)?.loading;
    });

    /** @description 监听 props.visible 变化 */
    watch(
      () => props.visible,
      (newVal, oldVal) => {
        if (newVal !== oldVal) visibleRef.value = newVal;
      },
      { deep: true }
    );

    /**@description  监听 visibleRef 变化 */
    watch(
      () => visibleRef.value,
      (visible) => {
        emit("visible-change", visible);
        instance && drawerInstance.emitVisible?.(visible, instance.uid);
      }
    );

    const setDrawerProps = (props) => {
      propsRef.value = merge(unref(propsRef) || {}, props);
      if (Reflect.has(props, "visible")) {
        visibleRef.value = !!props.visible;
      }
    };

    const drawerInstance = {
      setDrawerProps,
      emitVisible: undefined,
    };
    const instance = getCurrentInstance();

    instance && emit("register", drawerInstance, instance.uid);

    const handleClose = async (event) => {
      const { closeFunc } = unref(getProps);
      emit("close", event);
      if (closeFunc && isFunction(closeFunc)) {
        const res = await closeFunc();
        visibleRef.value = !res;
        return;
      }
      visibleRef.value = false;
    };

    const handleOk = () => {
      emit("ok");
    };

    return {
      visibleRef,
      getBindValues,
      getLoading,
      getProps,
      handleClose,
      handleOk,
    };
  },
});
</script>

<style scoped></style>

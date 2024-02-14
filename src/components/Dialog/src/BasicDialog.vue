<template>
  <t-dialog v-bind="getBindValue" @close="handleCancel">
    <template #header v-if="!$slots.header">
      <DialogHeader
        :helpMessage="getProps.helpMessage"
        :title="getMergeProps.title"
      />
    </template>
    <template v-else #header>
      <slot name="header"></slot>
    </template>

    <template #body>
      <t-loading
        size="small"
        text="加载中..."
        :loading="getLoading"
        show-overlay
      >
        <slot></slot>
      </t-loading>
    </template>
    <template #footer v-if="!$slots.footer">
      <DialogFooter v-bind="getProps" @close="handleCancel" @ok="handleOk">
        <template #[item]="data" v-for="item in Object.keys($slots)">
          <slot :name="item" v-bind="data || {}"></slot> </template
      ></DialogFooter>
    </template>
    <template v-else #footer>
      <slot name="footer"></slot>
    </template>
  </t-dialog>
</template>

<script>
import {
  ref,
  computed,
  defineComponent,
  getCurrentInstance,
  unref,
  watch,
  watchEffect,
} from "vue";
import { omit } from "lodash-es";
import { useAttrs } from "@landao/hooks";
import { DialogProps } from "./props";
import { deepMerge } from "@/landao/utils";
import DialogHeader from "./components/Header";
import DialogFooter from "./components/Footer";

export default defineComponent({
  name: "LdDialog",
  props: DialogProps,
  inheritAttrs: false,
  emits: ["register", "visible-change", "cancel", "ok", "update:visible"],
  components: {
    DialogHeader,
    DialogFooter,
  },
  setup(props, { emit }) {
    /** t-dialog 显示隐藏 */
    const visibleRef = ref(false);
    /** 最后一次 props */
    const propsRef = ref({});
    const attrs = useAttrs();

    const getProps = computed(() => {
      const opt = {
        ...unref(getMergeProps),
        visible: unref(visibleRef),
        cancelBtn: "null",
        confirmBtn: "null",
        header: false,
      };
      return {
        ...opt,
      };
    });

    /** @description 合并 初始props 和 最后一次props */
    const getMergeProps = computed(() => {
      return {
        ...props,
        ...unref(propsRef),
      };
    });

    const getBindValue = computed(() => {
      const attr = {
        ...attrs,
        ...unref(getMergeProps),
        visible: unref(visibleRef),
      };

      return omit(attr, "title");
    });

    /** 内容区域 loading */
    const getLoading = computed(() => {
      return !!unref(getProps)?.loading;
    });

    /** @description 监听 props.visible 变化 */
    watchEffect(() => {
      visibleRef.value = !!props.visible;
    });

    /**@description  监听 visibleRef 变化 */
    watch(
      () => unref(visibleRef),
      (v) => {
        emit("visible-change", v);
        emit("update:visible", v);
        if (instance && dialogMethods.emitVisible) {
          dialogMethods.emitVisible(v, instance.uid);
        }
      },
      {
        immediate: false,
      }
    );

    const setDialogProps = (props) => {
      propsRef.value = deepMerge(unref(propsRef) || {}, props);
      if (Reflect.has(props, "visible")) {
        visibleRef.value = !!props.visible;
      }
    };

    const dialogMethods = {
      setDialogProps,
      emitVisible: undefined,
    };

    const instance = getCurrentInstance();

    instance && emit("register", dialogMethods, instance.uid);

    const handleCancel = async (event) => {
      if (props.closeFunc && isFunction(props.closeFunc)) {
        const isClose = await props.closeFunc();
        visibleRef.value = !isClose;
        return;
      }

      visibleRef.value = false;
      emit("cancel", event);
    };

    const handleOk = () => {
      emit("ok");
    };

    return {
      visibleRef,
      getBindValue,
      getLoading,
      getProps,
      getMergeProps,
      handleCancel,
      handleOk,
    };
  },
});
</script>

<style scoped></style>

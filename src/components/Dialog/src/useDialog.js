import { isEqual, isFunction } from "lodash-es";
import {
  ref,
  getCurrentInstance,
  reactive,
  unref,
  computed,
  toRaw,
  watchEffect,
  nextTick,
} from "vue";
import { isProd } from "@/landao/env";
import { tryOnUnmounted } from "@vueuse/core";

const dataTransferRef = reactive({});

const visibleData = reactive({});
/**
 * 用于外部操作组件
 * @returns
 */
export function useDialog() {
  if (!getCurrentInstance()) {
    throw new Error(
      "useDialog() can only be used inside setup() or functional components!"
    );
  }
  const dialogRef = ref(null);
  const loaded = ref(false);
  const uid = ref("");
  function register(dialogInstance, uuid) {
    isProd() &&
      tryOnUnmounted(() => {
        dialogRef.value = null;
        loaded.value = null;
        dataTransferRef[unref(uid)] = null;
      });
    if (unref(loaded) && dialogInstance === unref(dialogRef)) {
      return;
    }
    uid.value = uuid;
    dialogRef.value = dialogInstance;
    loaded.value = true;
    dialogInstance.emitVisible = (visible, uid) => {
      visibleData[uid] = visible;
    };
  }
  const getInstance = () => {
    const instance = unref(dialogRef);
    if (!instance) {
      throw new Error("useDialog instance is undefined!");
    }
    return instance;
  };

  const methods = {
    setDialogProps: (props) => {
      getInstance()?.setDialogProps(props);
    },
    getVisible: computed(() => {
      return visibleData[~~unref(uid)];
    }),
    openDialog: (visible = true, data, openOnSet = true) => {
      getInstance()?.setDialogProps({
        visible: visible,
      });
      if (!data) return;
      if (openOnSet) {
        dataTransferRef[unref(uid)] = null;
        dataTransferRef[unref(uid)] = toRaw(data);
        return;
      }
      const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
      if (!equal) {
        dataTransferRef[unref(uid)] = toRaw(data);
      }
    },
    closeDialog: () => {
      getInstance()?.setDialogProps({ visible: false });
    },
  };
  return [register, methods];
}

/**
 * 用于独立的 Dialog 内部调用
 * @param {*} callbackFn
 */
export function useDialogInner(callbackFn) {
  const dialogInstanceRef = ref(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref("");
  if (!getCurrentInstance()) {
    throw new Error(
      "useDialogInner() can only be used inside setup() or functional components!"
    );
  }

  const getInstance = () => {
    const instance = unref(dialogInstanceRef);
    if (!instance) {
      throw new Error("useDialogInner instance is undefined!");
    }
    return instance;
  };

  const register = (modalInstance, uuid) => {
    isProd() &&
      tryOnUnmounted(() => {
        dialogInstanceRef.value = null;
      });
    uidRef.value = uuid;
    dialogInstanceRef.value = modalInstance;
    currentInstance?.emit("register", modalInstance, uuid);
  };

  watchEffect(() => {
    const data = dataTransferRef[unref(uidRef)];
    if (!data) return;
    if (!callbackFn || !isFunction(callbackFn)) return;
    nextTick(() => {
      callbackFn(data);
    });
  });

  const methods = {
    changeLoading: (loading = true) => {
      getInstance()?.setDialogProps({ loading });
    },
    changeOkLoading: (loading = true) => {
      getInstance()?.setDialogProps({ confirmLoading: loading });
    },
    getVisible: computed(() => {
      return visibleData[~~unref(uidRef)];
    }),
    closeDialog: () => {
      getInstance()?.setDialogProps({ visible: false });
    },
    setDialogProps: (props) => {
      getInstance()?.setDialogProps(props);
    },
  };

  return [register, methods];
}

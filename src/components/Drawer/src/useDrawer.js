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
import { isEqual, isFunction } from "lodash-es";
import { isProd } from "@/landao/env";
import { tryOnUnmounted } from "@vueuse/core";

const dataTransferRef = reactive({});

const visibleData = reactive({});

export function useDrawer() {
  if (!getCurrentInstance()) {
    throw new Error(
      "useDrawer() can only be used inside setup() or functional components!"
    );
  }
  const drawerRef = ref(null);
  const loaded = ref(false);
  const uid = ref("");
  function register(drawerInstance, uuid) {
    if (unref(loaded) && drawerInstance === unref(drawerRef)) {
      return;
    }
    uid.value = uuid;
    drawerRef.value = drawerInstance;
    loaded.value = true;
    drawerInstance.emitVisible = (visible, uid) => {
      visibleData[uid] = visible;
    };
  }
  const getInstance = () => {
    const instance = unref(drawerRef);
    if (!instance) {
      throw new Error("useDrawer instance is undefined!");
    }
    return instance;
  };

  const methods = {
    setDrawerProps: (props) => {
      getInstance()?.setDrawerProps(props);
    },
    getVisible: computed(() => {
      return visibleData[~~unref(uid)];
    }),
    openDrawer: (visible = true, data, openOnSet = true) => {
      getInstance()?.setDrawerProps({
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
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ visible: false });
    },
  };
  return [register, methods];
}

/**
 * 用于独立的 Drawer 内部调用
 * @param {*} callbackFn
 */
export function useDrawerInner(callbackFn) {
  const drawerInstanceRef = ref(null);
  const currentInstance = getCurrentInstance();
  const uidRef = ref("");
  if (!getCurrentInstance()) {
    throw new Error(
      "useDrawerInner() can only be used inside setup() or functional components!"
    );
  }

  const getInstance = () => {
    const instance = unref(drawerInstanceRef);
    if (!instance) {
      throw new Error("useDrawerInner instance is undefined!");
    }
    return instance;
  };

  const register = (modalInstance, uuid) => {
    isProd() &&
      tryOnUnmounted(() => {
        drawerInstanceRef.value = null;
      });
    uidRef.value = uuid;
    drawerInstanceRef.value = modalInstance;
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
      getInstance()?.setDrawerProps({ loading });
    },
    changeOkLoading: (loading = true) => {
      getInstance()?.setDrawerProps({ confirmLoading: loading });
    },
    getVisible: computed(() => {
      return visibleData[~~unref(uidRef)];
    }),
    closeDrawer: () => {
      getInstance()?.setDrawerProps({ visible: false });
    },
    setDrawerProps: (props) => {
      getInstance()?.setDrawerProps(props);
    },
  };

  return [register, methods];
}

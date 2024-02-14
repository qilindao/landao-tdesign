<template>
  <t-tree-select
    v-bind="getAttrs"
    :keys="fieldNames"
    @change="handleChange"
    :loading="loading"
    :tree-props="{
      load: async ? onLoadData : undefined,
    }"
  >
    <template #empty> <ld-empty desc="暂无数据..." /> </template>
  </t-tree-select>
</template>
<script>
import {
  defineComponent,
  ref,
  computed,
  unref,
  watch,
  useAttrs,
  onMounted,
} from "vue";
import { get } from "lodash-es";
import { isFunction, isArray } from "@/landao/utils/is";

export default defineComponent({
  name: "ApiTreeSelect",
  props: {
    api: { type: Function },
    params: { type: Object },
    immediate: { type: Boolean, default: true },
    async: { type: Boolean, default: false },
    afterFetch: { type: Function, default: null },
    resultField: { type: String, default: "data" },
    labelField: { type: String, default: "label" },
    valueField: { type: String, default: "value" },
    childrenField: { type: String, default: "children" },
  },
  emits: ["options-change", "change", "load-data"],
  setup(props, { emit }) {
    const attrs = useAttrs();
    const treeData = ref([]);
    const isFirstLoaded = ref(false);
    const loading = ref(false);
    const getAttrs = computed(() => {
      return {
        ...(props.api ? { data: unref(treeData) } : {}),
        ...attrs,
      };
    });

    const fieldNames = {
      children: props.childrenField,
      value: props.valueField,
      label: props.labelField,
    };

    function handleChange(...args) {
      emit("change", ...args);
    }

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoaded) && fetch();
      },
      { deep: true }
    );

    watch(
      () => props.immediate,
      (v) => {
        v && !isFirstLoaded.value && fetch();
      }
    );

    onMounted(() => {
      props.immediate && fetch();
    });

    function onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (isArray(treeNode.children) && treeNode.children.length > 0) {
          resolve();
          return;
        }
        emit("load-data", { treeData, treeNode, resolve });
      });
    }

    async function fetch() {
      const { api, params, resultField, afterFetch } = props;
      if (!api || !isFunction(api) || loading.value) return;
      loading.value = true;
      treeData.value = [];
      let result;
      try {
        result = await api(params);
      } catch (e) {
        console.error(e);
      }
      loading.value = false;
      if (!result) return;
      if (!isArray(result)) {
        result = get(result, resultField);
      }
      //是否自定义格式化数据。针对后端返回一维数组，和需要自己增加数据项
      if (afterFetch && isFunction(afterFetch)) {
        treeData.value = afterFetch(result);
      } else {
        treeData.value = result || [];
      }

      isFirstLoaded.value = true;
      emit("options-change", treeData.value);
    }
    return {
      getAttrs,
      handleChange,
      fieldNames,
      onLoadData,
      loading,
    };
  },
});
</script>

<template>
  <t-cascader
    v-model:value="state"
    :options="options"
    :load="loadData"
    @change="handleChange"
    :valueDisplay="handleRenderDisplay"
  >
    <template #empty> <ld-empty desc="暂无数据..." /> </template>
  </t-cascader>
</template>
<script>
import { defineComponent, watch, watchEffect } from "vue";
import { useRuleFormItem } from "../hooks/useRuleFormItem";
import { isFunction } from "@/landao/utils/is";

export default defineComponent({
  name: "ApiCascader",
  props: {
    value: {
      type: Array,
    },
    api: {
      type: Function,
      default: null,
    },
    numberToString: {
      type: Boolean,
      default: false,
    },
    resultField: {
      type: String,
      default: "data",
    },
    labelField: {
      type: String,
      default: "label",
    },
    valueField: {
      type: String,
      default: "value",
    },
    childrenField: {
      type: String,
      default: "children",
    },
    apiParamKey: {
      type: String,
      default: "parentId",
    },
    immediate: {
      type: Boolean,
      default: true,
    },
    // init fetch params
    initFetchParams: {
      type: Object,
      default: () => ({}),
    },
    // 是否有下级，默认是
    isLeaf: {
      type: Function,
      default: null,
    },
    displayRenderArray: {
      type: Array,
    },
  },
  emits: ["change", "defaultChange"],
  setup(props, { emit }) {
    const apiData = ref([]);
    const options = ref([]);
    const loading = ref(false);
    const emitData = ref([]);
    const isFirstLoad = ref(true);

    const [state] = useRuleFormItem(props, "value", "change", emitData);

    watch(
      apiData,
      (data) => {
        const opts = generatorOptions(data);
        options.value = opts;
      },
      { deep: true }
    );

    function generatorOptions(options) {
      const { labelField, valueField, numberToString, childrenField, isLeaf } =
        props;
      return options.reduce((prev, next) => {
        if (next) {
          const value = next[valueField];
          const item = {
            ...omit(next, [labelField, valueField]),
            label: next[labelField],
            value: numberToString ? `${value}` : value,
            isLeaf:
              isLeaf && typeof isLeaf === "function" ? isLeaf(next) : false,
          };
          const children = Reflect.get(next, childrenField);
          if (children) {
            Reflect.set(item, childrenField, generatorOptions(children));
          }
          prev.push(item);
        }
        return prev;
      }, []);
    }

    async function initialFetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      apiData.value = [];
      loading.value = true;
      try {
        const res = await api(props.initFetchParams);
        if (Array.isArray(res)) {
          apiData.value = res;
          return;
        }
        if (props.resultField) {
          apiData.value = get(res, props.resultField) || [];
        }
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    const loadData = async (selectedOptions) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      const api = props.api;
      if (!api || !isFunction(api)) return;
      try {
        const res = await api({
          [props.apiParamKey]: Reflect.get(targetOption, "value"),
        });
        if (Array.isArray(res)) {
          const children = generatorOptions(res);
          targetOption.children = children;
          return;
        }
        if (props.resultField) {
          const children = generatorOptions(get(res, props.resultField) || []);
          targetOption.children = children;
        }
      } catch (e) {
        console.error(e);
      } finally {
        targetOption.loading = false;
      }
    };

    watchEffect(() => {
      props.immediate && initialFetch();
    });

    watch(
      () => props.initFetchParams,
      () => {
        !unref(isFirstLoad) && initialFetch();
      },
      { deep: true }
    );

    function handleChange(keys, args) {
      emitData.value = args;
      emit("defaultChange", keys, args);
    }

    const handleRenderDisplay = ({ labels, selectedOptions }) => {
      if (unref(emitData).length === selectedOptions?.length) {
        return labels.join(" / ");
      }
      if (props.displayRenderArray) {
        return props.displayRenderArray.join(" / ");
      }
      return "";
    };

    return {
      state,
      options,
      loadData,
      handleChange,
      handleRenderDisplay,
    };
  },
});
</script>

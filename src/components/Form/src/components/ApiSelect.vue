<template>
  <t-select
    @popup-visible-change="handleFetch"
    v-bind="$attrs"
    @change="handleChange"
    :options="getOptions"
    v-model:value="state"
    :loading="loading"
  >
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
    <template #empty> <ld-empty desc="暂无数据..." /> </template>
  </t-select>
</template>

<script>
import { watchEffect, watch, ref, unref, computed, defineComponent } from "vue";
import { get, omit } from "lodash-es";
import { isFunction, isStringArray } from "@/landao/utils/is";
import { useAttrs } from "@landao/hooks";
import { useRuleFormItem } from "../hooks/useRuleFormItem";

export default defineComponent({
  name: "ApiSelect",
  inheritAttrs: false,
  props: {
    value: [Array, Object, String, Number],
    numberToString: { type: Boolean, default: false },
    api: {
      type: Function,
      default: null,
    },
    // api params
    params: {
      type: Object,
      default: () => ({}),
    },
    // support xxx.xxx.xx
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
    immediate: {
      type: Boolean,
      default: true,
    },
    alwaysLoad: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["options-change", "change", "update:value"],
  setup(props, { emit }) {
    const options = ref([]);
    const loading = ref(false);
    const isFirstLoad = ref(true);
    const emitData = ref([]);
    const attrs = useAttrs();
    const [state] = useRuleFormItem(props, "value", "change", emitData);
    const getOptions = computed(() => {
      const { labelField, valueField, numberToString } = props;
      //判断数组中是否是字符串值,
      const isStringArr = isStringArray(unref(options));
      let data = unref(options).reduce((prev, next) => {
        if (next) {
          if (isStringArr) {
            prev.push({
              label: next,
              value: next,
            });
          } else {
            const value = get(next, valueField);
            prev.push({
              ...omit(next, [labelField, valueField]),
              label: get(next, labelField),
              value: numberToString ? `${value}` : value,
            });
          }
        }
        return prev;
      }, []);
      return data.length > 0 ? data : props.options;
    });

    watchEffect(() => {
      props.immediate && !props.alwaysLoad && fetch();
    });

    watch(
      () => state.value,
      (v) => {
        emit("update:value", v);
      }
    );

    watch(
      () => props.params,
      () => {
        !unref(isFirstLoad) && fetch();
      },
      { deep: true }
    );
    async function fetch() {
      const api = props.api;
      if (!api || !isFunction(api)) return;
      options.value = [];
      try {
        loading.value = true;
        const res = await api(props.params);
        if (Array.isArray(res)) {
          options.value = res;
          emitChange();
          return;
        }
        if (props.resultField) {
          options.value = get(res, props.resultField) || [];
        }
        emitChange();
      } catch (error) {
        console.warn(error);
      } finally {
        loading.value = false;
      }
    }

    async function handleFetch(visible) {
      if (visible) {
        if (props.alwaysLoad) {
          await fetch();
        } else if (!props.immediate && unref(isFirstLoad)) {
          await fetch();
          isFirstLoad.value = false;
        }
      }
    }

    function emitChange() {
      emit("options-change", unref(getOptions));
    }

    function handleChange(_, ...args) {
      emitData.value = args;
    }

    return { state, attrs, getOptions, loading, handleFetch, handleChange };
  },
});
</script>

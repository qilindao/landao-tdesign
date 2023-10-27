<template>
  <t-radio-group v-bind="attrs" v-model:value="state">
    <template v-for="item in getOptions" :key="`${item.value}`">
      <t-radio-button
        :value="item.value"
        :disabled="item.disabled"
        @click="handleClick(item)"
        >{{ item.label }}</t-radio-button
      >
    </template>
  </t-radio-group>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { useAttrs } from "@/landao/hooks";
import { isString } from "@/landao/utils/is";
import { useRuleFormItem } from "../hooks/useRuleFormItem";

export default defineComponent({
  name: "RadioButtonGroup",
  props: {
    value: {
      type: [String, Number, Boolean],
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["change"],
  setup(props) {
    const attrs = useAttrs();
    const emitData = ref([]);
    const [state] = useRuleFormItem(props, "value", "change", emitData);
    const getOptions = computed(() => {
      const { options } = props;
      if (!options || options?.length === 0) return [];

      const isStringArr = options.some((item) => isString(item));
      if (!isStringArr) return options;

      return options.map((item) => ({ label: item, value: item }));
    });

    function handleClick(...args) {
      emitData.value = args;
    }

    return { state, getOptions, attrs, handleClick };
  },
});
</script>

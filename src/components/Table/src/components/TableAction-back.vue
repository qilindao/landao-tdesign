<template>
  <t-space size="small" class="table-action">
    <template v-for="(action, index) in getActions" :key="index">
      <t-tooltip v-if="action.tooltip" v-bind="getTooltip(action)">
        <t-button v-bind="action">
          <icon-svg
            v-if="action.icon"
            :name="action.icon"
            :class="{ 'mr-1': !!action.label }"
          ></icon-svg>
          {{ action.label }}</t-button
        >
      </t-tooltip>
      <t-popconfirm v-else-if="action.popconfirm" v-bind="action.popconfirm">
        <t-button v-bind="action">
          <icon-svg
            v-if="action.icon"
            :name="action.icon"
            :class="{ 'mr-1': !!action.label }"
          ></icon-svg>
          {{ action.label }}</t-button
        >
      </t-popconfirm>
      <t-button v-else v-bind="action">
        <icon-svg
          v-if="action.icon"
          :name="action.icon"
          :class="{ 'mr-1': !!action.label }"
        ></icon-svg>
        {{ action.label }}</t-button
      >
    </template>
    <t-dropdown
      v-if="dropDownActions && getDropdownOptions.length > 0"
      :options="getDropdownOptions"
      @click="handleCommand"
    >
      <t-button theme="primary" variant="text" size="small" v-if="dropDownActions.label">
        {{ dropDownActions.label }}
        <template #suffix> <t-icon name="chevron-down" size="16" /></template>
      </t-button>
      <t-button theme="primary" size="small" variant="text" v-else>
        <t-icon name="ellipsis" size="16" />
      </t-button>
    </t-dropdown>
  </t-space>
</template>

<script>
import { computed, defineComponent, toRaw } from "vue";
import { usePermission } from "@/landao/hooks";
import { omit } from "lodash-es";
import { isBoolean, isFunction, isString } from "@/landao/utils/is";
/**
 * 适用于表格列表右侧操作按钮组
 *
 * TODO：可优化 view，视图中 t-button 是重复内容，可单独jsx渲染引用，减少代码
 */
export default defineComponent({
  name: "TableAction",
  emits: ["command"],
  props: {
    actions: {
      type: Array,
      default: [],
    },
    dropDownActions: {
      type: Object,
      default: {},
    },
    divider: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const { hasAuth } = usePermission();

    /**
     * 控制按钮是否显示
     * @param {Boolean | Function} action
     */
    const isIfShow = (action) => {
      const { ifShow } = action;
      let isIfShow = true;
      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
    };

    /**
     * 获取操作按钮
     */
    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return (
            (action.auth ? hasAuth(action.auth) : true) && isIfShow(action)
          );
        })
        .map((action) => {
          return {
            variant: "text",
            size: "small",
            theme: "primary",
            ...action,
          };
        });
    });

    /**
     * 操作按钮，文字提示
     */
    const getTooltip = (tooltip) => {
      return {
        ...(isString(tooltip) ? { content: tooltip } : tooltip),
      };
    };

    /**
     * 下拉菜单
     */
    const getDropdownOptions = computed(() => {
      const list = (toRaw(props.dropDownActions.buttons) || []).filter(
        (action) => {
          return (
            (action.auth ? hasAuth(action.auth) : true) && isIfShow(action)
          );
        }
      );
      return list.map((action) => {
        const { label, command } = action;
        return {
          ...omit(action, ["command", "label"]),
          content: label,
          value: command,
        };
      });
    });

    /**
     * 下拉框点击触发
     */
    const handleCommand = (command) => {
      emit("command", command);
    };

    return { getActions, getTooltip, getDropdownOptions, handleCommand };
  },
});
</script>

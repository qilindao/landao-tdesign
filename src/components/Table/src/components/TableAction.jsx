import { computed, defineComponent, toRaw, toRefs } from "vue";
import { usePermission } from "@/landao/hooks";
import { omit } from "lodash-es";
import { isBoolean, isFunction, isString } from "@/landao/utils/is";
/**
 * 适用于表格列表右侧操作按钮组
 *
 * @author zhangwei
 *
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

    /**
     * 渲染 buttion
     * @param {*} action
     * @returns
     */
    const renderButton = (action) => {
      const { icon, label } = action;
      return (
        <t-button {...omit(action, ["auth", "label"])}>
          {icon && (
            <icon-svg name={icon} class={{ "mr-1": !!label }}></icon-svg>
          )}
          {label}
        </t-button>
      );
    };

    /**
     * 渲染操作按钮组
     * @returns
     */
    const renderActionButtion = () => {
      return (
        getActions.value.length > 0 &&
        getActions.value.map((action) => {
          if (action.tooltip) {
            return (
              <t-tooltip {...getTooltip(action)}>
                {renderButton(action)}
              </t-tooltip>
            );
          } else if (action.popConfirm) {
            return (
              <t-popconfirm {...action.popConfirm}>
                {renderButton(omit(action, ["popconfirm"]))}
              </t-popconfirm>
            );
          } else {
            return renderButton(action);
          }
        })
      );
    };

    /**
     * 渲染下拉操作列表
     * @returns
     */
    const renderDropDwonAction = () => {
      const { dropDownActions } = toRefs(props);
      if (dropDownActions.value && getDropdownOptions.value.length > 0) {
        return (
          <t-dropdown
            options={getDropdownOptions.value}
            onClick={handleCommand}
          >
            {dropDownActions.value.label ? (
              <t-button
                theme="primary"
                variant="text"
                size="small"
                v-slots={{
                  suffix: () => <t-icon name="chevron-down" size="16"></t-icon>,
                }}
              >
                {dropDownActions.value.label}
              </t-button>
            ) : (
              <t-button theme="primary" size="small" variant="text">
                <t-icon name="ellipsis" size="16" />
              </t-button>
            )}
          </t-dropdown>
        );
      }
    };

    return () => {
      return (
        <t-space size="small" class="table-action">
          {renderActionButtion()}
          {renderDropDwonAction()}
        </t-space>
      );
    };
  },
});

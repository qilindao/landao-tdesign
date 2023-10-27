import { defineComponent } from "vue";
import HelpProps from "./props";
import { isArray, isString } from "lodash-es";
import "./style/help.less";
export default defineComponent({
  name: "LdHelp",
  props: HelpProps,
  setup(props, ctx) {
    /**
     * 渲染文字提示内容
     * @returns
     */
    const renderContent = () => {
      const content = props.content;
      if (isString(content)) {
        return content;
      }
      if (isArray(content)) {
        return content.map((text, index) => {
          return (
            <p key={index}>
              <>
                {props.showIndex ? `${index + 1}.` : ""}
                {text}
              </>
            </p>
          );
        });
      }
      return "";
    };
    return () => {
      return (
        <t-tooltip
          placement={props.placement}
          showArrow={props.showArrow}
          destroyOnClose={props.destroyOnClose}
          duration={props.duration}
          theme={props.theme}
          v-slots={{ content: () => renderContent() }}
        >
          <span class="ld-help-msg">
            <t-icon name={props.icon} size={props.iconSize}></t-icon>
          </span>
        </t-tooltip>
      );
    };
  },
});

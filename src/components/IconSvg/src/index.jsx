import { computed, h, defineComponent } from "vue";
import IconSvgProps from "./props";
import "./style/iconSvg.less";
import useSizeProps from "./hooks/useSizeProps";

export default defineComponent({
  name: "IconSvg",
  props: IconSvgProps,
  emits: ["click"],
  setup(props, { attrs, emit }) {
    const classPrefix = "icon-svg";
    const propsSize = computed(() => props.size);
    const name = computed(() => props.name || "");
    const { className: sizeClassName, style: sizeStyle } =
      useSizeProps(propsSize);

    const classNames = computed(() => [
      classPrefix,
      `${classPrefix}-${name.value}`,
      sizeClassName.value,
    ]);

    const finalStyle = computed(() => ({ ...sizeStyle.value, ...attrs.style }));

    const finalProps = computed(() => ({
      class: classNames.value,
      style: finalStyle.value,
      onClick: (e) => emit("click", e),
    }));

    return () =>
      h("svg", finalProps.value, h("use", { href: `#icon-${name.value}` }));
  },
});

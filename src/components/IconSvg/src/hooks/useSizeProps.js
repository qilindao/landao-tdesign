import { computed } from "vue";
export default function useSizeProps(size) {
  const classPrefix = "icon-svg";
  const SIZE_CLASS_NAMES = {
    default: "",
    xs: `${classPrefix}-size-xs`,
    small: `${classPrefix}-size-s`,
    medium: `${classPrefix}-size-m`,
    large: `${classPrefix}-size-l`,
    xl: `${classPrefix}-size-xl`,
    block: `${classPrefix}-size-full-width`,
  };

  const className = computed(() => {
    if (size.value in SIZE_CLASS_NAMES) {
      return SIZE_CLASS_NAMES[size.value];
    }
    return "";
  });

  const style = computed(() => {
    if (size.value === undefined || size.value in SIZE_CLASS_NAMES) {
      return {};
    }
    return {
      fontSize: size.value,
    };
  });

  return { style, className };
}

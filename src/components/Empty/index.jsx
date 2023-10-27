import { h, defineComponent } from "vue";
import "./empty.less";
import IconSvg from "../IconSvg/src";

export default defineComponent({
  name: "LdEmpty",
  props: {
    desc: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const classPrefix = "ld-empty";
    return () =>
      h("div", { class: classPrefix }, [
        h(
          "div",
          { class: `${classPrefix}--image` },
          h(IconSvg, { name: "empty" })
        ),
        h("p", { class: `${classPrefix}--description`, innerHTML: props.desc }),
      ]);
  },
});

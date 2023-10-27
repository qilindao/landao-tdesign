import { store } from "@/store";
import router from "@/router";
import TDesign from "tdesign-vue-next";
import { directives } from "./directives";
import { registerComponent } from "./registerComponents";
import "@/style/nprogress.less"; // progress bar style
import "tdesign-vue-next/es/style/index.css";
import "@/style/index.less";
import "./permission";

export async function bootstrap(App) {
  App.use(store);
  App.use(TDesign);
  App.use(router);
  //注册公用组件
  await registerComponent(App);
  directives(App); // 指令
}

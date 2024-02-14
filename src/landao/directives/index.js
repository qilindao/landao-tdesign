import { Permission } from "./modules/permission";
import { Ripple } from "./modules/ripple";
import { Adaptive } from "./modules/adaptive";

/**
 * vue 指令
 * @param {*} app
 */
export function directives(app) {
  //按钮权限指令
  Permission(app);
  //按钮点击涟漪指令
  Ripple(app);
  //元素自适应高度
  Adaptive(app);
}

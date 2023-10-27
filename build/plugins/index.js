import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import createHtml from "./html";
import createImportToCDN from "./importToCDN";
import { svgBuilder } from "./svgBuilder";
/**
 * 3.0.0 bug，报文如下
 * 
 * /node_modules/.pnpm/vite-plugin-mock@3.0.0_esbuild@0.18.11_mockjs@1.1.0_vite@4.4.0/node_modules/vite-plugin-mock/dist/index.mjs:128
 *  if (!require.cache) {
 * ^
 * ReferenceError: require is not defined
 * 
 * 插件模块中的代码与vite基础环境不兼容异常报错
 * node_modules/vite-plugin-mock/dist/index.mjs
 * 
 * 解决报错问题
 * 
 * 第一步：
 * import { createRequire } from 'module';
 * const require = createRequire(import.meta.url);
 * 
 * 第二步：
 * package.json 去掉了type:module可以运行了
 *
 */
import { viteMockServe } from 'vite-plugin-mock';
//将 svg 像组件一样使用
import svgLoader from "vite-svg-loader";

export default function createVitePlugins(viteEnv, isBuild = false) {
  const vitePlugins = [
    vue(),
    vueJsx(),
    viteMockServe({
      mockPath: 'mock',
      enable: true,
    }),
    svgBuilder("./src/icons/svg/"), //全局导入svg
    createHtml(viteEnv, isBuild),
    createImportToCDN(viteEnv),
    svgLoader(),
  ];
  return vitePlugins;
}

import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import createVitePlugins from "./build/plugins";
import { wrapperEnv } from "./build";
import { createProxy } from "./build/server/proxy";

function resolve(dir) {
  return path.resolve(__dirname, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode, command }) => {
  //当前执行node命令时文件夹的地址（工作目录）
  const CWD = process.cwd();
  //获取到的全部都是string配置，node无法识别其他类型配置，比如 Array | Bool
  const env = loadEnv(mode, CWD);
  //将env转化成node可识别的配置
  const viteEnv = wrapperEnv(env);
  const isBuild = command === "build";
  const { VITE_PORT, VITE_BASE_URL, VITE_API_PROXY } = viteEnv;

  return {
    plugins: createVitePlugins(viteEnv, isBuild),
    base: VITE_BASE_URL,
    resolve: {
      alias: {
        "~": resolve("/"),
        "@": resolve("src"),
      },
      extensions: [".js", ".json", ".ts", ".vue", ".jsx"], // 使用路径别名时想要省略的后缀名，可以自己 增减
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            hack: `true; @import (reference) "${path.resolve(
              "src/style/variables.less"
            )}";`,
          },
          math: "strict",
          javascriptEnabled: true,
        },
      },
    },
    server: {
      //是否开启https
      https: false,
      //端口
      port: VITE_PORT,
      proxy: createProxy(VITE_API_PROXY),
      //服务启动时是否自动打开浏览器
      open: true,
      sourcemap: false,
      polyfillDynamicImport: false, // 必须为false
    }
  };
});

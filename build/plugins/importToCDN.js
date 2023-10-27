import { Plugin as importToCDN } from "vite-plugin-cdn-import";
export default function createImportToCDN(env) {
  const { VITE_IS_IMPORT_TO_CDN } = env;
  const cdnUrl = "https://unpkg.com";
  const cdns = [
    {
      name: "nprogress",
      var: "NProgress",
      css: `${cdnUrl}/nprogress@0.2.0/nprogress.css`,
      path: `${cdnUrl}/nprogress@0.2.0/nprogress.js`,
    },
    {
      name: "vue",
      var: "Vue",
      path: `${cdnUrl}/vue@3.3.4/dist/vue.global.prod.js`,
    },
    // {
    //   name: "vue-demi", //pinia 依赖，生产环境下需要
    //   var: "VueDemi",
    //   path: `${cdnUrl}/vue-demi@0.14.5/lib/index.iife.js`,
    // },
    {
      name: "@vueuse/core", //@vueuse/core 包含了 VueDemi
      var: "VueUse",
      path: `${cdnUrl}/@vueuse/core@10.3.0/index.iife.min.js`,
    },
    {
      name: "vue-router",
      var: "VueRouter",
      path: `${cdnUrl}/vue-router@4.2.4/dist/vue-router.global.prod.js`,
    },
    {
      name: "pinia",
      var: "Pinia",
      path: `${cdnUrl}/pinia@2.1.6/dist/pinia.iife.prod.js`,
    },
    {
      name: "axios",
      var: "axios",
      path: `${cdnUrl}/axios@1.4.0/dist/axios.min.js`,
    },
    {
      name: "tdesign-icons-vue-next",
      var: "TDesignIconVueNext",
      path: `${cdnUrl}/tdesign-icons-vue-next@0.1.12/dist/index.min.js`,
    },
    {
      name: "tdesign-vue-next",
      var: "TDesign",
      css: `${cdnUrl}/tdesign-vue-next@1.4.2/dist/tdesign.min.css`,
      path: `${cdnUrl}/tdesign-vue-next@1.4.2/dist/tdesign.min.js`,
    },
    {
      name: "dayjs",
      var: "dayjs",
      path: `${cdnUrl}/dayjs/1.11.7/dayjs.min.js`,
    },
    {
      name: "spark-md5",
      var: "SparkMD5",
      path: `${cdnUrl}/spark-md5@3.0.2/spark-md5.min.js`,
    },
    {
      name: "crypto-js",
      var: "CryptoJS",
      path: `${cdnUrl}/crypto-js@4.1.1/crypto-js.js`,
    },
  ];
  return importToCDN({
    modules: VITE_IS_IMPORT_TO_CDN ? cdns : [],
  });
}

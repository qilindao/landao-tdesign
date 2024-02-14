import { uniq } from "lodash-es";
import { createRouter, createWebHistory, useRoute } from "vue-router";
import Vrouter from "@/router";

import { useSettingStore } from "@/store";

// 导入homepage相关固定路由
const homepageModules = import.meta.glob("./modules/**/homepage.js", {
  eager: true,
});

// 导入modules非homepage相关固定路由
const fixedModules = import.meta.glob("./modules/**/!(homepage).js", {
  eager: true,
});

// 其他固定路由
const defaultRouterList = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/login/index.vue"),
  },
  {
    path: "/",
    redirect: "/dashboard/base",
  },
];
// 存放固定路由
export const homepageRouterList = mapModuleRouterList(homepageModules);
export const fixedRouterList = mapModuleRouterList(fixedModules);

export const allRoutes = [
  ...homepageRouterList,
  ...fixedRouterList,
  ...defaultRouterList,
];

// 固定路由模块转换为路由
export function mapModuleRouterList(modules) {
  const routerList = [];
  Object.keys(modules).forEach((key) => {
    // @ts-ignore
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routerList.push(...modList);
  });
  return routerList;
}

export const getRoutesExpanded = () => {
  const expandedRoutes = [];

  fixedRouterList.forEach((item) => {
    if (item.meta && item.meta.expanded) {
      expandedRoutes.push(item.path);
    }
    if (item.children && item.children.length > 0) {
      item.children
        .filter((child) => child.meta && child.meta.expanded)
        .forEach((child) => {
          expandedRoutes.push(item.path);
          expandedRoutes.push(`${item.path}/${child.path}`);
        });
    }
  });
  return uniq(expandedRoutes);
};

export const getActive = (maxLevel = 3) => {
  // const route = useRoute();
  const route = Vrouter.currentRoute.value;
  const settingStore = useSettingStore();

  if (!route.path) {
    return "";
  }

  if (settingStore.layout === "top") {
    return route.path.split("/").slice(0, 2).join("/");
  }

  return route.path
    .split("/")
    .filter((_item, index) => index <= maxLevel && index > 0)
    .map((item) => `/${item}`)
    .join("");
};

const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
  scrollBehavior() {
    return {
      el: "#app",
      top: 0,
      behavior: "smooth",
    };
  },
});

export default router;

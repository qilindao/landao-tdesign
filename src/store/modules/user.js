import { defineStore } from "pinia";
import { usePermissionStore } from "@/store";

const InitUserInfo = {
  name: "", // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};
export const useUserStore = defineStore("user", {
  state: () => ({
    token: "yiyuan_token", //默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo) {
      const mockLogin = async (userInfo) => {
        return {
          code: 200,
          message: "登录成功",
          data: "yiyuan_token",
        };
      };
      const res = await mockLogin(userInfo);
      if (res.code == 200) {
        this.token = res.data;
      } else {
        throw res;
      }
    },
    async getUserInfo() {
      const mockRemoteUserInfo = async (token) => {
        if (token === "yiyuan_token") {
          return {
            name: "Tencent",
            roles: ["all"], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
          };
        }
        return {
          name: "td_dev",
          roles: ["UserIndex", "DashboardBase", "login"], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
        };
      };
      const res = await mockRemoteUserInfo(this.token);

      this.userInfo = res;
    },
    async logout() {
      this.token = "";
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: "user",
    paths: ["token"],
  },
});

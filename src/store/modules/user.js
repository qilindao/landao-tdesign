import { defineStore } from "pinia";
import { usePermissionStore } from "@/store";
import { doLogin, doLogout } from "@/api/passport";
import { getUserProfile } from "@/api/profile";

const InitUserInfo = {
  nickname: "", // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore("user", {
  state: () => ({
    token: "", //默认token不走权限
    expiresIn: 0,
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    async login(userInfo) {
      await doLogin(userInfo)
        .then((res) => {
          if (res.code == 200) {
            const { accessToken, expiresIn } = res.data;
            this.token = accessToken;
            this.expiresIn = expiresIn;
          } else {
            throw res;
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    async getUserInfo() {
      await getUserProfile()
        .then((res) => {
          const { userInfo } = res.data;
          this.userInfo = userInfo;
        })
        .catch((err) => {});
    },
    async logout() {
      await doLogout()
        .then((result) => {
          if (result.code == 200) {
            this.clearLoginInfo();
          } else {
            throw result;
          }
        })
        .catch((err) => {
          throw err;
        });
    },
    clearLoginInfo() {
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

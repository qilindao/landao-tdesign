import { createApp } from "vue";

import App from "./App.vue";
import { bootstrap } from "./landao";

const app = createApp(App);

bootstrap(app)
  .then(() => {
    app.mount("#app");
  })
  .catch((err) => {
    console.error("landao-admin 启动失败", err);
  });

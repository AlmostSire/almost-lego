import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";

const app = createApp(App);
app.use(Antd).use(store).use(router).mount("#app");

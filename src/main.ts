import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import LegoComponents from "lego-components";
import "lego-components/dist/index.css";

const app = createApp(App);
app.use(Antd).use(store).use(router).use(LegoComponents).mount("#app");

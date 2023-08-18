import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import LegoComponents from "@almost-cli/lego-components";
import "./normalize.css";
import "@almost-cli/lego-components/dist/index.css";
import "cropperjs/dist/cropper.css";

const app = createApp(App);
app.use(Antd).use(store).use(router).use(LegoComponents).mount("#app");

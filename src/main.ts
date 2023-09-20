import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import LegoComponents from "@almost-cli/lego-components";
import "./reset.css";
import "@almost-cli/lego-components/dist/index.css";
import "cropperjs/dist/cropper.css";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { RespData } from "./store/respTypes";
//import "../public/iconfont/iconfont.css";
// const baseBackendURL = "http://182.92.168.192:8081";
export type ICustomAxiosConfig = AxiosRequestConfig & {
  opName?: string;
};
const baseBackendURL = "http://localhost:8080";
axios.defaults.baseURL = `${baseBackendURL}/api/`;
axios.interceptors.request.use((config) => {
  const newConfig = config as ICustomAxiosConfig;
  store.commit("setError", { status: false, message: "" });
  store.commit("startLoading", { opName: newConfig.opName });
  return config;
});
axios.interceptors.response.use(
  (resp: AxiosResponse<RespData>) => {
    const { config, data } = resp;
    const newConfig = config as ICustomAxiosConfig;
    store.commit("finishLoading", { opName: newConfig.opName });
    const { errno, message } = data;
    if (errno !== 0) {
      store.commit("setError", { status: true, message });
      return Promise.reject(data);
    }
    return resp;
  },
  (e: AxiosError) => {
    const newConfig = e.config as ICustomAxiosConfig;
    store.commit("setError", { status: true, message: "服务器错误" });
    store.commit("finishLoading", { opName: newConfig.opName });
    return Promise.reject(e);
  }
);
const app = createApp(App);
app.use(Antd).use(store).use(router).use(LegoComponents).mount("#app");

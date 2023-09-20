import { Module } from "vuex";
import { GlobalDataProps, actionCreate } from "./index";
import axios from "axios";
import { RespData } from "./respTypes";

export interface UserProps {
  isLogin: boolean;
  data?: UserDataProps;
  token?: string;
}

export interface UserDataProps {
  username: string;
  password?: string;
  email?: string;
  nickName?: string;
  picture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  type: "email" | "cellphone" | "oauth";
  provider?: "gitee";
  oauthID?: number;
  role?: "admin" | "normal";
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
    token: localStorage.getItem("token") || "",
  },
  mutations: {
    login(state, rowData: RespData<{ token: string }>) {
      const { token } = rowData.data;
      state.token = token;
      localStorage.setItem("token", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    },
    fetchCurrentUser(state, rowData: RespData<UserDataProps>) {
      state.isLogin = true;
      state.data = { ...rowData.data };
    },
    logout(state) {
      state.token = undefined;
      state.data = undefined;
      state.isLogin = false;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common.Authorization;
    },
  },
  actions: {
    login: actionCreate("/users/loginByCellphone", "login", {
      method: "post",
    }),
    fetchCurrentUser: actionCreate("/users/info", "fetchCurrentUser"),
    async loginAndFetch({ dispatch }, loginData) {
      await dispatch("login", loginData);
      await dispatch("fetchCurrentUser");
    },
  },
};

export default user;

import { Module } from "vuex";
import { GlobalDataProps } from "./index";

export interface UserProps {
  isLogin: boolean;
  userName?: string;
}

const user: Module<UserProps, GlobalDataProps> = {
  state: {
    isLogin: false,
  },
  mutations: {
    login(state) {
      state.isLogin = true;
      state.userName = "viking";
    },
    logout(state) {
      state.isLogin = false;
      state.userName = undefined;
    },
  },
};

export default user;

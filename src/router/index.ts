import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexView from "../views/Index.vue";
import HomeView from "../views/Home.vue";
import store from "@/store";
import axios from "axios";
import { message } from "ant-design-vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    component: IndexView,
    children: [
      {
        path: "",
        name: "home",
        component: HomeView,
        meta: { title: "欢迎来到慕课乐高" },
      },
      {
        path: "template/:id",
        name: "template",
        component: () =>
          import(/* webpackChunkName: "template" */ "../views/Template.vue"),
        meta: { title: "模版详情" },
      },
    ],
  },

  {
    path: "/editor/:id",
    name: "editor",
    component: () =>
      import(/* webpackChunkName: "editor" */ "../views/Editor.vue"),
    meta: { title: "编辑我的设计", requiredLogin: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
    meta: {
      // disableLoading: true,
      title: "登录到慕课乐高",
      redirectAlreadyLogin: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const { isLogin, token } = store.state.user;
  const { redirectAlreadyLogin, requiredLogin, title } = to.meta;
  if (title) {
    document.title = title as string;
  }
  if (!isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      try {
        await store.dispatch("fetchCurrentUser");
        if (redirectAlreadyLogin) {
          return "/";
        }
      } catch (e) {
        message.error("登录状态已过期，请重新登录", 2);
        store.commit("logout");
        return "/login";
      }
    } else {
      if (requiredLogin) {
        return "/login";
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      return "/";
    }
  }
});

export default router;

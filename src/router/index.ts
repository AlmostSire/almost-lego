import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexView from "../views/Index.vue";
import HomeView from "../views/Home.vue";

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
        meta: {
          withHead: true,
        },
      },
      {
        path: "template/:id",
        name: "template",
        component: () =>
          import(/* webpackChunkName: "template" */ "../views/Template.vue"),
      },
    ],
  },

  {
    path: "/editor",
    name: "editor",
    component: () =>
      import(/* webpackChunkName: "editor" */ "../views/Editor.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

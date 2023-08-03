import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import IndexView from "../views/IndexView.vue";
import HomeView from "../views/HomeView.vue";

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
          import(
            /* webpackChunkName: "template" */ "../views/TemplateView.vue"
          ),
      },
    ],
  },

  {
    path: "/editor",
    name: "editor",
    component: () =>
      import(/* webpackChunkName: "editor" */ "../views/EditorView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

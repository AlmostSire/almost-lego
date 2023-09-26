import { createStore } from "vuex";
import { compile } from "path-to-regexp";
import templates, { TemplatesProps } from "./templates";
import user, { UserProps } from "./user";
import editor, { EditorProps } from "./editor";
import global, { GlobalStatus } from "./global";
import { ActionContext } from "vuex";
import axios, { AxiosRequestConfig } from "axios";
import { objToQueryString } from "@/helper";
import { forEach } from "lodash";

export interface ActionPayload {
  urlParams?: Record<string, any>;
  data?: any;
  searchParams?: Record<string, any>;
}

// 第二步， 确定参数
export function actionCreate(
  url: string,
  commitName: string,
  config: AxiosRequestConfig = { method: "get" }
) {
  // 第一步 先返回一个函数和原函数的入参一样
  return async (
    context: ActionContext<any, any>,
    payload: ActionPayload = {}
  ) => {
    const { urlParams, data, searchParams } = payload;
    let newUrl = url;
    if (urlParams) {
      const toPath = compile(url, { encode: encodeURIComponent });
      newUrl = toPath(urlParams);
    }
    if (searchParams) {
      const search = new URLSearchParams();
      forEach(searchParams, (value, key) => {
        search.append(key, value);
      });
      newUrl += "?" + search.toString();
    }
    // 第三步 写内部重复的逻辑
    const newConfig = {
      ...config,
      data,
      opName: commitName,
    };
    const res = await axios(newUrl, newConfig);
    context.commit(commitName, { payload, ...res.data });
    return res.data;
  };
}

export interface GlobalDataProps {
  user: UserProps;
  templates: TemplatesProps;
  editor: EditorProps;
  global: GlobalStatus;
}

const store = createStore<GlobalDataProps>({
  modules: {
    user,
    templates,
    editor,
    global,
  },
});

export default store;

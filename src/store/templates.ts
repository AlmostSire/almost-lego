import { Module } from "vuex";
import { GlobalDataProps, actionCreate } from "./index";
import { RespData, RespListData } from "./respTypes";
import { PageData } from "./editor";

export type TemplateProps = Required<Omit<PageData, "setting" | "props">>;

export interface TemplatesProps {
  data: TemplateProps[];
  totalTemplates: number;
  works: TemplateProps[];
  totalWorks: number;
}

const templates: Module<TemplatesProps, GlobalDataProps> = {
  state: {
    data: [],
    totalTemplates: 0,
    works: [],
    totalWorks: 0,
  },
  getters: {
    getTemplateById: (state) => (id: number) => {
      return state.data.find((t) => t.id === id);
    },
  },
  mutations: {
    fetchTemplates(state, rawData: RespListData<TemplateProps>) {
      const { list, count } = rawData.data;
      state.data = [...state.data, ...list];
      state.totalTemplates = count;
    },
    fetchTemplate(state, rawData: RespData<TemplateProps>) {
      state.data = [rawData.data];
    },
    fetchWorks(state, rawData: RespListData<TemplateProps>) {
      const { count, list } = rawData.data;
      state.works = list;
      state.totalWorks = count;
    },
  },
  actions: {
    fetchTemplates: actionCreate("/templates", "fetchTemplates"),
    fetchTemplate: actionCreate("/templates/:id", "fetchTemplate"),
    fetchWorks: actionCreate("/works", "fetchWorks"),
  },
};

export default templates;

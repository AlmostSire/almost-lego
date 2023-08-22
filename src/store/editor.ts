import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";

import {
  AllComponentProps,
  textDefaultProps,
  imageDefaultProps,
} from "@almost-cli/lego-components";

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素，uuid
  currentComponentId: string;
  // 页面信息
  page: PageData;
}

export interface PageProps {
  backgroundColor: string;
  backgroundImage: string;
  backgroundRepeat: string;
  backgroundSize: string;
  height: string;
}

export type AllFormProps = PageProps & AllComponentProps;

export interface PageData {
  title: string;
  props: PageProps;
}
export interface ComponentData {
  // 这个元素的 属性，属性请详见下面
  props: AllComponentProps;
  // id，uuid v4 生成
  id: string;
  // 业务组件库名称 l-text，l-image 等等
  name: string;
  // 图层是否隐藏
  isHidden?: boolean;
  // 图层是否锁定
  isLocked?: boolean;
  // 图层名称
  layerName?: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "LText",
    layerName: "图层1",
    props: {
      ...textDefaultProps,
      text: "hello",
      fontSize: "20px",
      color: "#ffffff",
      lineHeight: "1",
      textAlign: "left",
      width: "100px",
      height: "100px",
      backgroundColor: "#efefef",
    },
  },
  // {
  //   id: uuidv4(),
  //   name: "l-text",
  //   layerName: "图层2",
  //   props: {
  //     ...textDefaultProps,
  //     text: "hello2",
  //     fontSize: "10px",
  //     fontWeight: "bold",
  //     lineHeight: "2",
  //     textAlign: "left",
  //     fontFamily: "",
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: "l-text",
  //   layerName: "图层3",
  //   props: {
  //     ...textDefaultProps,
  //     text: "hello3",
  //     fontSize: "15px",
  //     actionType: "url",
  //     url: "https://www.baidu.com",
  //     lineHeight: "3",
  //     textAlign: "left",
  //     fontFamily: "",
  //   },
  // },
  // {
  //   id: uuidv4(),
  //   name: "l-image",
  //   layerName: "图层4",
  //   props: {
  //     ...imageDefaultProps,
  //     src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //   },
  // },
];
const pageDefaultProps = {
  backgroundColor: "#ffffff",
  backgroundImage:
    'url("https://static.imooc-lego.com/upload-files/%E5%B9%BC%E5%84%BF%E5%9B%AD%E8%83%8C%E6%99%AF%E5%9B%BE-994372.jpg")',
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  height: "560px",
};
export interface UpdatePayload {
  key: string;
  value: string;
  id?: string;
  isRoot?: boolean;
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentComponentId: "",
    page: {
      title: "test title",
      props: pageDefaultProps,
    },
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component);
    },
    delComponent(state, id: string) {
      const index = state.components.findIndex((item) => item.id === id);
      state.components.splice(index, 1);
    },
    setActive(state, id: string) {
      state.currentComponentId = id;
    },
    updateComponent(state, { key, value, id, isRoot }: UpdatePayload) {
      const currentComponent = state.components.find(
        (component) => component.id === (id || state.currentComponentId)
      );
      if (currentComponent) {
        if (isRoot) {
          (currentComponent as any)[key] = value;
        } else {
          currentComponent.props[key as keyof AllComponentProps] = value;
        }
      }
    },
    updatePage(state, { key, value }: UpdatePayload) {
      state.page.props[key as keyof PageProps] = value;
    },
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find(
        (component) => component.id === state.currentComponentId
      );
    },
  },
};

export default editor;

import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
import {
  AllComponentProps,
  textDefaultProps,
  imageDefaultProps,
} from "@/defaultProps";
import { PropsKeys } from "@/propsMap";

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素，uuid
  currentComponentId: string;
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
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    layerName: "图层2",
    props: {
      ...textDefaultProps,
      text: "hello2",
      fontSize: "10px",
      fontWeight: "bold",
      lineHeight: "2",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "l-text",
    layerName: "图层3",
    props: {
      ...textDefaultProps,
      text: "hello3",
      fontSize: "15px",
      actionType: "url",
      url: "https://www.baidu.com",
      lineHeight: "3",
      textAlign: "left",
      fontFamily: "",
    },
  },
  {
    id: uuidv4(),
    name: "l-image",
    layerName: "图层4",
    props: {
      ...imageDefaultProps,
      src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  },
];

export interface UpdatePayload {
  key: PropsKeys;
  value: string;
  id?: string;
  isRoot?: boolean;
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentComponentId: "",
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      // const newComponent = {
      //   id: uuidv4(),
      //   name: "l-text",
      //   props,
      // };
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
          currentComponent.props[key] = value;
        }
      }
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

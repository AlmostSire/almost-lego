import { Module } from "vuex";
import { GlobalDataProps } from "./index";
import { v4 as uuidv4 } from "uuid";
import { AllComponentProps } from "@/defaultProps";

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素，uuid
  currentElement: string;
}
export interface ComponentData {
  // 这个元素的 属性，属性请详见下面
  props: AllComponentProps;
  // id，uuid v4 生成
  id: string;
  // 业务组件库名称 l-text，l-image 等等
  name: string;
}

export const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: "LText",
    props: {
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
    props: {
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
    props: {
      text: "hello3",
      fontSize: "15px",
      actionType: "url",
      url: "https://www.baidu.com",
      lineHeight: "3",
      textAlign: "left",
      fontFamily: "",
    },
  },
  // {
  //   id: uuidv4(),
  //   name: "l-image",
  //   props: {
  //     src: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
  //   },
  // },
];

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentElement: "",
  },
  mutations: {
    addComponent(state, props: AllComponentProps) {
      const newComponent = {
        id: uuidv4(),
        name: "l-text",
        props,
      };
      state.components.push(newComponent);
    },
    delComponent(state, id: string) {
      const index = state.components.findIndex((item) => item.id === id);
      state.components.splice(index, 1);
    },
  },
};

export default editor;

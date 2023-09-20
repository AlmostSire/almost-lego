import { Module, Mutation } from "vuex";
import store, { GlobalDataProps, actionCreate } from "./index";
import { v4 as uuidv4 } from "uuid";
import { message } from "ant-design-vue";
import { insertAt } from "@/helper";
import { RespWorkData } from "./respTypes";

import {
  AllComponentProps,
  textDefaultProps,
  imageDefaultProps,
} from "@almost-cli/lego-components";
import { cloneDeep } from "lodash-es";

type MoveDirection = "left" | "right" | "up" | "down";

interface HistoryProps {
  id: string;
  componentId: string;
  type: "add" | "delete" | "modify";
  data: any;
  index?: number;
}

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[];
  // 当前编辑的是哪个元素，uuid
  currentId: string;
  // 页面信息
  page: PageData;
  // 当前复制的组件
  copiedComponent?: ComponentData;
  // 当前操作的历史记录
  histories: HistoryProps[];
  // 当前历史记录的操作位置
  historyIndex: number;
  // 开始更新时的缓存值
  cachedOldValues: any;
  // 保存最多历史条目记录数
  maxHistoryNumber: number;
  // 数据是否修改
  isDirty: boolean;
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
  id?: string;
  desc?: string;
  coverImg?: string;
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
const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: "undo" | "redo"
) => {
  const { componentId, data } = history;
  const { key, oldValue, newValue } = data;
  const newKey = key as
    | keyof AllComponentProps
    | Array<keyof AllComponentProps>;
  const updatedComponent = state.components.find(
    (component) => component.id === componentId
  );
  if (updatedComponent) {
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] =
          type === "undo" ? oldValue[index] : newValue[index];
      });
    } else {
      updatedComponent.props[newKey] = type === "undo" ? oldValue : newValue;
    }
  }
};

const debounceChange = (callback: (...args: any) => void, timeout = 1000) => {
  let timer = 0;
  return (...args: any) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      callback(...args);
    }, timeout);
  };
};
const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  // check history index is already moved
  if (state.historyIndex !== -1) {
    // if moved, delete all the records greater than the index
    state.histories.splice(state.historyIndex);

    // move history index to unmoved
    state.historyIndex = -1;
  }
  // check length
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord);
  } else {
    // larger than max number
    // shift the first
    // push to last
    state.histories.shift();
    state.histories.push(historyRecord);
  }
};
const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentId,
    type: "modify",
    data: { oldValue: state.cachedOldValues, newValue: value, key },
  });
  state.cachedOldValues = null;
};
const pushHistoryDebounce = debounceChange(pushModifyHistory);
export interface UpdateComponentData {
  key: keyof AllComponentProps | Array<keyof AllComponentProps>;
  value: string | string[];
  id: string;
  isRoot?: boolean;
}

const setDirtyWrapper = (callback: Mutation<EditorProps>) => {
  return (state: EditorProps, payload: any) => {
    state.isDirty = true;
    callback(state, payload);
  };
};

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components: testComponents,
    currentId: "",
    page: {
      title: "test title",
      props: pageDefaultProps,
    },
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 5,
    isDirty: false,
  },
  mutations: {
    resetEditor(state) {
      state.components = [];
      state.currentId = "";
      state.histories = [];
      state.historyIndex = -1;
    },
    addComponent: setDirtyWrapper((state, component: ComponentData) => {
      component.layerName = "图层" + (state.components.length + 1);
      state.components.push(component);
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: "add",
        data: cloneDeep(component),
      });
    }),
    delComponent: setDirtyWrapper((state, id: string) => {
      const index = state.components.findIndex((item) => item.id === id);
      if (index !== -1) {
        const deleteComponents = state.components.splice(index, 1);
        message.success("删除当前图层成功", 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: id,
          type: "delete",
          data: deleteComponents[0],
          index,
        });
      }
    }),
    setActive(state, id: string) {
      state.currentId = id;
    },
    copyComponent(state) {
      const currentComponent = store.getters.getCurrentElement;
      if (currentComponent) {
        state.copiedComponent = currentComponent;
        message.success("已拷贝当前图层", 1);
      }
    },
    pasteCopiedComponent: setDirtyWrapper((state) => {
      if (state.copiedComponent) {
        const component = cloneDeep(state.copiedComponent);
        component.id = uuidv4();
        component.layerName = component.layerName + "副本";
        state.components.push(component);
        message.success("已粘贴当前图层", 1);
        pushHistory(state, {
          id: uuidv4(),
          componentId: component.id,
          type: "add",
          data: cloneDeep(component),
        });
      }
    }),
    updateComponent: setDirtyWrapper(
      (state, { key, value, id, isRoot }: UpdateComponentData) => {
        const currentComponent = state.components.find(
          (component) => component.id === (id || state.currentId)
        );
        if (currentComponent) {
          if (isRoot) {
            (currentComponent as any)[key as string] = value;
          } else {
            const oldValue = Array.isArray(key)
              ? key.map((k) => currentComponent.props[k])
              : currentComponent.props[key];
            if (!state.cachedOldValues) {
              state.cachedOldValues = oldValue;
            }
            pushHistoryDebounce(state, { key, value, id });

            if (Array.isArray(key) && Array.isArray(value)) {
              key.forEach((keyName, index) => {
                currentComponent.props[keyName] = value[index];
              });
            } else if (typeof key === "string" && typeof value === "string") {
              currentComponent.props[key] = value;
            }
          }
        }
      }
    ),
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const { direction, amount, id } = data;
      const currentComponent = state.components.find(
        (component) => component.id === id
      );
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || "0");
        const oldLeft = parseInt(currentComponent.props.left || "0");
        switch (direction) {
          case "up": {
            const newValue = oldTop - amount + "px";
            store.commit("updateComponent", {
              key: "top",
              value: newValue,
              id,
            });
            break;
          }
          case "down": {
            const newValue = oldTop + amount + "px";
            store.commit("updateComponent", {
              key: "top",
              value: newValue,
              id,
            });
            break;
          }
          case "left": {
            const newValue = oldLeft - amount + "px";
            store.commit("updateComponent", {
              key: "left",
              value: newValue,
              id,
            });
            break;
          }
          case "right": {
            const newValue = oldLeft + amount + "px";
            store.commit("updateComponent", {
              key: "left",
              value: newValue,
              id,
            });
            break;
          }
        }
      }
    },
    updatePage: setDirtyWrapper((state, { key, value, isRoot }) => {
      if (isRoot) {
        state.page[key as keyof PageData] = value;
      } else {
        state.page.props[key as keyof PageProps] = value;
      }
    }),
    undo(state) {
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1;
      } else {
        state.historyIndex--;
      }
      const history = state.histories[state.historyIndex];
      switch (history.type) {
        case "add": {
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        }
        case "delete": {
          state.components = insertAt(
            state.components,
            history.index as number,
            history.data
          );
          break;
        }
        case "modify": {
          modifyHistory(state, history, "undo");
          break;
        }
      }
    },
    redo(state) {
      const history = state.histories[state.historyIndex++];
      switch (history.type) {
        case "add": {
          state.components.push(history.data);
          break;
        }
        case "delete": {
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          );
          break;
        }
        case "modify": {
          modifyHistory(state, history, "redo");
          break;
        }
      }
    },
    fetchWork(state, { data }: RespWorkData) {
      const { content, ...rest } = data;
      state.page = { ...state.page, ...rest };
      if (content.props) {
        state.page.props = content.props;
      }
      state.components = content.components;
    },
    saveWork(state) {
      state.isDirty = false;
    },
  },
  getters: {
    getCurrentElement: (state) => {
      return state.components.find(
        (component) => component.id === state.currentId
      );
    },
    getComponentsLength: (state) => state.components.length,
    checkUndoDisable: (state) => {
      // 1 no history item
      // 2 move to the first item
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true;
      }
      return false;
    },
    checkRedoDisable: (state) => {
      // 1 no history item
      // 2 move to the lasth item
      // 3 never undo before
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true;
      }
      return false;
    },
  },
  actions: {
    fetchWork: actionCreate("/works/:id", "fetchWork"),
    saveWork: actionCreate("/works/:id", "saveWork", { method: "patch" }),
  },
};

export default editor;

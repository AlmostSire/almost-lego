import store from "@/store";
import { testData } from "@/store/templates";
import { testComponents, ComponentData } from "@/store/editor";
import { v4 as uuidv4 } from "uuid";
import { clone, last } from "lodash-es";
import { textDefaultProps } from "@almost-cli/lego-components";

const cloneComponents = clone(testComponents);
jest.mock("ant-design-vue");

describe("test vuex store", () => {
  it("should have three modules", () => {
    expect(store.state).toHaveProperty("user");
    expect(store.state).toHaveProperty("templates");
    expect(store.state).toHaveProperty("editor");
  });

  describe("test user module", () => {
    it("test login mutation", () => {
      store.commit("login");
      expect(store.state.user.isLogin).toBeTruthy();
    });

    it("test logout mutation", () => {
      store.commit("logout");
      expect(store.state.user.isLogin).toBeFalsy();
    });
  });

  describe("test template module", () => {
    it("should have defalult templates", () => {
      expect(store.state.templates.data).toHaveLength(testData.length);
    });

    it("should get the corret template by Id", () => {
      const selectTemplate = store.getters.getTemplateById(1);
      expect(selectTemplate.title).toBe("前端架构师直播海报");
    });
  });

  describe.only("test editor module", () => {
    it("should have default components", () => {
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length
      );
    });
    it("should get current component when set active one component", () => {
      store.commit("setActive", cloneComponents[0].id);
      expect(store.state.editor.currentComponentId).toBe(cloneComponents[0].id);
      const currentElement = store.getters.getCurrentElement();
      expect(currentElement.id).toBe(cloneComponents[0].id);
    });
    it("add component should works fine", () => {
      const payload: ComponentData = {
        name: "l-text",
        id: uuidv4(),
        props: {
          ...textDefaultProps,
          text: "text1",
        },
      };

      store.commit("addComponent", payload);
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 1
      );
      const lastItem = last(store.state.editor.components);
      if (lastItem) {
        expect(lastItem.props.text).toBe("text1");
        expect(lastItem.layerName).toBe("图层2");
      }
    });
    it("copy & paste component should works fine", () => {
      store.commit("copyComponent");
      expect(store.state.editor.copiedComponent).toBeDefined();
      store.commit("pasteCopiedComponent");
      expect(store.state.editor.components).toHaveLength(
        cloneComponents.length + 2
      );
      const lastItem = last(store.state.editor.components);
      if (lastItem) {
        expect(lastItem.props).toEqual(cloneComponents[0].props);
      }
    });
    it("move component should works fine", () => {
      const currentComponent =
        store.getters.getCurrentElement() as ComponentData;
      const oldValue = parseInt(currentComponent.props.left || "0");
      store.commit("moveComponent", {
        direction: "left",
        amount: 5,
        id: currentComponent.id,
      });
      expect(currentComponent.props.left).toBe(oldValue - 5 + "px");
      store.commit("moveComponent", {
        direction: "right",
        amount: 3,
        id: currentComponent.id,
      });
      expect(currentComponent.props.left).toBe(oldValue - 5 + 3 + "px");
    });
    it("update component should works fine", () => {
      const newProps = {
        key: "text",
        value: "update",
      };
      store.commit("updateComponent", newProps);
      const currentElement: ComponentData = store.getters.getCurrentElement();
      expect(currentElement.props.text).toBe("update");

      const newProps2 = {
        key: "layerName",
        value: "new layer",
        isRoot: true,
      };
      store.commit("updateComponent", newProps2);
      expect(currentElement.layerName).toBe("new layer");
    });
  });
});

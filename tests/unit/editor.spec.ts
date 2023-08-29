import store from "@/store";
import { testComponents, ComponentData } from "@/store/editor";
import { v4 as uuidv4 } from "uuid";
import { clone, last } from "lodash-es";
import { textDefaultProps } from "@almost-cli/lego-components";

const cloneComponents = clone(testComponents);
jest.mock("ant-design-vue");

const getLengthAndAssert = (length: number) => {
  expect(store.state.editor.components.length).toBe(length);
};
const getLastAndAssert = (id: string) => {
  const lastItem = last(store.state.editor.components);
  expect(lastItem?.id).toBe(id);
};
const getCurrentAndAssert = (text: string) => {
  const currentElement: ComponentData = store.getters.getCurrentElement;
  expect(currentElement.props.text).toBe(text);
};

describe("test editor module", () => {
  it("should have default components", () => {
    expect(store.state.editor.components).toHaveLength(cloneComponents.length);
  });
  it("should get current component when set active one component", () => {
    store.commit("setActive", cloneComponents[0].id);
    expect(store.state.editor.currentId).toBe(cloneComponents[0].id);
    const currentElement = store.getters.getCurrentElement;
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
    const currentComponent = store.getters.getCurrentElement as ComponentData;
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
    const currentElement: ComponentData = store.getters.getCurrentElement;
    expect(currentElement.props.text).toBe("update");

    const newProps2 = {
      key: "layerName",
      value: "new layer",
      isRoot: true,
    };
    store.commit("updateComponent", newProps2);
    expect(currentElement.layerName).toBe("new layer");
  });
  it("undo should works fine", () => {
    store.commit("resetEditor");
    const payload: ComponentData = {
      name: "l-text",
      id: "1234",
      props: {
        ...textDefaultProps,
        text: "text1",
      },
    };
    store.commit("addComponent", payload);

    const payload2: ComponentData = {
      name: "l-text",
      id: "2345",
      props: {
        ...textDefaultProps,
        text: "text2",
      },
    };
    store.commit("addComponent", payload2);

    store.commit("delComponent", "2345");

    store.commit("updateComponent", {
      id: "1234",
      key: "text",
      value: "update",
    });

    store.commit("setActive", "1234");
    getCurrentAndAssert("update");

    // undo step 1, text should be back to text1
    store.commit("undo");
    getCurrentAndAssert("text1");
    // undo step 2, delete component should be back at the right postion
    getLengthAndAssert(1);
    store.commit("undo");
    getLengthAndAssert(2);
    getLastAndAssert("2345");
    // undo step 3, the 2nd component should be delete
    store.commit("undo");
    getLengthAndAssert(1);
    getLastAndAssert("1234");

    store.commit("undo");
    getLengthAndAssert(0);

    store.commit("redo");
    getLengthAndAssert(1);
    getLastAndAssert("1234");

    store.commit("redo");
    getLengthAndAssert(2);
    getLastAndAssert("2345");

    store.commit("redo");
    getLengthAndAssert(1);
    getLastAndAssert("1234");

    store.commit("redo");
    getCurrentAndAssert("update");
  });
});

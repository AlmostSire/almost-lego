import { useStore } from "vuex";
import { useHotKey } from "@/hooks/useHotKey";
import { GlobalDataProps } from "@/store";
import { computed } from "vue";
import { KeyHandler } from "hotkeys-js";

const wrap = (callback: KeyHandler) => {
  const wrapperFn = (...args: Parameters<KeyHandler>) => {
    args[0].preventDefault();
    callback(...args);
  };
  return wrapperFn;
};

export default function initHotKeys() {
  const store = useStore<GlobalDataProps>();
  const currentId = computed(() => store.state.editor.currentComponentId);
  useHotKey("ctrl+c, command+c", () => {
    store.commit("copyComponent", currentId.value);
  });
  useHotKey("ctrl+v, command+v", () => {
    store.commit("pasteCopiedComponent");
  });
  useHotKey("backspace, delete", () => {
    store.commit("delComponent", currentId.value);
  });
  useHotKey("esc", () => {
    store.commit("setActive", "");
  });
  useHotKey(
    "up",
    wrap(() => {
      store.commit("moveComponent", {
        direction: "up",
        amount: 1,
        id: currentId.value,
      });
    })
  );
  useHotKey(
    "down",
    wrap(() => {
      store.commit("moveComponent", {
        direction: "down",
        amount: 1,
        id: currentId.value,
      });
    })
  );
  useHotKey(
    "left",
    wrap(() => {
      store.commit("moveComponent", {
        direction: "left",
        amount: 1,
        id: currentId.value,
      });
    })
  );
  useHotKey(
    "right",
    wrap(() => {
      store.commit("moveComponent", {
        direction: "right",
        amount: 1,
        id: currentId.value,
      });
    })
  );
}

import createContextMenu, { ActionItem } from "@/components/createContextMenu";
import { onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";

const initContextMenu = () => {
  const store = useStore();
  const testActions: ActionItem[] = [
    {
      shortcut: "Backspace / Delete",
      text: "删除图层",
      action: (id) => {
        store.commit("delComponent", id);
      },
    },
  ];
  // const testActions2: ActionItem[] = [
  //   {
  //     shortcut: "Ctrl+C",
  //     text: "复制配置",
  //     action: (id) => {
  //       store.commit("delComponent", id);
  //     },
  //   },
  // ];
  let destroy: () => void;
  onMounted(() => {
    destroy = createContextMenu(testActions);
    //createContextMenu(testActions2, "settings-panel");
  });
  onUnmounted(() => {
    destroy();
  });
};

export default initContextMenu;

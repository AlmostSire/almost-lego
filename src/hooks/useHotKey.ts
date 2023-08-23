import hotkeys from "hotkeys-js";
import { onMounted, onUnmounted } from "vue";
import type { KeyHandler } from "hotkeys-js";

export const useHotKey = (keys: string, callback: KeyHandler) => {
  onMounted(() => {
    hotkeys(keys, callback);
  });
  onUnmounted(() => {
    hotkeys.unbind(keys, callback);
  });
};

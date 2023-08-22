<template>
  <div
    class="edit-wrapper"
    :class="{ active: active }"
    :style="styles"
    ref="editWrapper"
    @mousedown="startMove"
    @click="hancleClick(id)"
  >
    <slot></slot>
    <div class="resizers">
      <div
        class="resizer top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
    </div>
    <!-- <div class="mask" @click="hancleClick(id)"></div>
    <div class="delete-btn">
      <slot name="btn"> x </slot>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { AllComponentProps } from "@almost-cli/lego-components";
import { pick } from "lodash-es";
import { computed, nextTick, ref } from "vue";

export interface EditWrapperProps {
  id: string;
  active?: boolean;
  props?: AllComponentProps;
}
type ResizeDirection =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";
type OriginalPositions = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};
const editWrapper = ref<HTMLDivElement | null>(null);
const props = defineProps<EditWrapperProps>();
const styles = computed(() =>
  pick(props.props, ["position", "left", "top", "width", "height"])
);

const emit = defineEmits(["setActive", "updatePosition"]);

const hancleClick = (id: string) => {
  emit("setActive", id);
};

const gap = {
  x: 0,
  y: 0,
};
let isMoving = false;
let isResizing = false;
const caculateMovePosition = (e: MouseEvent) => {
  const container = document.getElementById("canvas-area") as HTMLElement;
  const left = e.clientX - gap.x - container.offsetLeft;
  const top = e.clientY - gap.y - container.offsetTop + container.scrollTop;
  return {
    left,
    top,
  };
};

const caculateSize = (
  direction: ResizeDirection,
  e: MouseEvent,
  position: OriginalPositions
) => {
  const { clientX, clientY } = e;
  const { left, right, top, bottom } = position;
  const container = document.getElementById("canvas-area") as HTMLElement;
  const rightWidth = clientX - left;
  const leftWidth = right - clientX;
  const bottomHeight = clientY - top;
  const topHeight = bottom - clientY;
  const topOffset = clientY - container.offsetTop + container.scrollTop;
  const leftOffset = clientX - container.offsetLeft;
  switch (direction) {
    case "top-left":
      return {
        width: leftWidth,
        height: topHeight,
        left: leftOffset,
        top: topOffset,
      };
    case "top-right":
      return {
        width: rightWidth,
        height: topHeight,
        top: topOffset,
      };
    case "bottom-left":
      return {
        width: leftWidth,
        height: bottomHeight,
        left: leftOffset,
      };
    case "bottom-right":
      return {
        width: rightWidth,
        height: bottomHeight,
      };
  }
};

const startResize = (direction: ResizeDirection) => {
  const currentElement = editWrapper.value as HTMLDivElement;
  const { left, right, top, bottom } = currentElement.getBoundingClientRect();
  console.log(left, right, top, bottom);
  const handleMove = (e: MouseEvent) => {
    isResizing = true;
    const size = caculateSize(direction, e, { left, right, top, bottom });
    console.log(size, "size");
    const { style } = currentElement;
    style.width = size.width + "px";
    style.height = size.height + "px";
    if (size.left) {
      style.left = size.left + "px";
    }
    if (size.top) {
      style.top = size.top + "px";
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", handleMove);
    if (isResizing) {
      const size = caculateSize(direction, e, { left, right, top, bottom });
      emit("updatePosition", { ...size, id: props.id });
      isResizing = false;
    }

    nextTick(() => {
      document.removeEventListener("mouseup", handleMouseUp);
    });
  };

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleMouseUp);
};

const startMove = (e: MouseEvent) => {
  const currentElement = editWrapper.value;
  if (currentElement) {
    const { left, top } = currentElement.getBoundingClientRect();
    gap.x = e.clientX - left;
    gap.y = e.clientY - top;
  }
  const handleMove = (e: MouseEvent) => {
    isMoving = true;
    const { left, top } = caculateMovePosition(e);
    if (currentElement) {
      currentElement.style.top = top + "px";
      currentElement.style.left = left + "px";
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    document.removeEventListener("mousemove", handleMove);
    if (isMoving) {
      const { left, top } = caculateMovePosition(e);
      emit("updatePosition", { left, top, id: props.id });
      isMoving = false;
    }
    nextTick(() => {
      document.removeEventListener("mouseup", handleMouseUp);
    });
  };
  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleMouseUp);
};
</script>

<style>
.edit-wrapper {
  position: relative;
  box-sizing: content-box;
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.hidden {
  display: none;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .delete-btn {
  position: absolute;
  right: 0;
  top: 0;
  font-size: 10px;
}
.edit-wrapper > * {
  width: 100% !important;
  height: 100% !important;
  position: static !important;
}
.edit-wrapper .mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.edit-wrapper .resizers {
  display: none;
}
.edit-wrapper.active .resizers {
  display: block;
}
/* .edit-wrapper.active .resizers .resizer {

} */
.edit-wrapper .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  border: 3px solid #1890ff;
}

.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}

.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}

.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>

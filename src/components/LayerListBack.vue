<template>
  <ul
    :list="list"
    class="ant-list-items ant-list-bordered"
    @drop="onDrop"
    @dragover="onDragOver"
  >
    <li
      class="ant-list-item"
      :class="{
        active: item.id === selectedId,
        ghost: dragData.currentDragging === item.id,
      }"
      v-for="(item, index) in list"
      :key="item.id"
      @click="handleClick(item.id)"
      draggable="true"
      @dragstart="onDragStart($event, item.id, index)"
      @dragenter="onDragEnter($event, index)"
      :data-index="index"
    >
      <a-tooltip :title="item.isHidden ? '显示' : '隐藏'">
        <a-button
          shape="circle"
          @click.stop="handleChange(item.id, 'isHidden', !item.isHidden)"
        >
          <template v-slot:icon>
            <EyeOutlined v-if="item.isHidden" />
            <EyeInvisibleOutlined v-else />
          </template>
        </a-button>
      </a-tooltip>
      <a-tooltip :title="item.isLocked ? '解锁' : '锁定'">
        <a-button
          shape="circle"
          @click.stop="handleChange(item.id, 'isLocked', !item.isLocked)"
        >
          <template v-slot:icon>
            <UnlockOutlined v-if="item.isLocked" />
            <LockOutlined v-else />
          </template>
        </a-button>
      </a-tooltip>
      <InlineEdit
        :value="item.layerName"
        @change="
          (value) => {
            handleChange(item.id, 'layerName', value);
          }
        "
      />
    </li>
  </ul>
</template>
<script lang="ts" setup>
import {
  EyeOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
} from "@ant-design/icons-vue";
import { ComponentData } from "../store/editor";
import InlineEdit from "./InlineEdit.vue";
import { reactive } from "vue";
// import { getParentElement } from "@/helper";
import { arrayMoveMutable } from "array-move";

const props = defineProps<{ list: ComponentData[]; selectedId: string }>();
const dragData = reactive({
  currentDragging: "",
  currentIndex: -1,
});
let start = -1;
let end = -1;
const emit = defineEmits(["select", "change", "drop"]);
const handleClick = (id: string) => {
  emit("select", id);
};
const handleChange = (id: string, key: string, value: boolean) => {
  const data = {
    id,
    key,
    value,
    isRoot: true,
  };
  emit("change", data);
};
const onDragStart = (e: DragEvent, id: string, index: number) => {
  dragData.currentDragging = id;
  dragData.currentIndex = index;
  start = index;
};
const onDragEnter = (e: DragEvent, index: number) => {
  if (index !== dragData.currentIndex) {
    console.log("enter", index, dragData.currentIndex);
    arrayMoveMutable(props.list, dragData.currentIndex, index);
    dragData.currentIndex = index;
    end = index;
  }
};
const onDrop = (e: DragEvent) => {
  // const currentEle = getParentElement(
  //   e.target as HTMLDivElement,
  //   "ant-list-item"
  // );
  // if (currentEle && currentEle.dataset.index) {
  //   const moveIndex = parseInt(currentEle.dataset.index);
  //   console.log(moveIndex, "moveIndex");
  //   arrayMoveMutable(props.list, dragData.currentIndex, moveIndex);
  // }
  emit("drop", { start, end });
  dragData.currentDragging = "";
};
const onDragOver = (e: DragEvent) => {
  e.preventDefault();
};
</script>

<style scoped>
.ant-list-item {
  padding: 10px 15px;
  transition: all 0.5s ease-out;
  cursor: pointer;
  justify-content: normal;
  display: flex;
  border: 1px solid #fff;
  border-bottom-color: #f0f0f0;
  line-height: 32px;
}
.ant-list-item.active {
  border: 1px solid #1890ff;
}
.ant-list-item.ghost {
  opacity: 0.5;
}
.ant-list-item:hover {
  background: #e6f7ff;
}
.ant-list-item > * {
  margin-right: 10px;
}
.ant-list-item button {
  font-size: 12px;
}
</style>

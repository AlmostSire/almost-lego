<template>
  <draggable
    :list="list"
    class="ant-list-items ant-list-bordered"
    ghost-class="ghost"
    handle=".handle"
  >
    <template #item="{ element: item }">
      <li
        class="ant-list-item"
        :class="{ active: item.id === selectedId }"
        :key="item.id"
        @click="handleClick(item.id)"
        draggable="true"
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
          class="edit-area"
          @change="
            (value) => {
              handleChange(item.id, 'layerName', value);
            }
          "
        />
        <a-tooltip title="拖拽排序">
          <a-button shape="circle" class="handle">
            <template #icon>
              <DragOutlined />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </template>
  </draggable>
</template>
<script lang="ts" setup>
import {
  EyeOutlined,
  UnlockOutlined,
  EyeInvisibleOutlined,
  LockOutlined,
  DragOutlined,
} from "@ant-design/icons-vue";
import { ComponentData } from "../store/editor";
import InlineEdit from "./InlineEdit.vue";
import draggable from "vuedraggable";

defineProps<{ list: ComponentData[]; selectedId: string }>();
const emit = defineEmits(["select", "change"]);
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
.ant-list-item .edit-area {
  flex: 1;
}
.ant-list-item .handle {
  cursor: move;
}
</style>

<template>
  <div class="edit-wrapper" :class="{ active: active }">
    <slot></slot>
    <div class="mask" @click="hancleClick(id)"></div>
    <div class="delete-btn">
      <slot name="btn"> x </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EditWrapperProps {
  id: string;
  active?: boolean;
}

defineProps<EditWrapperProps>();

const emit = defineEmits(["setActive"]);

const hancleClick = (id: string) => {
  emit("setActive", id);
};
</script>

<style>
.edit-wrapper {
  position: relative;
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
.edit-wrapper .mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>

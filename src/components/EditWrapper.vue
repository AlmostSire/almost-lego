<template>
  <div class="edit-wrapper" :class="{ active: active }">
    <slot></slot>
    <div class="mask" @click="onItemClick(id)"></div>
    <div class="delete-btn">
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface EditWrapperProps {
  id: string
  active?: boolean
}

withDefaults(defineProps<EditWrapperProps>(), {
  active: false
})

const emit = defineEmits(['onItemClick'])

const onItemClick = (id: string) => {
  emit('onItemClick', id)
}
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

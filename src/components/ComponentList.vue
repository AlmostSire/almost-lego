<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <LText v-bind="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { AllComponentProps } from "@/defaultProps";
import LText from "@/components/LText.vue";

defineProps<{
  list: AllComponentProps[];
}>();

const emit = defineEmits(["onItemClick"]);

const onItemClick = (data: AllComponentProps) => {
  emit("onItemClick", data);
};
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
</style>

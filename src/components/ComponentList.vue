<template>
  <div class="create-component-list">
    <div v-for="(item, index) in list" :key="index" @click="onItemClick(item)">
      <LText v-bind="item"></LText>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AllComponentProps } from '@/defaultProps'
import LText from '@/components/LText.vue'

defineProps<{
  list: AllComponentProps[]
}>()

const emit = defineEmits(['onItemClick'])

const onItemClick = (data: any) => {
  emit('onItemClick', data)
}
</script>

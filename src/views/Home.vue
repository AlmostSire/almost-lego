<template>
  <div class="home-container">
    <template-list :list="templates"></template-list>
  </div>
</template>

<script setup lang="ts">
import TemplateList from '../components/TemplateList.vue'
import { useGlobalStore } from '@/stores'

const {
  template: { templates }
} = useGlobalStore()
</script>

<style>
.home-container {
  padding: 50px 24px;
  min-height: 85vh;
  max-width: 1200px;
}
</style>

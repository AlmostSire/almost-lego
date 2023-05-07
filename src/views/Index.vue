<template>
  <a-layout class="index-container">
    <a-layout-header class="header">
      <div class="page-title">
        <router-link to="/">慕课乐高</router-link>
      </div>
      <user-profile :user="user" />
    </a-layout-header>
    <a-layout-content class="content">
      <router-view></router-view>
    </a-layout-content>
    <a-layout-footer class="footer">
      © 慕课网（imooc.com）版权所有 | 津ICP备20000929号-2
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import UserProfile from '@/components/UserProfile.vue'
import { useGlobalStore } from '@/stores'

const { user } = useGlobalStore()
</script>

<style scoped>
.index-container {
  min-height: 100vh;
}
.index-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.index-container .content {
  background-color: #fff;
}
</style>

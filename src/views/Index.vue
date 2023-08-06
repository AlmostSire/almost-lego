<template>
  <div class="homepage-container">
    <a-layout :style="{ background: '#fff' }">
      <a-layout-header class="header">
        <div class="page-title">
          <RouterLink to="/">慕课乐高</RouterLink>
        </div>
        <UserProfile :user="user" />
      </a-layout-header>
      <a-layout-content class="home-layout">
        <RouterView></RouterView>
      </a-layout-content>
      <a-layout-footer>
        © 慕课网（imooc.com）版权所有 | 津ICP备20000929号-2
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import UserProfile from "../components/UserProfile.vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";

const store = useStore<GlobalDataProps>();
const user = computed(() => store.state.user);
</script>
<style>
.file-upload .upload-area {
  background-color: #efefef;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  padding: 20px;
  width: 360px;
  height: 180px;
  text-align: center;
  &:hover {
    border: 1px dashed #1890ff;
  }
  &.is-dragover {
    border: 2px dashed #1890ff;
    background-color: rgba(#1890ff, 0.2);
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>

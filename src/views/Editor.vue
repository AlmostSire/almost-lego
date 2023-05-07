<template>
  <a-layout class="editor-container">
    <a-layout-header>
      <div class="page-title">
        <router-link to="/">慕课乐高</router-link>
      </div>
    </a-layout-header>

    <a-layout>
      <a-layout-sider width="300" style="background: yellow">
        <div class="sidebar-container">组件列表</div>
      </a-layout-sider>

      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area"></div>
      </a-layout-content>

      <a-layout-sider width="300" style="background: purple" class="settings-panel">
        组件属性
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts"></script>

<style scoped>
.editor-container {
  min-height: 100vh;
}
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
</style>

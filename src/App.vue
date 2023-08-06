<template>
  <div class="app-container">
    <Uploader
      drag
      action="http://localhost:7001/api/utils/upload-img"
      :auto-upload="false"
      list-type="picture"
    >
      <h4>上传图片</h4>
      <template #loading>
        <h4>上传中</h4>
      </template>
      <template #uploaded="{ uploadedData }">
        <img :src="uploadedData.data[0]" />
        <h3>点击重新上传</h3>
      </template>
    </Uploader>
    <RouterView></RouterView>
  </div>
</template>
<script setup lang="ts">
import Uploader from "./components/Uploader.vue";
</script>
<style lang="less">
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
.upload-area img {
  height: 100px;
}
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>

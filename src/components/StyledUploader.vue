<template>
  <uploader
    class="styled-uploader"
    action="/utils/upload"
    :show-upload-list="false"
    :before-upload="commonUploadCheck"
    @success="
      (data) => {
        handleUploadSuccess(data.resp, data.file.raw);
      }
    "
  >
    <div class="uploader-container">
      <FileImageOutlined />
      <h4>{{ text }}</h4>
    </div>
    <template #loading>
      <div class="uploader-container">
        <LoadingOutlined spin />
        <h4>上传中</h4>
      </div>
    </template>
    <template #uploaded="{ uploadedData }">
      <div class="uploader-container">
        <img v-if="showUploaded" :src="uploadedData.data.urls[0]" />
        <template v-else>
          <FileImageOutlined />
          <h4>{{ text }}</h4>
        </template>
      </div>
    </template>
  </uploader>
</template>

<script lang="ts" setup>
import { FileImageOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { commonUploadCheck } from "../helper";
import Uploader from "./Uploader.vue";

withDefaults(
  defineProps<{
    text?: string;
    showUploaded?: boolean;
  }>(),
  {
    text: "上传图片",
    showUploaded: false,
  }
);

const emit = defineEmits(["success"]);

const handleUploadSuccess = (resp: any, file: File) => {
  emit("success", { resp, file });
};
</script>

<style lang="less">
.styled-uploader {
  .uploader-container {
    width: 100px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .uploader-container:hover {
    background: #40a9ff;
  }
  .uploader-container h4 {
    color: #ffffff;
    margin: 0;
    margin-left: 10px;
  }
  .uploader-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

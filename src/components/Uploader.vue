<template>
  <div class="file-upload">
    <button @click="triggerUpload">
      <span v-if="fileStatus === 'loading'">正在上传</span>
      <span v-else-if="fileStatus === 'success'">上传成功</span>
      <span v-else-if="fileStatus === 'error'">上传失败</span>
      <span v-else>点击上传</span>
    </button>
    <input
      type="file"
      :style="{ display: 'none' }"
      ref="fileInput"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref } from "vue";
type UploadStatus = "ready" | "loading" | "success" | "error";
const props = defineProps<{
  action: string;
}>();

const fileInput = ref<null | HTMLInputElement>(null);
const fileStatus = ref<UploadStatus>("ready");

const triggerUpload = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleFileChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files) {
    const uploadedFile = files[0];
    const formData = new FormData();
    formData.append(uploadedFile.name, uploadedFile);
    fileStatus.value = "loading";
    try {
      const resp = await axios.post(props.action, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(resp);
      fileStatus.value = "success";
    } catch (e) {
      fileStatus.value = "error";
    }
  }
};
</script>

<template>
  <div class="background-processer">
    <styled-uploader v-if="!value" @success="onImageUploaded" />
    <image-processer
      v-else
      :value="value"
      :show-delete="true"
      @change="handleUploadUrl"
    />
  </div>
</template>
<script setup lang="ts">
import { UploadResp } from "@/extraType";
import ImageProcesser from "./ImageProcesser.vue";
import StyledUploader from "./StyledUploader.vue";
import { message } from "ant-design-vue";
defineProps<{ value: string }>();
const emit = defineEmits(["change"]);
const onImageUploaded = async (data: { resp: UploadResp; file: File }) => {
  emit("change", data.resp.data[0]);
  message.success("上传成功");
};
const handleUploadUrl = (url: string) => {
  emit("change", url);
};
</script>

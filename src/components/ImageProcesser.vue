<template>
  <div class="image-processer">
    <div class="image-preview" :style="{ backgroundImage: backgrondUrl }"></div>
    <div class="image-process">
      <styled-uploader @success="handleFileUploaded"></styled-uploader>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadResp } from "@/extraType";
import StyledUploader from "./StyledUploader.vue";
import { computed } from "vue";

const props = defineProps<{ value: string }>();

const backgrondUrl = computed(() => `url(${props.value})`);

const emit = defineEmits(["change"]);

const handleFileUploaded = ({ resp }: { resp: UploadResp }) => {
  emit("change", resp.data[0]);
};
</script>

<style lang="less">
.image-processer {
  display: flex;
  justify-content: space-between;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
}
</style>

<template>
  <div class="image-processer">
    <a-modal
      title="裁剪图片"
      v-model:open="showModal"
      @ok="handleOk"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img :src="baseImageUrl" ref="cropperImage" id="processed-image" />
      </div>
    </a-modal>
    <div class="image-preview" :style="{ backgroundImage: backgrondUrl }"></div>
    <div class="image-process">
      <styled-uploader @success="handleFileUploaded"></styled-uploader>
      <a-button @click="showModal = true">
        <template v-slot:icon><ScissorOutlined /></template>
        裁剪图片
      </a-button>
      <a-button v-if="showDelete" @click="handleDelete">
        <template v-slot:icon>
          <DeleteOutlined />
        </template>
        删除图片
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadResp } from "@/extraType";
import StyledUploader from "./StyledUploader.vue";
import { computed, ref, watch, nextTick } from "vue";
import { message } from "ant-design-vue";
import { ScissorOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import Cropper from "cropperjs";
// import axios from "axios";

interface CropperData {
  x: number;
  y: number;
  width: number;
  height: number;
}

const cropperImage = ref<HTMLImageElement>();

const showModal = ref(false);
let cropper: Cropper;
let cropperData: CropperData | null;
watch(showModal, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (cropperImage.value) {
      cropper = new Cropper(cropperImage.value, {
        checkOrientation: true,
        crop(event) {
          const { x, y, width, height } = event.detail;
          cropperData = {
            x: Math.floor(x),
            y: Math.floor(y),
            width: Math.floor(width),
            height: Math.floor(height),
          };
        },
      });
    }
  } else {
    if (cropper) {
      cropper.destroy();
    }
  }
});

const props = defineProps<{ value: string; showDelete?: boolean }>();

const backgrondUrl = computed(() => `url(${props.value})`);
const baseImageUrl = computed(() => props.value.split("?")[0]);

const emit = defineEmits(["change"]);

const handleFileUploaded = ({ resp }: { resp: UploadResp }) => {
  message.success("上传成功");
  emit("change", resp.data[0]);
};

const handleDelete = () => {
  emit("change", "");
};

const handleOk = () => {
  if (cropperData) {
    const { x, y, width, height } = cropperData;
    let cropperURL = baseImageUrl.value;
    cropperURL += `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`;
    emit("change", cropperURL);
    // 不使用阿里云，拿到截图再次上传
    // cropper.getCroppedCanvas().toBlob((blob) => {
    //   if (blob) {
    //     const formData = new FormData();
    //     formData.append("croppedImage", blob, "test.png");
    //     axios
    //       .post("http://localhost:7001/api/utils/upload-img", formData, {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       })
    //       .then((resp) => {
    //         if (resp.data.errno === 0) {
    //           emit("change", resp.data.data[0]);
    //         }
    //       });
    //   }
    // });
  }
  showModal.value = false;
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
#processed-image {
  display: block;
  max-width: 100%;
}
</style>

<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <LText v-bind="item" />
    </div>
    <StyledUploader @success="onImageUploaded" />
  </div>
</template>

<script setup lang="ts">
import { AllComponentProps, imageDefaultProps } from "@/defaultProps";
import LText from "@/components/LText.vue";
import StyledUploader from "./StyledUploader.vue";
import { UploadResp } from "@/extraType";
import { ComponentData } from "@/store/editor";
import { v4 as uuidv4 } from "uuid";
import { message } from "ant-design-vue";
import { getImgDemensions } from "@/helper";

defineProps<{
  list: AllComponentProps[];
}>();

const emit = defineEmits(["onItemClick"]);

const onItemClick = (props: AllComponentProps) => {
  const component: ComponentData = {
    name: "l-text",
    id: uuidv4(),
    props,
  };
  emit("onItemClick", component);
};

const onImageUploaded = async (data: { resp: UploadResp; file: File }) => {
  const component: ComponentData = {
    id: uuidv4(),
    name: "l-image",
    props: {
      ...imageDefaultProps,
    },
  };
  message.success("上传成功");
  //componentData.props.src = resp.data.urls[0]
  component.props.src = data.resp.data[0];

  const { width } = await getImgDemensions(data.file);
  const maxWidth = 373;
  component.props.width = (width > maxWidth ? maxWidth : width) + "px";
  emit("onItemClick", component);
};
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
</style>

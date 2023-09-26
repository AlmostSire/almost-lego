<template>
  <div class="preview-form">
    <div class="final-preview" v-if="open">
      <div class="final-preview-inner">
        <div class="preview-title">
          {{ pageState.title }}
        </div>
        <div class="iframe-container">
          <iframe
            :src="previewUrl"
            width="375"
            :height="pageState?.props?.height ? pageState.props.height : '560'"
            frameborder="0"
            class="iframe-placeholder"
          />
        </div>
      </div>
    </div>
    <a-drawer
      title="设置面板"
      placement="right"
      width="400"
      v-model:open="open"
      @close="onCancel"
      destroyOnClose
    >
      <div class="publish-form-container">
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6"> 扫码预览： </a-col>
          <a-col :span="10">
            <a-qrcode :value="previewUrl" :size="100" />
          </a-col>
        </a-row>
        <a-row type="flex" align="middle" :style="{ marginBottom: '20px' }">
          <a-col :span="6"> 上传封面： </a-col>
          <a-col :span="10">
            <styled-uploader
              text="上传封面"
              @success="updateAvatar"
              showUploaded
            >
            </styled-uploader>
          </a-col>
        </a-row>
        <a-form
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
          :model="form"
          :rules="rules"
        >
          <a-form-item label="标题" v-bind="validateInfos.title">
            <a-input v-model:value="form.title" />
          </a-form-item>
          <a-form-item label="描述" v-bind="validateInfos.desc">
            <a-input v-model:value="form.desc" />
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 18, offset: 4 }">
            <a-button
              type="primary"
              style="margin-left: 10px"
              @click="validateAndSave"
              :loading="saveIsLoading"
            >
              保存
            </a-button>
            <a-button style="margin-left: 10px" @click="onCancel">
              取消
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-drawer>
  </div>
</template>
<script setup lang="ts">
import useSaveWork from "@/hooks/useSaveWork";
import { baseH5URL } from "@/main";
import { GlobalDataProps } from "@/store";
import { computed, reactive } from "vue";
import { useStore } from "vuex";
import StyledUploader from "@/components/StyledUploader.vue";
import { RespUploadData } from "@/store/respTypes";
import { Form } from "ant-design-vue";
import { forEach } from "lodash-es";

const props = defineProps<{ open: boolean }>();
const open = computed(() => props.open);

const emit = defineEmits(["change"]);
const store = useStore<GlobalDataProps>();
const pageState = computed(() => store.state.editor.page);
const previewUrl = computed(
  //() => `${baseH5URL}/p/preview/${pageState.value.id}-${pageState.value.uuid}`
  () => `${baseH5URL}/api/pages/${pageState.value.id}-${pageState.value.uuid}`
);
const { title, desc, setting } = pageState.value;
const { saveWork, saveIsLoading } = useSaveWork(true);
const form = reactive({
  title: title || "",
  desc: desc || "",
  uploaded: {
    data: {
      url:
        (setting && setting.shareImg) ||
        "http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png",
    },
  },
});
const rules = reactive({
  title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
  desc: [{ required: true, message: "描述不能为空", trigger: "blur" }],
});
const updateAvatar = (rawData: { resp: RespUploadData; file: File }) => {
  const url = rawData.resp.data.urls[0];
  form.uploaded = {
    data: { url },
  };
};
const { validate, validateInfos } = Form.useForm(form, rules);
const validateAndSave = async () => {
  await validate();
  forEach(form, (value, key) => {
    if (key === "uploaded" && typeof value !== "string") {
      store.commit("updatePage", {
        key: "shareImg",
        value: value.data.url,
        isSetting: true,
      });
    } else {
      store.commit("updatePage", { key, value, isRoot: true });
    }
  });
  await saveWork();
  emit("change", false);
};
const onCancel = () => {
  emit("change", false);
};
</script>

<style>
.final-preview {
  position: absolute;
  width: calc(100% - 400px);
  height: 100%;
  background: transparent;
  top: 0;
  left: 0;
  z-index: 1500;
  display: flex;
  align-items: center;
  justify-content: center;
}
.final-preview-inner {
  width: 430px;
  height: 870px;
  padding: 60px 28px;
  box-sizing: border-box;
  position: relative;
  background: url("~@/assets/phone-back.png") no-repeat;
  background-size: cover;
}
.final-preview-inner .preview-title {
  height: 44px;
  line-height: 44px;
  text-align: center;
  font-weight: bold;
}
.iframe-container {
  width: 100%;
  height: 706px;
  overflow-y: auto;
  overflow-x: hidden;
}
.iframe-placeholder {
  background: url("~@/assets/loading.svg") 50% 50% no-repeat;
  background-size: 50px;
}
.publish-form-container .file-upload-container {
  height: 130px;
}
.publish-form-container .ant-form-item-label {
  text-align: left;
}
#preview-barcode-container {
  border: 2px dotted #efefef;
  padding: 10px;
}
</style>

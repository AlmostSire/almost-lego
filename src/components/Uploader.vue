<template>
  <div class="file-upload dragable">
    <div
      class="upload-area"
      :class="{ 'is-dragover': drag && isDragOver }"
      v-on="events"
    >
      <slot v-if="isUploading" name="loading">
        <button disabled>正在上传</button>
      </slot>
      <slot
        v-else-if="lastFileData && lastFileData.loaded"
        name="uploaded"
        :uploadedData="lastFileData.data"
      >
        <button>点击上传</button>
      </slot>
      <slot v-else>
        <button>点击上传</button>
      </slot>
    </div>

    <input
      type="file"
      :style="{ display: 'none' }"
      ref="fileInput"
      @change="handleFileChange"
    />
    <ul :class="`upload-list upload-list-${listType}`" v-if="showUploadList">
      <li
        v-for="file in fileList"
        :key="file.uid"
        :class="`uploaded-file upload-${file.status}`"
      >
        <img
          v-if="file.url && listType === 'picture'"
          class="upload-list-thumbnail"
          :src="file.url"
          :alt="file.name"
        />
        <span class="file-icon">
          <LoadingOutlined v-if="file.status === 'loading'" />
          <FileOutlined v-else />
        </span>
        <span class="filename">{{ file.name }}</span>
        <span class="delete-icon" @click="removeFile(file.uid)">
          <DeleteOutlined />
        </span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { computed, defineComponent, reactive, ref, PropType } from "vue";
import { v4 as uuidv4 } from "uuid";
import {
  DeleteOutlined,
  LoadingOutlined,
  FileOutlined,
} from "@ant-design/icons-vue";
import { last } from "lodash-es";
type UploadStatus = "ready" | "loading" | "success" | "error";
type FileListType = "picture" | "text";
type CheckUpload = (file: File) => boolean | Promise<File>;
export interface UploadFile {
  uid: string;
  size: number;
  name: string;
  status: UploadStatus;
  raw: File;
  resp?: any;
  url?: string;
}

export default defineComponent({
  props: {
    action: {
      type: String,
      required: true,
    },
    beforeUpload: Function as PropType<CheckUpload>,
    drag: Boolean,
    autoUpload: {
      type: Boolean,
      default: true,
    },
    listType: {
      type: String as PropType<FileListType>,
      default: "text",
    },
    showUploadList: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    DeleteOutlined,
    LoadingOutlined,
    FileOutlined,
  },
  emits: ["success"],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null);
    const isDragOver = ref(false);
    const fileList = ref<UploadFile[]>([]);
    const isUploading = computed(() =>
      fileList.value.some((file) => file.status === "loading")
    );
    const lastFileData = computed(() => {
      const lastFile = last(fileList.value);
      if (lastFile) {
        return {
          loaded: lastFile.status === "success",
          data: lastFile.resp,
        };
      }
      return false;
    });

    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const postFile = async (readyFile: UploadFile) => {
      const formData = new FormData();
      formData.append(readyFile.name, readyFile.raw);
      readyFile.status = "loading";
      try {
        const resp = await axios.post(props.action, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (resp.data.errno === 0) {
          readyFile.status = "success";
          readyFile.resp = resp.data;
          context.emit("success", { resp: resp.data, file: readyFile });
        } else {
          readyFile.status = "error";
        }
      } catch (e) {
        readyFile.status = "error";
      } finally {
        if (fileInput.value) fileInput.value.value = "";
      }
    };

    const addFileToList = async (uploadedFile: File) => {
      const fileObj = reactive<UploadFile>({
        uid: uuidv4(),
        size: uploadedFile.size,
        name: uploadedFile.name,
        status: "ready",
        raw: uploadedFile,
      });
      if (props.listType === "picture") {
        try {
          fileObj.url = URL.createObjectURL(uploadedFile);
        } catch (err) {
          console.error("upload File error", err);
        }
        // const fileReader = new FileReader();
        // fileReader.readAsDataURL(uploadedFile);
        // fileReader.addEventListener("load", () => {
        //   fileObj.url = fileReader.result as string;
        // });
      }
      fileList.value.push(fileObj);
      if (props.autoUpload) {
        postFile(fileObj);
      }
    };

    const beforeUploadCheck = async (files: null | FileList) => {
      if (files) {
        const uploadedFile = files[0];
        if (props.beforeUpload) {
          try {
            const result = await props.beforeUpload(uploadedFile);
            if (result === true) {
              addFileToList(uploadedFile);
            } else if (result instanceof File) {
              addFileToList(result);
            }
          } catch (e) {
            console.log(e);
          }
        } else {
          await addFileToList(uploadedFile);
        }
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const uploadFiles = () => {
      fileList.value
        .filter((file) => file.status === "ready")
        .forEach((readyFile) => postFile(readyFile));
    };

    const handleFileChange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      beforeUploadCheck(target.files);
    };

    const handleDrag = (e: DragEvent, over: boolean) => {
      e.preventDefault();
      isDragOver.value = over;
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      isDragOver.value = false;
      if (e.dataTransfer) {
        beforeUploadCheck(e.dataTransfer.files);
      }
    };

    const events = {
      click: triggerUpload,
      ...(props.drag && {
        dragover: (e: DragEvent) => handleDrag(e, true),
        dragleave: (e: DragEvent) => handleDrag(e, false),
        drop: handleDrop,
      }),
    };

    const removeFile = (id: string) => {
      const index = fileList.value.findIndex((file) => file.uid === id);
      fileList.value.splice(index, 1);
    };

    return {
      isUploading,
      lastFileData,
      fileList,
      isDragOver,
      events,
      fileInput,
      handleFileChange,
      removeFile,
      uploadFiles,
    };
  },
});
</script>
<style lang="less">
.upload-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}
.upload-list li {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  font-size: 14px;
  line-height: 1.8;
  margin-top: 5px;
  box-sizing: border-box;
  border-radius: 4px;
  min-width: 200px;
  position: relative;
  &:first-child {
    margin-top: 10px;
  }
  .upload-list-thumbnail {
    vertical-align: middle;
    display: inline-block;
    width: 70px;
    height: 70px;
    position: relative;
    z-index: 1;
    background-color: #fff;
    object-fit: cover;
  }
  .file-icon {
    svg {
      margin-right: 5px;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  .filename {
    margin-left: 5px;
    margin-right: 40px;
  }
  &.upload-error {
    color: #f5222d;
    svg {
      color: #f5222d;
    }
  }
  .file-status {
    display: block;
    position: absolute;
    right: 5px;
    top: 0;
    line-height: inherit;
  }
  .delete-icon {
    display: none;
    position: absolute;
    right: 7px;
    top: 0;
    line-height: inherit;
    cursor: pointer;
  }
  &:hover {
    background-color: #efefef;
    .file-status {
      display: none;
    }
    .delete-icon {
      display: block;
    }
  }
}
</style>

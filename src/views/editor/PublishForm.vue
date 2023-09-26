<template>
  <div class="publish-channel-container">
    <a-row :style="{ marginBottom: '20px' }">
      <a-col :span="8" class="left-col">
        封面图
        <img :src="page.coverImg" :alt="page.title" />
      </a-col>
      <a-col :span="16" class="right-col">
        <a-row>
          <a-col :span="6">
            <img
              src="http://vue-maker.oss-cn-hangzhou.aliyuncs.com/vue-marker/5f79389d4737571e2e1dc7cb.png"
              :alt="page.title"
            />
          </a-col>
          <a-col :span="18" class="left-gap">
            <h4>{{ page.title }}</h4>
            <p>{{ page.desc }}</p>
          </a-col>
        </a-row>
        <a-tabs type="card" :style="{ marginTop: '20px' }">
          <a-tab-pane key="channels" tab="发布为作品">
            <a-row
              v-for="channel in channels"
              :key="channel.id"
              class="channel-item"
            >
              <a-col :span="6">
                <a-qrcode :value="generateChannelURL(channel.id)" :size="100" />
              </a-col>
              <a-col :span="18" class="left-gap">
                <h4>{{ channel.name }}</h4>
                <a-row>
                  <a-col :span="18">
                    <a-input
                      :value="generateChannelURL(channel.id)"
                      :readonly="true"
                      :id="`channel-url-${channel.id}`"
                    />
                  </a-col>
                  <a-col :span="6">
                    <a-button
                      class="copy-button"
                      :data-clipboard-target="`#channel-url-${channel.id}`"
                    >
                      复制
                    </a-button>
                  </a-col>
                </a-row>
              </a-col>
              <div class="delete-area">
                <a-button
                  danger
                  size="small"
                  @click="deleteChannel(channel.id)"
                  :disabled="deleteDisabled"
                >
                  删除渠道
                </a-button>
              </div>
            </a-row>
            <a-form
              layout="inline"
              :style="{ marginTop: '20px' }"
              :model="form"
              :rules="rules"
            >
              <a-form-item
                name="channelName"
                v-bind="validateInfos.channelName"
              >
                <a-input
                  placeholder="渠道名称"
                  v-model:value="form.channelName"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="createChannel">
                  创建新渠道
                </a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="template" tab="发布为模版"> </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, onMounted } from "vue";
import { Form } from "ant-design-vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ClipboardJS from "clipboard";
import { message } from "ant-design-vue";
import { GlobalDataProps } from "../../store/index";
import { baseH5URL } from "../../main";

const store = useStore<GlobalDataProps>();
const route = useRoute();
const currentWorkId = route.params.id as string;
const page = computed(() => store.state.editor.page);
const channels = computed(() => store.state.editor.channels);

const form = reactive({
  channelName: "",
});
const rules = reactive({
  channelName: [{ required: true, message: "标题不能为空", trigger: "blur" }],
});
const { validate, validateInfos } = Form.useForm(form, rules);
const generateChannelURL = (id: number) =>
  `${baseH5URL}/p/${page.value.id}-${page.value.uuid}?channel=${id}`;
const createChannel = async () => {
  const payload = {
    name: form.channelName,
    workId: parseInt(currentWorkId),
  };
  try {
    await validate();
    await store.dispatch("createChannel", { data: payload });
    form.channelName = "";
  } catch (e) {
    console.error(e);
  }
};
const deleteDisabled = computed(() => channels.value.length === 1);
const deleteChannel = (id: number) => {
  store.dispatch("deleteChannel", { urlParams: { id } });
};

onMounted(() => {
  const clipboard = new ClipboardJS(".copy-button");
  clipboard.on("success", (e) => {
    message.success("复制成功", 1);
    e.clearSelection();
  });
});
</script>

<style>
.left-col img {
  width: 80%;
}
.right-col img {
  width: 80px;
}
.left-gap {
  padding-left: 5px;
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.delete-area {
  position: absolute;
  top: 10px;
  right: 20px;
}
.channel-item {
  padding: 10px 0;
  border-bottom: 1px solid #efefef;
  position: relative;
}
.barcode-container {
  height: 80px;
  width: 80px;
}
.template-submit {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

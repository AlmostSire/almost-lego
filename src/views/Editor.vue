<template>
  <div class="editor" id="editor-layout-main">
    <a-modal
      title="发布成功"
      v-model:open="showPublishForm"
      width="700px"
      @ok="showPublishForm = false"
      :footer="null"
    >
      <publish-form />
    </a-modal>

    <PreviewForm :open="showPreviewForm" @change="handleOpen" />

    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">
            <img
              alt="慕课乐高"
              src="../assets/logo-simple.png"
              class="logo-img"
            />
          </router-link>
          <inline-edit :value="page.title" @change="titleChange" />
        </div>
        <div class="page-btn">
          <a-button type="primary" @click="preview">预览和设置</a-button>
          <a-button type="primary" @click="saveWork" :loading="saveIsLoading">
            保存
          </a-button>
          <a-button type="primary" @click="publish" :loading="isPublishing">
            发布
          </a-button>
          <user-profile :user="userInfo"></user-profile>
        </div>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" :style="{ background: 'red' }">
        <div class="sidebar-container">组件列表</div>
        <ComponentList :list="defaultTemplates" @on-item-click="addItem" />
        <img id="test-image" :style="{ width: '300px' }" />
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <HistoryArea />
          <div
            class="preview-list"
            id="canvas-area"
            :class="{ 'canvas-fix': canvasFix }"
          >
            <component :is="'div'" class="body-container" :style="page.props">
              <EditWrapper
                v-for="component in components"
                :key="component.id"
                :id="component.id"
                :active="component.id === currentComponent?.id"
                :props="component.props"
                @set-active="setActive"
                @update-position="updatePosition"
              >
                <component :is="component.name" :="component.props">
                  {{ component.props.text }}
                </component>
              </EditWrapper>
            </component>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        <a-tabs type="card" v-model:activeKey="activePanel">
          <a-tab-pane key="component" tab="页面设置">
            <div v-if="currentComponent">
              <EditGroup
                v-if="!currentComponent.isLocked"
                :props="currentComponent.props"
                @change="handleChange"
              />
              <a-empty v-else>
                <template #description>
                  <p>该元素被锁定，无法编辑</p>
                </template>
              </a-empty>
            </div>
          </a-tab-pane>
          <a-tab-pane key="layer" tab="图层设置">
            <layer-list
              :list="components"
              :selectedId="currentComponent?.id"
              @change="handleChange"
              @select="setActive"
            >
            </layer-list>
          </a-tab-pane>
          <a-tab-pane key="page" tab="页面设置">
            <PropsTable :props="(page.props as any)" @change="pageChange" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { pickBy } from "lodash-es";
import initHotKeys from "@/plugins/hotKeys";
import initContextMenu from "@/plugins/contextMenu";
import ComponentList from "@/components/ComponentList.vue";
import LayerList from "@/components/LayerList.vue";
import EditGroup from "@/components/EditGroup.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable.vue";
import InlineEdit from "@/components/InlineEdit.vue";
import UserProfile from "@/components/UserProfile.vue";
import defaultTemplates from "@/defaultTemplates";
import { ComponentData, UpdateComponentData } from "@/store/editor";
import HistoryArea from "./editor/HistoryArea.vue";
import useSaveWork from "@/hooks/useSaveWork";
import usePublishWork from "@/hooks/usePublishWork";
import PublishForm from "./editor/PublishForm.vue";
import PreviewForm from "./editor/PreviewForm.vue";

export type TabType = "component" | "layer" | "page";

export default defineComponent({
  name: "Editor",
  components: {
    LayerList,
    ComponentList,
    EditWrapper,
    PropsTable,
    EditGroup,
    HistoryArea,
    InlineEdit,
    UserProfile,
    PublishForm,
    PreviewForm,
  },
  setup() {
    initHotKeys();
    initContextMenu();
    const route = useRoute();
    const currentWorkId = route.params.id;
    const store = useStore<GlobalDataProps>();
    const activePanel = ref<TabType>("component");
    const components = computed(() => store.state.editor.components);
    const page = computed(() => store.state.editor.page);
    const canvasFix = ref(false);
    const showPublishForm = ref(false);
    const showPreviewForm = ref(false);
    const userInfo = computed(() => store.state.user);
    const { saveIsLoading, saveWork } = useSaveWork();
    const { publishWork, isPublishing } = usePublishWork();
    const currentComponent = computed<ComponentData | undefined>(
      () => store.getters.getCurrentElement
    );
    onMounted(() => {
      if (currentWorkId) {
        store.dispatch("fetchWork", { urlParams: { id: currentWorkId } });
      }
    });
    const addItem = (component: ComponentData) => {
      store.commit("addComponent", component);
    };
    const setActive = (id: string) => {
      store.commit("setActive", id);
    };
    const handleChange = (e: UpdateComponentData) => {
      store.commit("updateComponent", e);
    };
    const pageChange = (e: UpdateComponentData) => {
      store.commit("updatePage", e);
    };
    const titleChange = (newTitle: string) => {
      store.commit("updatePage", {
        key: "title",
        value: newTitle,
        isRoot: true,
      });
    };
    const updatePosition = (data: {
      left: number;
      top: number;
      id: string;
    }) => {
      const updatedData = pickBy(data, (v, k) => k !== "id");
      const keys = Object.keys(updatedData);
      const values = Object.values(updatedData).map((v) => v + "px");
      store.commit("updateComponent", {
        key: keys,
        value: values,
        id: data.id,
      });
    };

    const publish = async () => {
      store.commit("setActive", "");
      const el = document.getElementById("canvas-area") as HTMLElement;
      canvasFix.value = true;
      await nextTick();
      try {
        await publishWork(el);
        showPublishForm.value = true;
      } catch (error) {
        console.log(error);
      } finally {
        canvasFix.value = false;
      }
    };

    const preview = async () => {
      await saveWork();
      showPreviewForm.value = true;
    };

    const handleOpen = (value: boolean) => {
      showPreviewForm.value = value;
    };

    return {
      currentComponent,
      activePanel,
      components,
      defaultTemplates,
      page,
      addItem,
      setActive,
      handleChange,
      pageChange,
      updatePosition,
      titleChange,
      saveWork,
      saveIsLoading,
      userInfo,
      publish,
      preview,
      canvasFix,
      isPublishing,
      showPublishForm,
      showPreviewForm,
      handleOpen,
    };
  },
});
</script>

<style lang="less" scoped>
.preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}

.preview-list.canvas-fix {
  max-height: none;
  position: absolute;
}

.page-title {
  display: flex;
  align-items: center;
  line-height: normal;
}
.page-title .inline-edit span {
  font-weight: 500;
  margin-left: 10px;
  font-size: 16px;
}
.page-btn {
  display: flex;
  width: 400px;
  align-items: center;
  justify-content: space-between;
}
</style>

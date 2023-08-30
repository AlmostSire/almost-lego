<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300" :style="{ background: 'red' }">
        <div class="sidebar-container">组件列表</div>
        <ComponentList :list="defaultTemplates" @on-item-click="addItem" />
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <HistoryArea />
          <div class="preview-list" id="canvas-area">
            <div class="body-container" :style="page.props">
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
            </div>
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
            <PropsTable :props="page.props" @change="pageChange" />
          </a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { pickBy } from "lodash-es";
import initHotKeys from "@/plugins/hotKeys";
import initContextMenu from "@/plugins/contextMenu";
import ComponentList from "@/components/ComponentList.vue";
import LayerList from "@/components/LayerList.vue";
import EditGroup from "@/components/EditGroup.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import PropsTable from "@/components/PropsTable.vue";
import defaultTemplates from "@/defaultTemplates";
import { ComponentData, UpdateComponentData } from "@/store/editor";
import HistoryArea from "./editor/HistoryArea.vue";

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
  },
  setup() {
    initHotKeys();
    initContextMenu();
    const store = useStore<GlobalDataProps>();
    const activePanel = ref<TabType>("component");
    const components = computed(() => store.state.editor.components);
    const page = computed(() => store.state.editor.page);
    const currentComponent = computed<ComponentData | undefined>(
      () => store.getters.getCurrentElement
    );
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
    };
  },
});
</script>

<style scoped>
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
</style>

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
          <div class="preview-list" id="canvas-area">
            <EditWrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              :active="component.id === currentComponentId"
              @set-active="setActive"
            >
              <component :is="component.name" :="component.props">
                {{ component.props.text }}
              </component>
            </EditWrapper>
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
              :selectedId="currentComponentId"
              @change="handleChange"
              @select="setActive"
            >
            </layer-list>
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
import ComponentList from "@/components/ComponentList.vue";
import LayerList from "@/components/LayerList.vue";
import EditGroup from "@/components/EditGroup.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import LImage from "@/components/LImage.vue";
import PropsTable from "@/components/PropsTable.vue";
import defaultTemplates from "@/defaultTemplates";
import { ComponentData, UpdatePayload } from "@/store/editor";

export type TabType = "component" | "layer" | "page";

export default defineComponent({
  name: "Editor",
  components: {
    LayerList,
    LImage,
    ComponentList,
    EditWrapper,
    PropsTable,
    EditGroup,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const activePanel = ref<TabType>("component");
    const components = computed(() => store.state.editor.components);
    const currentComponentId = computed(
      () => store.state.editor.currentComponentId
    );
    const currentComponent = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    );
    const addItem = (component: ComponentData) => {
      store.commit("addComponent", component);
    };
    const setActive = (id: string) => {
      store.commit("setActive", id);
    };
    const handleChange = (e: UpdatePayload) => {
      store.commit("updateComponent", e);
    };
    return {
      currentComponentId,
      currentComponent,
      activePanel,
      components,
      defaultTemplates,
      addItem,
      setActive,
      handleChange,
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

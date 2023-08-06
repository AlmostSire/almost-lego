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
              :active="component.id === currentElement?.id"
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
        组件属性

        <PropsTable
          v-if="currentElement"
          :data="currentElement.props"
          @change="handleChange"
        />
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import ComponentList from "@/components/ComponentList.vue";
import EditWrapper from "@/components/EditWrapper.vue";
import LText from "@/components/LText.vue";
import LImage from "@/components/LImage.vue";
import PropsTable from "@/components/PropsTable.vue";
import defaultTemplates from "@/defaultTemplates";
import { ComponentData } from "@/store/editor";
import { PropsKeys } from "@/propsMap";

export default defineComponent({
  name: "Editor",
  components: {
    LText,
    LImage,
    ComponentList,
    EditWrapper,
    PropsTable,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const currentElement = computed<ComponentData | null>(
      () => store.getters.getCurrentElement
    );
    const addItem = (component: ComponentData) => {
      store.commit("addComponent", component);
    };
    const setActive = (id: string) => {
      store.commit("setActive", id);
    };
    const handleChange = (e: { key: PropsKeys; value: string }) => {
      store.commit("updateComponent", e);
    };
    return {
      currentElement,
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

<template>
  <div class="editor" id="editor-layout-main">
    <a-layout>
      <a-layout-sider width="300">
        <div class="sidebar-container">组件列表</div>
        <ComponentList :list="defaultTemplates" @on-item-click="addItem" />
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <component
              v-for="component in components"
              :is="component.name"
              :key="component.id"
              :="component.props"
            >
              {{ component.props.text }}
            </component>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: purple"
        class="settings-panel"
      >
        组件属性
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<script lang="ts">
import { GlobalDataProps } from "@/store";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import ComponentList from "@/components/ComponentList.vue";
import LText from "@/components/LText.vue";
import defaultTemplates from "@/defaultTemplates";
import { AllComponentProps } from "@/defaultProps";

export default defineComponent({
  name: "Editor",
  components: {
    LText,
    ComponentList,
  },
  setup() {
    const store = useStore<GlobalDataProps>();
    const components = computed(() => store.state.editor.components);
    const addItem = (props: AllComponentProps) => {
      store.commit("addComponent", props);
    };
    return {
      components,
      defaultTemplates,
      addItem,
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

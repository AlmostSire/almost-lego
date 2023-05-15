<template>
  <a-layout class="editor-container">
    <a-layout-header>
      <div class="page-title">
        <router-link to="/">慕课乐高</router-link>
      </div>
    </a-layout-header>

    <a-layout>
      <a-layout-sider width="300" style="background: yellow">
        <div class="sidebar-container">
          <p>组件列表</p>
          <ComponentList :list="defaultTextTemplates" @on-item-click="addComponent" />
        </div>
      </a-layout-sider>

      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area">
          <EditWrapper
            v-for="component in components"
            :key="component.id"
            :id="component.id"
            @on-item-click="activeComponent(component.id)"
            :active="component.id === currentElement?.id"
          >
            <component :is="component.name" :key="component.id" v-bind="component.props" />
            <template v-slot:btn>
              <span @click="deleteComponent(component.id)">删除</span>
            </template>
          </EditWrapper>
        </div>
      </a-layout-content>

      <a-layout-sider width="300" style="background: purple" class="settings-panel">
        组件属性
        <PropsTable v-if="currentElement" :props="currentElement.props" @change="handleChange" />
      </a-layout-sider>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { useGlobalStore } from '@/stores'
import { defineComponent, computed } from 'vue'
import ComponentList from '@/components/ComponentList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import PropsTable from '@/components/PropsTable.vue'
import defaultTextTemplates from '../defaultTemplates'
import LText from '@/components/LText.vue'
import type { TextComponentProps, AllComponentProps } from '@/defaultProps'

export default defineComponent({
  components: {
    ComponentList,
    EditWrapper,
    PropsTable,
    LText
  },
  setup() {
    const store = useGlobalStore()
    const components = computed(() => store.editor.components)
    const currentElement = computed(() => store.editor.currentElement)

    const addComponent = (props: Partial<AllComponentProps>) => {
      store.editor.addComponent(props)
    }

    const activeComponent = (id: string) => {
      store.editor.activeComponent(id)
    }

    const handleChange = (data: { key: keyof AllComponentProps; value: string }) => {
      store.editor.updateComponent(data)
    }

    const deleteComponent = (id: string) => {
      store.editor.deleteComponent(id)
    }

    return {
      components,
      currentElement,
      defaultTextTemplates,
      addComponent,
      activeComponent,
      handleChange,
      deleteComponent
    }
  }
})
</script>

<style scoped>
.editor-container {
  /* min-height: 100vh; */
}

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

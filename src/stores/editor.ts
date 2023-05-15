import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import type { AllComponentProps } from '@/defaultProps'

export interface EditorProps {
  // 供中间编辑器渲染的数组
  components: ComponentData[]
  currentElementId: string
}

interface ComponentData {
  // 元素的属性，属性请详见下面
  props: Partial<AllComponentProps>
  // id, uuid v4 生成
  id: string
  // 业务组件库名称 l-text，l-image
  name: string
}

const testComponents: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello', fontSize: '20px', color: 'red' }
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello1', fontSize: '10px' }
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: { text: 'hello2', fontSize: '15px', actionType: 'url', url: 'https://www.baidu.com' }
  }
]

export const useEditorStore = defineStore('editor', () => {
  const state = reactive<EditorProps>({
    components: testComponents,
    currentElementId: ''
  })

  const currentElement = computed(() =>
    state.components.find((component) => component.id === state.currentElementId)
  )

  const addComponent = (props: Partial<AllComponentProps>) => {
    const newComponent: ComponentData = {
      id: uuidv4(),
      name: 'LText',
      props
    }
    state.components.push(newComponent)
  }

  const deleteComponent = (id: string) => {
    const index = state.components.findIndex((component) => component.id === id)
    state.components.splice(index, 1)
  }

  const activeComponent = (id: string) => {
    state.currentElementId = id
  }

  const updateComponent = (data: { key: keyof AllComponentProps; value: string }) => {
    if (currentElement.value) {
      currentElement.value.props[data.key] = data.value
    }
  }

  return {
    ...state,
    currentElement,
    addComponent,
    deleteComponent,
    activeComponent,
    updateComponent
  }
})

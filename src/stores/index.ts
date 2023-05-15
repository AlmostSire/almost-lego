import { defineStore } from 'pinia'
import { useTemplateStore } from './template'
import { useUserStore } from './user'
import { useEditorStore } from './editor'

export const useGlobalStore = defineStore('global', () => {
  const user = useUserStore()
  const template = useTemplateStore()
  const editor = useEditorStore()
  return {
    user,
    template,
    editor
  }
})

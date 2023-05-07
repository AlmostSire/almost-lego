import { defineStore } from 'pinia'
import { useTemplateStore } from './template'
import { useUserStore } from './user'

export const useGlobalStore = defineStore('global', () => {
  const { user, login, logout } = useUserStore()
  const { templates, getTemplateById } = useTemplateStore()
  return {
    user,
    login,
    logout,
    templates,
    getTemplateById
  }
})

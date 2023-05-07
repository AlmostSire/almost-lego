import { reactive } from 'vue'
import { defineStore } from 'pinia'

export interface UserProps {
  isLogin: boolean
  userName?: string
}

export const useUserStore = defineStore('user', () => {
  const user = reactive<UserProps>({
    isLogin: false
  })

  const login = () => {
    user.isLogin = true
    user.userName = 'almost'
  }

  const logout = () => {
    user.isLogin = false
    user.userName = undefined
  }

  return {
    user,
    login,
    logout
  }
})

<template>
  <!-- <router-link to="/login" v-if="!user.isLogin">
    <a-button type="primary" class="user-profile-component"> 登录 </a-button>
  </router-link> -->
  <a-button v-if="!user.isLogin" @click="login" type="primary" class="user-profile-component">
    登录
  </a-button>
  <div v-else>
    <a-dropdown-button class="user-profile-component">
      <router-link to="/setting">{{ user.userName }}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <a-menu-item key="0" @click="createDesign">创建作品</a-menu-item>
          <a-menu-item key="1"><router-link to="/works">我的作品</router-link></a-menu-item>
          <a-menu-item key="2" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<script setup lang="ts">
// import axios from 'axios'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useGlobalStore } from '../stores'

const globalStore = useGlobalStore()
const user = globalStore.user
const router = useRouter()
const createDesign = async () => {
  // const payload = {
  //   title: '未命名作品',
  //   desc: '未命名作品',
  //   coverImg:
  //     'http://typescript-vue.oss-cn-beijing.aliyuncs.com/vue-marker/5f81cca3f3bf7a0e1ebaf885.png'
  // }
  // const postData = {
  //   method: 'post',
  //   data: payload,
  //   opName: 'createDesign'
  // } as any
  // const { data } = await axios('/works', postData)
  message.success('创建作品成功', 2)
  //router.push(`/editor/${data.data.id}`)
}

const login = () => {
  globalStore.login()
  message.success('登录成功', 2)
  console.log(user)
}

const logout = () => {
  globalStore.logout()
  //store.commit('logout')
  message.success('退出登录成功，2秒后跳转到首页', 2)
  setTimeout(() => {
    router.push('/')
  }, 2000)
}
</script>
<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}

.user-operation > * {
  margin-left: 30px !important;
}
</style>

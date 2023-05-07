import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Editor from '../views/Editor.vue'
import Template from '@/views/Template.vue'
import Index from '../views/Index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: 'template/:id',
          name: 'template',
          component: Template
        }
      ]
    },
    {
      path: '/editor',
      name: 'editor',
      component: Editor
    }
  ]
})

export default router

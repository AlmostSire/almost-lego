import { reactive } from 'vue'
import { defineStore } from 'pinia'

export interface TemplateProps {
  id: number
  title: string
  coverImg: string
  author: string
  compiedCount: number
}

const testData = [
  {
    id: 1,
    coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    title: '前端架构师直播海报',
    author: 'almost',
    compiedCount: 1
  },
  {
    id: 2,
    coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'almost',
    compiedCount: 1
  },
  {
    id: 3,
    coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-682056.png',
    title: '前端架构师直播海报',
    author: 'almost',
    compiedCount: 1
  },
  {
    id: 4,
    coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'almost',
    compiedCount: 1
  },
  {
    id: 5,
    coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-889755.png',
    title: '前端架构师直播海报',
    author: 'almost',
    compiedCount: 1
  },
  {
    id: 6,
    coverImg: 'https://static.imooc-lego.com/upload-files/screenshot-677311.png',
    title: '前端架构师直播海报',
    author: 'almost',
    compiedCount: 1
  }
]

export const useTemplateStore = defineStore('template', () => {
  const templates = reactive<TemplateProps[]>(testData)

  const getTemplateById = (id: number) => {
    return templates.find((template) => template.id === id)
  }

  return {
    templates,
    getTemplateById
  }
})

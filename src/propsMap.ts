import type { AllComponentProps } from './defaultProps'
import { h } from 'vue'
import type { VNode } from 'vue'

export interface PropToForm {
  component: string
  subComponent?: string
  extraProps?: Record<string, any>
  text?: string
  options?: { text: string | VNode; value: any }[]
  initialTransform?: (value: any) => any
  afterTransform?: (value: any) => any
  valueProp?: string
  eventName?: string
}

export type PropsToForms = {
  [key in keyof AllComponentProps]?: PropToForm
}

const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' }
]

const fontFamilyOptions = fontFamilyArr.map((font) => ({
  ...font,
  text: h('span', { style: { fontFamily: font.value } }, font.text)
}))

const pxToNumberHandler = {
  component: 'a-input-number',
  initialTransform: (value: string) => parseFloat(value),
  afterTransform: (e: number) => (e ? e + 'px' : '')
}

const defaultHandler = {
  component: 'a-input',
  eventName: 'change',
  valueProp: 'value',
  intialTransform: (v: any) => v,
  afterTransform: (e: any) => e
}

export const mapPropsToForms: PropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    afterTransform: (e: any) => e.target.value
  },
  fontSize: {
    text: '字号',
    ...pxToNumberHandler
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: {
      min: 0,
      max: 3,
      step: 0.1
    },
    initialTransform: (value: string) => parseFloat(value),
    afterTransform: (value: number) => value.toString()
  },
  textAlign: {
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    text: '对齐',
    options: [
      {
        value: 'left',
        text: '左'
      },
      {
        value: 'center',
        text: '中'
      },
      {
        value: 'right',
        text: '右'
      }
    ],
    afterTransform: (e: any) => e.target.value
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [{ value: '', text: '无' }, ...fontFamilyOptions]
  },

  height: {
    text: '高度',
    component: 'a-input-number',
    initialTransform: (value: string) => parseFloat(value),
    afterTransform: (e: number) => (e ? e + 'px' : '')
  },
  width: {
    text: '宽度',
    ...pxToNumberHandler
  },
  paddingLeft: {
    text: '左边距',
    ...pxToNumberHandler
  },
  paddingRight: {
    text: '右边距',
    ...pxToNumberHandler
  },
  paddingTop: {
    text: '上边距',
    ...pxToNumberHandler
  },
  paddingBottom: {
    text: '下边距',
    ...pxToNumberHandler
  },

  borderStyle: {
    ...defaultHandler,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '边框类型',
    options: [
      { value: 'none', text: '无' },
      { value: 'solid', text: '实线' },
      { value: 'dashed', text: '破折线' },
      { value: 'dotted', text: '点状线' }
    ]
  },

  borderWidth: {
    ...pxToNumberHandler,
    component: 'a-slider',
    text: '边框宽度',
    extraProps: { min: 0, max: 20 }
  },

  borderRadius: {
    ...pxToNumberHandler,
    component: 'a-slider',
    text: '边框圆角',
    extraProps: { min: 0, max: 200 }
  },

  opacity: {
    component: 'a-slider',
    text: '透明度',
    initialTransform: (v: number) => (v ? v * 100 : 100),
    afterTransform: (e: number) => e / 100,
    extraProps: { min: 0, max: 100, reverse: true }
  },

  left: {
    ...pxToNumberHandler,
    text: 'X轴坐标'
  },
  top: {
    ...pxToNumberHandler,
    text: 'Y轴坐标'
  },

  actionType: {
    ...defaultHandler,
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '点击',
    options: [
      { value: '', text: '无' },
      { value: 'to', text: '跳转到 URL' }
    ]
  },

  url: {
    ...defaultHandler,
    afterTransform: (e: any) => e.target.value,
    text: '链接'
  }
}

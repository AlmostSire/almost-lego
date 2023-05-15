import { computed, defineComponent, type PropType } from 'vue'
import { reduce } from 'lodash-es'
import { mapPropsToForms, type PropToForm } from '../propsMap'
import { type AllComponentProps } from '../defaultProps'
import { Input, InputNumber, Slider, Radio, Select } from 'ant-design-vue'

const mapToComponent = {
  'a-textarea': Input.TextArea,
  'a-input-number': InputNumber,
  'a-slider': Slider,
  'a-radio-group': Radio.Group,
  'a-radio-button': Radio.Button,
  'a-select': Select,
  'a-select-option': Select.Option
} as any

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

interface FormProps extends PropToForm {
  valueProp: string
  value: string
  eventName: string
  events: {
    [key: string]: (e: any) => void
  }
}

type Keys = keyof AllComponentProps

export default defineComponent({
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true
    }
  },
  emits: ['change'],
  setup(props, context) {
    const finalProps = computed(() =>
      reduce<AllComponentProps, { [key: string]: FormProps }>(
        props.props,
        (result, value, key) => {
          const newKey = key as Keys
          const item = mapPropsToForms[newKey]
          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initialTransform,
              afterTransform,
              ...rest
            } = item
            const newItem: FormProps = {
              ...rest,
              value: initialTransform ? initialTransform(value) : value,
              valueProp,
              eventName,
              events: {
                ['on' + capitalizeFirstLetter(eventName)]: (e: any) => {
                  context.emit('change', { key, value: afterTransform ? afterTransform(e) : e })
                }
              }
            }
            result[newKey] = newItem
          }
          return result
        },
        {}
      )
    )
    return () => (
      <div class="props-table">
        {Object.entries(finalProps.value).map(([key, value]) => {
          const ComponentName = mapToComponent[value.component]
          const SubComponent = value.subComponent ? mapToComponent[value.subComponent] : null
          const props = {
            [value.valueProp]: value.value,
            ...value.extraProps,
            ...value.events
          }
          return (
            <div key={key} class="prop-item">
              <span class="prop-label">{value.text}</span>
              <div class="prop-component">
                <ComponentName {...props}>
                  {value.options &&
                    value.options.map((option) => {
                      return <SubComponent value={option.value}>{option.text}</SubComponent>
                    })}
                </ComponentName>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
})

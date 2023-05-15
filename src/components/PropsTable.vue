<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="prop-label">{{ value.text }}</span>
      <div class="prop-component">
        <component
          v-if="value"
          :is="value.component"
          :value="value.value"
          v-bind="value.extraProps"
          v-bind:[value.valueProp]="value.value"
          v-on="value.events"
        >
          <template v-if="value.subComponent">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options"
              :key="k"
              :value="option.value"
            >
              <RenderVnode :v-node="option.text" />
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AllComponentProps } from '@/defaultProps'
import type { PropToForm } from '@/propsMap'
import { computed } from 'vue'
import { reduce } from 'lodash-es'
import { mapPropsToForms } from '@/propsMap'
import RenderVnode from '@/components/RenderVnode'

interface FormProps extends PropToForm {
  valueProp: string
  value: string
  eventName: string
  events: {
    [key: string]: (e: any) => void
  }
}

interface PropsTableProps {
  props: AllComponentProps
}

type Keys = keyof AllComponentProps

const props = defineProps<PropsTableProps>()

const emit = defineEmits(['change'])

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
            [eventName]: (e: any) =>
              emit('change', { key, value: afterTransform ? afterTransform(e) : e })
          }
        }
        result[newKey] = newItem
      }
      return result
    },
    {}
  )
)
</script>

<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}
.prop-label {
  width: 28%;
}
.prop-component {
  width: 70%;
}
.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}
#item-fontWeight {
  margin-left: 28%;
}
.component-a-select .ant-select {
  width: 150px;
}
.prop-component.component-shadow-picker,
.prop-component.component-image-processer,
.prop-component.component-background-processer {
  width: 100%;
}
</style>

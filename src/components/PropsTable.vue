<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label">{{ value?.text }}</span>
      <div class="prop-component">
        <component
          :is="value.component"
          :[value.valueProp]="value.value"
          :="value.extraProps"
          @="value.events"
        >
          <template v-if="value.subComponent && value.options">
            <component
              :is="value.subComponent"
              v-for="(option, k) in value.options"
              :key="k"
              :value="option.value"
            >
              {{ option.text }}
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { reduce } from "lodash-es";
import { mapPropsToForms, PropsKeys, PropToForm } from "../propsMap";
import { AllComponentProps } from "../defaultProps";

interface FormProps extends PropToForm {
  value: string;
  valueProp: string;
  eventName: string;
  events: Record<string, (e: unknown) => void>;
}

export default defineComponent({
  name: "PropsTable",
  props: {
    data: {
      type: Object as PropType<AllComponentProps>,
      required: true,
    },
  },
  emits: ["change"],
  setup(props, context) {
    const finalProps = computed(() =>
      reduce(
        props.data,
        (result, value, key) => {
          const newKey = key as PropsKeys;
          const item = mapPropsToForms[newKey];
          if (item) {
            const {
              valueProp = "value",
              eventName = "change",
              initialTransform,
              afterTransform,
            } = item;
            const newItem: FormProps = {
              ...item,
              valueProp,
              eventName,
              value: initialTransform ? initialTransform(value) : value,
              events: {
                [eventName]: (e: unknown) => {
                  context.emit("change", {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  });
                },
              },
            };
            result[newKey] = newItem;
          }
          return result;
        },
        {} as { [k in PropsKeys]: FormProps }
      )
    );

    return {
      finalProps,
    };
  },
});
</script>

<style>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.label {
  width: 28%;
}

.prop-component {
  width: 70%;
}
</style>

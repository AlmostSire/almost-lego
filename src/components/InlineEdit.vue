<template>
  <div class="inline-edit" @click.stop="handleClick" ref="wrapper">
    <input
      v-if="isEditing"
      v-model="innerValue"
      placeholder="文本不能为空"
      ref="inputRef"
    />
    <slot v-else :text="innerValue">
      <span>{{ innerValue }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from "vue";
import { useKeyPress } from "@/hooks/useKeyPress";
import { useClickOutside } from "@/hooks/useClickOutside";

const props = defineProps<{ value?: string }>();
const emit = defineEmits(["change"]);
const innerValue = ref(props.value);
watch(
  () => props.value,
  (newValue) => {
    innerValue.value = newValue;
  }
);
const wrapper = ref<null | HTMLElement>(null);
const inputRef = ref<HTMLInputElement>();
const isOutside = useClickOutside(wrapper);
let cacheOldValue: string | undefined;
const isEditing = ref(false);

useKeyPress("Enter", () => {
  if (isEditing.value) {
    isEditing.value = false;
    emit("change", innerValue.value);
  }
});

useKeyPress("Escape", () => {
  if (isEditing.value) {
    isEditing.value = false;
    innerValue.value = cacheOldValue;
    emit("change", cacheOldValue);
  }
});

watch(isOutside, (newValue) => {
  if (newValue && isEditing.value) {
    isEditing.value = false;
    emit("change", innerValue.value);
  }
});

watch(isEditing, async (isEditing) => {
  if (isEditing) {
    cacheOldValue = innerValue.value;
    await nextTick();
    if (inputRef.value) {
      inputRef.value.focus();
    }
  }
});

const handleClick = () => {
  isEditing.value = true;
  isOutside.value = false;
};
</script>

<style>
.inline-edit {
  cursor: pointer;
}
.inline-edit input {
  width: 100%;
}
.ant-input.input-error {
  border: 1px solid #f5222d;
}
.ant-input.input-error:focus {
  border-color: #f5222d;
}
.ant-input.input-error::placeholder {
  color: #f5222d;
}
</style>

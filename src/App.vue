<template>
  <div class="app-container">
    <a-spin v-if="showLoading" tip="读取中" class="global-spinner" />
    <RouterView></RouterView>
  </div>
</template>
<script setup lang="ts">
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";
import { message } from "ant-design-vue";
import { useRoute } from "vue-router";
const store = useStore<GlobalDataProps>();
const router = useRoute();
const isLoading = computed(() => store.getters.isLoading);
const showLoading = computed(
  () => isLoading.value && !router.meta.disableLoading
);

const error = computed(() => store.state.global.error);
watch(
  () => error.value.status,
  (errorValue) => {
    if (errorValue) {
      message.error(error.value.message || "未知错误", 2);
    }
  }
);
</script>
<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
.global-spinner {
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 300px;
  height: 300px;
  margin: auto;
}
</style>

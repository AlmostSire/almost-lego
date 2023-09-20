<template>
  <div class="content-container">
    <h1 v-if="isLoading">template is loading</h1>
    <template-list :list="templates"></template-list>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from "vue";
import TemplateList from "../components/TemplateList.vue";
import { useStore } from "vuex";
import { GlobalDataProps } from "@/store";

const store = useStore<GlobalDataProps>();
const isLoading = computed(() => store.getters.isOpLoading("fetchTemplates"));
const templates = computed(() => store.state.templates.data);
onMounted(() => {
  store.dispatch("fetchTemplates");
});
</script>

<style>
.page-title {
  color: #fff;
}
.content-container {
  background: #fff;
  padding: 0 24px 24px 30px;
  min-height: 85vh;
  max-width: 1200px;
  margin: 50px auto;
  width: 100%;
}
</style>

<template>
  <div class="mywork-container content-container">
    <a-row
      type="flex"
      justify="space-between"
      align="middle"
      class="poster-title"
    >
      <h2>我的作品和模版</h2>
    </a-row>
    <a-tabs @change="changeCategory">
      <a-tab-pane key="0" tab="我的作品"> </a-tab-pane>
      <a-tab-pane key="1" tab="我的模版"> </a-tab-pane>
    </a-tabs>
    <a-empty v-if="works.length === 0 && !isLoading">
      <template v-slot:description>
        <span> 还没有任何作品 </span>
      </template>
      <a-button type="primary" size="large"> 创建你的第一个设计 🎉 </a-button>
    </a-empty>

    <works-list
      :list="works"
      @on-delete="onDelete"
      @on-copy="onCopy"
      :loading="isLoading"
    >
    </works-list>
    <a-row type="flex" justify="space-between" align="middle">
      <a-pagination
        v-model:current="current"
        :total="total"
        v-model:pageSize="requestParams.pageSize"
        show-less-items
        @change="handlePageChange"
      />
      <!-- <a-button
        type="primary"
        size="large"
        @click="loadPrevPage"
        v-if="!isFirstPage"
        :loading="isLoading"
        >上一页</a-button
      >
      <a-button
        type="primary"
        size="large"
        @click="loadMorePage"
        v-if="!isLastPage"
        :loading="isLoading"
        >下一页</a-button
      > -->
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { GlobalDataProps } from "../store/index";
import WorksList from "../components/WorksList.vue";
import useLoadMore from "../hooks/useLoadMore";

const store = useStore<GlobalDataProps>();
const router = useRouter();
const works = computed(() => store.state.templates.works);
const total = computed(() => store.state.templates.totalWorks);
const isLoading = computed(() => store.getters.isOpLoading("fetchWorks"));

const { pageIndex, requestParams, goToPage } = useLoadMore(
  "fetchWorks",
  total,
  {
    pageIndex: 0,
    pageSize: 4,
    isTemplate: 0,
  }
);

const current = computed(() => pageIndex.value + 1);

onMounted(() => {
  store.dispatch("fetchWorks", { searchParams: requestParams });
});
const onDelete = (id: number) => {
  store.dispatch("deleteWork", id);
};
const onCopy = (id: number) => {
  store.dispatch("copyWork", id).then(({ data }) => {
    router.push(`/editor/${data.id}`);
  });
};
const changeCategory = (key: any) => {
  requestParams.pageIndex = 0;
  requestParams.isTemplate = key;
  nextTick(() => {
    store.dispatch("fetchWorks", { searchParams: requestParams });
  });
};
const handlePageChange = (page: number) => {
  goToPage(page - 1);
};
</script>

<style>
.mywork-container .ant-input-search {
  width: 30%;
}
.searchResult {
  display: flex;
  align-items: center;
}
#main-chart {
  position: relative;
}
.chart-loading {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>

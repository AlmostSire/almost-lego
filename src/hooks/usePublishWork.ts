import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { GlobalDataProps } from "@/store";
import { computed, ref } from "vue";
import { takeScreenshotAndUpload } from "@/helper";
import useSaveWork from "./useSaveWork";

const usePublishWork = () => {
  const route = useRoute();
  const currentWorkId = route.params.id;
  const store = useStore<GlobalDataProps>();
  const channels = computed(() => store.state.editor.channels);
  const isPublishing = ref(false);
  const { saveWork } = useSaveWork(true);

  const publishWork = async (el: HTMLElement) => {
    // 1 take screenshot and upload
    const resp = await takeScreenshotAndUpload(el);
    if (resp) {
      // 2 update page coverImg in store
      store.commit("updatePage", {
        key: "coverImg",
        value: resp.data.urls[0],
        isRoot: true,
      });
      // 3 save work
      await saveWork();

      // 4 publish work
      await store.dispatch("publishWork", {
        urlParams: { id: currentWorkId },
      });

      // 5 get channel list
      await store.dispatch("fetchChannels", {
        urlParams: { id: currentWorkId },
      });
      // if channels list length is 0, create a new channel
      if (channels.value.length === 0) {
        await store.dispatch("createChannel", {
          data: { name: "默认", workId: parseInt(currentWorkId as string) },
        });
      }
    }
  };

  return {
    publishWork,
    isPublishing,
  };
};

export default usePublishWork;

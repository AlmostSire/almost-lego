<template>
  <component
    :is="'img'"
    :style="styleProps"
    class="l-image-component"
    :src="src"
    @click.prevent="handleClick"
  />
</template>
<script lang="ts" set>
import { defineComponent } from "vue";
import { useComponentCommon } from "../hooks/useComponentCommon";
import {
  transformToComponentProps,
  imageDefaultProps,
  imageStylePropsNames,
} from "../defaultProps";
const defaultProps = transformToComponentProps(imageDefaultProps);

// array that contains style props
export default defineComponent({
  props: {
    ...defaultProps,
  },
  setup(props) {
    // 重用并且简化
    // 抽离并且获得 styleProps
    const { styleProps, handleClick } = useComponentCommon(
      props,
      imageStylePropsNames
    );
    return {
      styleProps,
      handleClick,
    };
  },
});
</script>

<style scoped>
.l-image-component {
  max-width: 100%;
  position: relative !important;
}
</style>

import { computed } from 'vue'
import { pick } from 'lodash-es'
import type { TextComponentProps } from '@/defaultProps'

const useComponentCommon = <T extends Readonly<Partial<TextComponentProps>>>(
  props: T,
  picks: string[]
) => {
  const styleProps = computed(() => pick(props, picks))

  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      console.log('click')
      //window.location.href = props.url
    }
  }

  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon

import { VNode } from "vue";

// const RenderVnode = defineComponent({
//   props: {
//     vNode: {
//       type: [Object, String],
//       required: true,
//     },
//   },
//   render() {
//     return this.vNode;
//   },
// });

interface RenderVnodeProps {
  vnode: VNode | string;
}
const RenderVnode = (props: RenderVnodeProps) => props.vnode;

export default RenderVnode;

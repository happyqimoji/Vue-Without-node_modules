const template = await $loadTemplate("components/icon/svg/index.html");
export default {
  name: 'iconSvg',
  template,
  props: {
    name: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '14px'
    },
    height: {
      type: String,
      default: '14px'
    }
  },
  setup(props) {
    const refSvgObject = ref(null);
    const svgData = ref('');
    const getSvg = async () => {
      await nextTick();
      if (!svgData.value) {
        const res = await axios.get(`./assets/images/svg/${props.name}.svg?v=${+new Date()}`)
        svgData.value = res.data
      }
      svgData.value = svgData.value.replace("<svg", `<svg style="width:${props.width} !important;height:${props.height} !important;" `)
        .replace("<path", `<path style="fill:${props.color} !important" `);
      refSvgObject.value.innerHTML = svgData.value
    }

    onMounted(async () => {
      await getSvg();
    })

    watch(() => props.color, async () => {
      await getSvg();
    }, {
      deep: true
    })
    return {
      refSvgObject
    }
  }
}
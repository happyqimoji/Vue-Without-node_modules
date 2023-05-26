const template = await $loadTemplate("components/layout/menu-item/index.html", "components/layout/menu-item/index.css")

export default {
  name: 'layoutMenuItem',
  template,
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },

  setup(props) {
    const configStore = inject('configStore');
    const themeColor = computed(() => configStore.config.themeColor);
    const route = useRoute();
    const activePath = computed(() => route.path);
    return {
      themeColor,
      activePath
    }
  }
}
const template = await $loadTemplate("components/layout/menu/index.html", "components/layout/menu/index.css")

export default {
  name: 'layoutMenu',
  template,
  components: {
    layoutMenuItem: $loadComponent("components/layout/menu-item/index.js")
  },
  setup() {
    const userStore = inject('userStore');
    const configStore = inject('configStore');
    const route = useRoute();
    const activePath = computed(() => route.path);
    const userMenu = computed(() => userStore.getUserInfo.menus);
    const collapse = computed(() => configStore.config.collapse);
    return {
      userMenu,
      activePath,
      collapse
    }
  }
}
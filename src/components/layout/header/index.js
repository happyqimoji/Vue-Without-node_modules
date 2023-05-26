const template = await $loadTemplate("components/layout/header/index.html", "components/layout/header/index.css")

export default {
  name: 'layoutHeader',
  template,
  components: {
    layoutHeaderLanguage: $loadComponent("components/layout/header/language/index.js"),
    layoutHeaderUser: $loadComponent("components/layout/header/user/index.js"),
    layoutHeaderMsg: $loadComponent("components/layout/header/msg/index.js"),
    layoutHeaderTheme: $loadComponent("components/layout/header/theme/index.js"),
  },
  setup() {
    const configStore = inject("configStore");

    const data = reactive({
      themeColor: computed(() => configStore.config.themeColor),
      collapse: computed(() => configStore.config.collapse),
    })

    const method = {
      collapse() {
        configStore.updateConfig("collapse", !data.collapse)
      }
    }

    return {
      data,
      method
    }
  }
}
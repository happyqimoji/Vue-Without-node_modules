const template = await $loadTemplate("components/layout/header/msg/index.html", "components/layout/header/msg/index.css");

export default {
  name: 'layoutHeaderMsg',
  template,
  setup() {
    const configStore = inject("configStore");
    const data = reactive({
      iconSize: configStore.config.headerRightIconSize,
      iconColor: configStore.config.headerRightIconColor
    })
    return {
      data
    }
  }
}
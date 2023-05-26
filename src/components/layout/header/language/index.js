import { locales } from "../../../../i18n/index.js"
const template = await $loadTemplate("components/layout/header/language/index.html")

export default {
  name: 'layoutHeaderLanguage',
  template,
  setup() {
    const configStore = inject("configStore");

    const data = reactive({
      locales,
      locale: computed(() => configStore.config.locale),
      iconSize: configStore.config.headerRightIconSize,
      iconColor: configStore.config.headerRightIconColor
    })
    const method = {
      changeLanguage(locale) {
        configStore.updateConfig('locale', locale);
        window.location.reload();
      }
    }

    return {
      data,
      method
    }
  }
}
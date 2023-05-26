const template = await $loadTemplate("views/app/index.html")

export default {
  template,

  setup() {
    const route = useRoute();
    const value = ref('')
    return {
      route,
      value
    }
  }
}
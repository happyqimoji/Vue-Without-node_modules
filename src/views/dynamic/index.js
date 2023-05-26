const template = await $loadTemplate("views/dynamic/index.html");

export default {
  template,
  setup() {
    const dynamicTo = inject("dynamicTo");
    return {
      addNav() {
        const id = +new Date();
        const name = `dynamic${id}`
        dynamicTo({
          path: `/${name}`,
          name,
          component: "views/app/index.js",
          meta: {
            title: `动态页签 - ${id}`,
            dynamic: true
          },
          query: {
            id
          }
        })
      }
    }
  }
}
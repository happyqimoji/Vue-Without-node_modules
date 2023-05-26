const template = await $loadTemplate("components/layout/header/user/index.html");

export default {
  name: 'layoutHeaderUser',
  template,
  setup() {
    const { UserFilled } = ElementPlusIconsVue;
    const configStore = inject("configStore");
    const userStore = inject("userStore");
    const navStore = inject("navStore");
    const router = useRouter();
    const data = reactive({
      UserFilled,
      iconSize: configStore.config.headerRightAvatarSize
    })
    const method = {
      async execCommand(cmd) {
        if (cmd === 'persionalInfo') {

        }
        if (cmd === 'signout') {
          await userStore.signout();
        }
      }
    }
    return {
      data,
      method
    }
  }
}
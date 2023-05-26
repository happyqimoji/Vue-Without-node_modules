const template = await $loadTemplate("views/login/index.html", "views/login/index.css", "viewLogin", ["core/echarts.5.4.2.min.js"]);
export default {
  template,
  setup() {
    const router = useRouter();
    const userStore = inject('userStore');

    const form = reactive({
      username: '',
      password: ''
    })

    return {
      form,
      async login() {
        userStore.updateUserInfo({ id: 'zhangsan', name: '张三' });
        await router.replace('/home');
      }
    }
  }
}
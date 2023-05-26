import { router, dynamicTo } from "../router/index.js";
import { useUserStore } from "../store/user.js";
import { useNavStore } from "../store/nav.js";
import { useConfigStore } from "../store/config.js";
import { localeMessages } from "../i18n/index.js";
import { request } from "../api/requst.js";

(async (window) => {
  const app = createApp({
    components: {
      layoutNav: $loadComponent("components/layout/nav/index.js"),
      layoutMenu: $loadComponent("components/layout/menu/index.js"),
      layoutHeader: $loadComponent("components/layout/header/index.js")
    },
    setup() {
      const userStore = useUserStore();
      const navStore = useNavStore();
      const configStore = useConfigStore();
      const route = useRoute();

      const locale = computed(() => localeMessages[configStore.config.locale].elementPlus);
      const showLayout = computed(() => userStore.getUserInfo?.id);
      const routerKey = computed(() => navStore.navInfo.refreshKeys.length && navStore.navInfo.refreshKeys.some(f => f.path === route.path) ?
        navStore.navInfo.refreshKeys.filter(f => f.path === route.path)[0].key + route.path : route.path);
      const collapse = computed(() => configStore.config.collapse)

      return {
        showLayout,
        routerKey,
        locale,
        collapse
      }
    }
  });

  window.$app = app;
  window.$router = router;//方便在setup外使用
  window.$routeValue = () => router.currentRoute.value;//方便在setup外使用
  window.$request = request;//全局请求方法 $request 只返回Promise.resolve没有reject 按需使用

  app.use(createPinia());
  app.use(router);
  app.use(ElementPlus, { size: 'base' });
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);//element图标
  }
  app.component("icon-svg", $loadComponent("components/icon/svg/index.js"));//svg图标 需要将svg资源拷贝至assets/images/svg目录下

  app.provide("userStore", useUserStore());//用户信息
  app.provide("configStore", useConfigStore());//配置信息
  app.provide("navStore", useNavStore());//页签信息
  app.provide("mitt", mitt());//事件总栈 https://www.npmjs.com/package/mitt
  app.provide("dynamicTo", dynamicTo);//动态路由导航

  await $loadI18n("global");//加载系统国际化资源 代码位置：src/js/template.js
  app.mount("#app");
})(window);
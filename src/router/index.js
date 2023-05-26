import { useUserStore, getUserSessionInfo } from "../store/user.js";
import { getNavsSession, useNavStore } from "../store/nav.js";
import { getConfigFromLocalStorage, useConfigStore } from "../store/config.js"
import { updateThemeColor } from "../components/layout/header/theme/index.js";

let hasReadLocalConfig = false;

export const routes = [
  { path: '/', name: 'login', component: $loadComponent("./views/login/index.js") },
]

export const router = VueRouter.createRouter({
  history: createWebHashHistory(),//不支持createWeHistory
  routes
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore();
  const configStore = useConfigStore();
  const userSessionInfo = getUserSessionInfo();

  if (!hasReadLocalConfig) {
    //读取配置信息
    const localConfig = getConfigFromLocalStorage();
    for (const [key, val] of Object.entries(localConfig)) {
      configStore.updateConfig(key, val)
    }
    hasReadLocalConfig = true;
    updateThemeColor(configStore.config.themeColor);
  }

  if (to.path !== '/') {
    if (!userSessionInfo) {
      next('/');
      return;
    }

    if (!userStore.getUserInfo.menus.length) {
      //获取用户菜单、注册路由
      userStore.updateUserInfo(userSessionInfo);
      await userStore.loadUserMenu(router);

      const allRoutes = router.getRoutes().filter(f => f.path !== "/");
      allRoutes.forEach(route => {
        router.removeRoute(route);
      });

      const navStore = useNavStore();
      const navsSessionInfo = getNavsSession();
      userStore.getUserInfo.routes.forEach(route => {
        Object.assign(route, { component: $loadComponent(route.component) })
        router.addRoute(route);
      })
      navsSessionInfo.forEach(nav => {
        if (nav?.meta?.dynamic) {
          const value = { ...nav, component: $loadComponent(nav.meta.dynamicComponent) }
          router.addRoute(value);
        }
        navStore.addNav(nav);
      })
      next({ ...to, replace: true });
      return
    }
    next(true);
  } else {
    userStore.removeUserInfo();
    next();
  }

  NProgress.done();
})

/**
 * 动态导航
 * @param {*} route 
 */
export const dynamicTo = (route) => {
  if (!router.hasRoute(route?.name)) {
    route.meta.dynamic = true;
    route.meta.dynamicComponent = route.component;
    Object.assign(route, { component: $loadComponent(route.component) });
    router.addRoute(route)
  }
  router.push(route);
}
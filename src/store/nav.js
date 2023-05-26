import { NewGuid } from "../core/lib.js";
const NAVS_SESSION_KEY = "nav.store";

export const saveNavsSession = (navs) => {
  sessionStorage.setItem(NAVS_SESSION_KEY, JSON.stringify(navs));
}

export const getNavsSession = () => {
  const value = sessionStorage.getItem(NAVS_SESSION_KEY);
  return value ? JSON.parse(value) : [];
}

export const useNavStore = defineStore('navStore', () => {

  let navInfo = reactive({
    navs: [],
    lastNav: null,
    refreshKeys: []
  });

  //添加页签
  const addNav = (route) => {
    const { path, name, meta, query } = route;
    const val = { path, name, meta, query }
    if (!navInfo.navs.some(s => s.path === path) && route.path !== '/') {
      navInfo.navs.push(val)
      navInfo.refreshKeys.push({ path, key: NewGuid() })
    }

    navInfo.navs = navInfo.navs.filter(f => f.meta.order).concat(navInfo.navs.filter(f => !f.meta.order))
    navInfo.lastNav = val;
    saveNavsSession(navInfo.navs);
  }

  //删除页签
  const removeNav = (nav) => {
    navInfo.refreshKeys.forEach(_nav => {
      if (nav.path === _nav.path) {
        _nav.key = NewGuid();
      }
    })
    const navIndex = navInfo.navs.findIndex(f => f.path === nav.path);
    navInfo.lastNav = navInfo.navs[navIndex + 1] || navInfo.navs[navIndex - 1];
    navInfo.navs = navInfo.navs.filter(f => f.path !== nav.path);
    saveNavsSession(navInfo.navs);
    return navInfo.lastNav;
  }

  /**
   * 刷新页面
   */
  const refreshRouterView = (path) => {
    navInfo.refreshKeys.forEach(nav => {
      if (nav.path === path) {
        nav.key = NewGuid();
      }
    })
  }

  /**
   * 关闭其他页签
   */
  const closeOtherNav = () => {
    navInfo.navs.filter(f => f.path !== navInfo.lastNav.path).forEach(nav => {
      removeNav(nav);
    })
  }

  /**
   * 关闭全部页签
   */
  const closeAllNav = () => {
    navInfo.navs.forEach(nav => {
      removeNav(nav);
    })
    navInfo.refreshKeys = []
  }

  return {
    navInfo,
    addNav,
    removeNav,
    refreshRouterView,
    closeOtherNav,
    closeAllNav
  }
})
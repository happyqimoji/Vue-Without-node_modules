import { flatArray } from "../core/lib.js";
import { useNavStore } from "./nav.js";

const USER_SESSION_KEY = 'store.user';


/**
 * 保存用户信息
 * @param {*} val 
 */
export const saveUserSessionInfo = (val) => {
  sessionStorage.setItem(USER_SESSION_KEY, CryptoJS.AES.encrypt(JSON.stringify(val || {}), USER_SESSION_KEY));
}

/**
 * 获取用户信息
 */
export const getUserSessionInfo = () => {
  let val = sessionStorage.getItem(USER_SESSION_KEY);
  if (!val) return null;
  val = CryptoJS.AES.decrypt(val, USER_SESSION_KEY).toString(CryptoJS.enc.Utf8);
  return JSON.parse(val);
}

/**
 * 删除用户信息
 */
export const removeUserSessionInfo = () => {
  sessionStorage.removeItem(USER_SESSION_KEY);
}

export const useUserStore = defineStore('userStore', () => {
  const userInfo = reactive({
    id: '',
    name: '',
    menus: [],//菜单信息
    routes: [],//路由信息
  });

  /**
   * 更新用户信息
   * @param {*} val 
   */
  const updateUserInfo = (val) => {
    Object.keys(val).forEach(key => {
      userInfo[key] = val[key];
    });
    saveUserSessionInfo(userInfo);
  }

  const getUserInfo = computed(() => userInfo);

  /**
   * 删除用户信息
   */
  const removeUserInfo = () => {
    Object.keys(userInfo).forEach(key => {
      const val = userInfo[key];
      if (Array.isArray(val)) {
        userInfo[key] = [];
      } else if (typeof val === 'object') {
        userInfo[key] = {};
      } else {
        userInfo[key] = ''
      }
    });
    removeUserSessionInfo();
  }

  /**
   * 获取菜单和路由信息
   */
  const loadUserMenu = async () => {
    //模拟后端请求
    const res = await $request({ url: `${$const.SERVER_URL}/store/${userInfo.id}.json` });
    if (res.isSuccess) {
      userInfo.menus = res.data;
      userInfo.routes = flatArray(res.data).filter(f => f.path);
      updateUserInfo(userInfo);
    }
  }

  /**
   * 退出登录
   */
  const signout = async () => {
    // await $request(``);
    const navStore = useNavStore();
    removeUserInfo();
    navStore.closeAllNav();
    $router.replace("/");
  }

  return {
    getUserInfo,
    updateUserInfo,
    removeUserInfo,
    loadUserMenu,
    signout
  }
});
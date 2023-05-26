export const LOCAL_LOCALE_KEY = 'store.config';

export const _defaultConfig = {
  locale: 'zh-cn',//语言

  headerRightIconSize: 18,//顶部右上角图标大小
  headerRightAvatarSize: 24,//顶部右上角头像大小
  headerRightIconColor: '#606266',//顶部右上角图标颜色

  themeColor: '#b8860b',//主题色

  collapse: false// 展开/折叠菜单
}

/**
 * 将配置信息保存到本地缓存
 * @param {*} val 
 */
export const saveConfigToLocalStorage = (val) => {
  localStorage.setItem(LOCAL_LOCALE_KEY, val && typeof (val) === 'object' ? JSON.stringify(val) : '');
}

/**
 * 获取本地缓存中的配置信息
 * @returns 
 */
export const getConfigFromLocalStorage = () => {
  const val = localStorage.getItem(LOCAL_LOCALE_KEY);
  return val ? JSON.parse(val) : _defaultConfig
}

export const useConfigStore = defineStore('configStore', () => {

  const config = reactive(_defaultConfig)

  const updateConfig = (key, val) => {
    config[key] = val;
    saveConfigToLocalStorage(config);
  }


  return {
    config,
    updateConfig
  }
})
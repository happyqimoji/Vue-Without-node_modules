((window) => {
  NProgress.configure({ showSpinner: false });//进度条全局配置

  [Vue, VueRouter, Pinia, VueI18n].forEach(_class => {
    //将常用库的方法全局引入（懒人使用）
    //Vue正常使用demo：const {ref,reactive,...} = Vue
    //VueRouter正常使用demo：const {useRoute,useRouter,...} = VueRouter
    //Pinia正常使用demo：const {defineStore,...} = Pinia
    //VueI18n正常使用demo：const {createI18n,...} = VueI18n
    Object.keys(_class).forEach(key => {
      window[key] = _class[key];
    })
  })
  
  const host = location.host;
  if (!["localhost", "127.0.0.1"].some(s => host.includes(s))) {
    //发布后禁止控制台输出信息
    window.console = (() => {
      var c = {};
      c.log = c.warn = c.debug = c.info = c.error = c.time = c.dir = c.profile = c.clear = c.exception = c.trace = c.assert = () => { };
      return c;
    })();
  }

})(window)
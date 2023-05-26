/**
 * 常量文件
 */
((window) => {
  window.$const = window.$const || {
    ENV: 'dev',//环境区分 dev：开发环境 prod：生产环境

    HOST: `${document.location.protocol}//${location.host}`,

    SERVER_URL: `${location.href.split(`/index.html`)[0]}`,
  }
  console.log('$const.ENV', $const.ENV)
})(window);
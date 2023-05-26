((window) => {
  const $loadComponent = (file) => {
    const url = `${window.$const.SERVER_URL}/${file}`;
    return defineAsyncComponent({
      loader: () => import(url)
    });
  }
  window.$loadComponent = window.$loadComponent || $loadComponent;
})(window);
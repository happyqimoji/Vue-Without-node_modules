import { i18n } from "../i18n/index.js"
import { getConfigFromLocalStorage } from "../store/config.js";

((window) => {

  const loadCSS = async (file) => {
    if (!file) return '';
    const url = `${window.$const.SERVER_URL}/${file}`;
    const res = await axios.get(url);
    const css = res.data;

    let styleTag = document.getElementById(file);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.setAttribute("type", "text/css");
      styleTag.setAttribute("id", file);
      styleTag.innerText = css;
      document.head.appendChild(styleTag);
    } else {
      styleTag.innerText = css;
    }
    return css;
  }

  const isBase64 = (str) => {
    if (str === '' || str.trim() === '') {
      return false;
    }
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  const decrypt = (value) => {
    const bytes = CryptoJS.AES.decrypt(value, "system")
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  const loadI18n = async (file) => {
    if (!file) return;
    const locale = getConfigFromLocalStorage().locale;
    const url = `${window.$const.SERVER_URL}/i18n/${locale}/${file}.json?v=${+new Date()}`;
    const result = await axios.get(url);
    i18n(window.$app, [{ key: file, value: result.data, locale }]);
  }

  const loadJS = async (jsFile) => {
    if (jsFile && jsFile.length) {
      const tasks = jsFile.map(async m => {
        if (!document.getElementById(m)) {
          const res = await axios.get(`${window.$const.SERVER_URL}/${m}?v=${+new Date()}`);
          const script = document.createElement("script");
          script.type = "module";
          script.id = m;
          script.innerHTML = res?.data || '';
          document.body.appendChild(script);
        }
        return Promise.resolve();
      })

      return await Promise.all(tasks);
    }
    return Promise.resolve();
  }

  const loadHtml = async (htmlFile) => {
    if (!htmlFile) return '';
    const url = `${window.$const.SERVER_URL}/${htmlFile}`;
    const res = await axios.get(url);
    return (isBase64(res.data) ? decrypt(res.data) : res.data);
  }

  /**
   * 加载模板
   * @param {*} htmlFile html文件 必传参数
   * @param {*} cssFile css文件 可选参数
   * @param {*} i18nFile 国际化文件 可选参数
   * @param {*} thirdJSFile 第三方库文件 可选参数
   * @returns 
   */
  const loadTemplate = async (htmlFile, cssFile, i18nFile, thirdJSFile = []) => {
    await loadCSS(cssFile);
    await loadI18n(i18nFile);
    await loadJS(thirdJSFile);
    return await loadHtml(htmlFile);
  }

  window.$loadTemplate = window.$loadTemplate || loadTemplate;

  window.$loadI18n = window.$loadI18n || loadI18n;

})(window);
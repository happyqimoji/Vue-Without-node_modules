const template = await $loadTemplate("components/layout/header/theme/index.html", "components/layout/header/theme/index.css");

/**
 * 修改主题色
 * @param {*} e 
 * @returns 
 */
export const updateThemeColor = (e) => {
  if (!e) return;
  const mix = (color1, color2, weight) => {
    weight = Math.max(Math.min(Number(weight), 1), 0);
    let r1 = parseInt(color1.substring(1, 3), 16);
    let g1 = parseInt(color1.substring(3, 5), 16);
    let b1 = parseInt(color1.substring(5, 7), 16);
    let r2 = parseInt(color2.substring(1, 3), 16);
    let g2 = parseInt(color2.substring(3, 5), 16);
    let b2 = parseInt(color2.substring(5, 7), 16);
    let r = Math.round(r1 * (1 - weight) + r2 * weight);
    let g = Math.round(g1 * (1 - weight) + g2 * weight);
    let b = Math.round(b1 * (1 - weight) + b2 * weight);
    r = ("0" + (r || 0).toString(16)).slice(-2);
    g = ("0" + (g || 0).toString(16)).slice(-2);
    b = ("0" + (b || 0).toString(16)).slice(-2);
    return "#" + r + g + b;
  };

  const pre = "--el-color-primary";
  const mixWhite = "#ffffff";// 白色混合色
  const mixBlack = "#000000";// 黑色混合色
  const el = document.documentElement;
  el.style.setProperty(pre, e);
  el.style.setProperty("--el-color-primary-dark", mix(e, mixBlack, 0.1));
  el.style.setProperty("--el-color-primary-dark-2", e);
  el.style.setProperty("--el-color-danger", "#e34d59")
  el.style.setProperty("--el-color-success", "#00a870")
  el.style.setProperty("--el-color-warning", "#ed7b2f")
  for (let i = 1; i < 10; i += 1) {
    el.style.setProperty(`${pre}-light-${i}`, mix(e, mixWhite, i * 0.1));
  }

}

export default {
  name: "layoutHeaderTheme",
  template,
  setup() {
    const configStore = inject("configStore");

    const data = reactive({
      iconSize: configStore.config.headerRightIconSize,
      iconColor: configStore.config.headerRightIconColor,
      themeColor: configStore.config.themeColor,
      predefineColors: [
        '#409EFF',//天蓝色
        '#39cccc',//蓝绿色
        '#3D9970',//橄榄绿
        '#b8860b',//黄色
        '#FF851B',//橙红色
        '#FF4136',//红色
        '#85144B',//褐红色 
        '#B10DC9',//紫色
        '#606266',//灰色
      ]
    })

    const method = {
      changeTheme(val) {
        updateThemeColor(val);
        configStore && configStore.updateConfig("themeColor", val);
      }
    }
    return {
      data,
      method
    }
  }
}
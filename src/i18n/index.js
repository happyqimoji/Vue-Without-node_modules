/**
 * 国际化
 * in javascript:
 * setup() {
    const { t } = useI18n();
    t && console.log('t', t("字段"))
    return {
      t
    }
  }
 */
import { useConfigStore, _defaultConfig } from "../store/config.js";

export const locales = [{ key: 'zh-cn', value: '简体中文' }, { key: 'en', value: 'English' }, { key: 'zh-tw', value: '繁体中文' }];

export const localeMessages = {
  'zh-cn': {
    elementPlus: ElementPlusLocaleZhCn,//elementPlus国际化
    system: {}//项目国际化
  },
  'zh-tw': {
    elementPlus: ElementPlusLocaleZhTw,
    system: {}
  },
  'en': {
    elementPlus: ElementPlusLocaleEn,
    system: {}
  }
}

export const i18n = (app, i18nMessages = []) => {
  const configStore = useConfigStore();
  i18nMessages.forEach(val => {
    localeMessages[val.locale].system[val.key] = val.value;
  })

  const config = {
    legacy: false,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false,
    locale: configStore.config.locale,
    fallbackLocale: _defaultConfig.locale,
    messages: localeMessages
  }

  const val = createI18n(config);
  app.use(val);
  return val;
}
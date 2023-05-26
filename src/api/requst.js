import { useConfigStore } from "../store/config.js"

const service = axios.create({
  baseURL: '',
})

service.interceptors.request.use(
  (config) => {
    const configStore = useConfigStore();
    const language = configStore.config.locale;
    config.headers['language'] = language;
    return config;
  },
  (err) => {
    return Promise.reject({ isSuccess: false, msg: err.message, source: 'error from http.interceptors.request.use=>err handler' })
  }
)


service.interceptors.response.use(response => {
  //这只是一个框架 详细逻辑请自行补充
  if (response.status === 200) {
    return Promise.resolve({ isSuccess: true, data: response.data });
  }
  return Promise.reject({ isSuccess: false, response, source: 'error from http.interceptors.response.use=>response handler' });
}, err => {
  return Promise.reject({ isSuccess: false, source: 'error from http.interceptors.response.use=>err handler', err });
})

export const request = (config) => new Promise((resolve) => {
  service(config).then(res => { resolve(res) }, err => { resolve(err) })
});
# Vue Without node_modules

## 开发环境搭建
1. 开发工具：vscode
2. 在vscode中安装Live Server插件
3. 安装node环境，推荐使用nvm安装多版本，需要安装16及以上的版本
4. 安装全局依赖（如果不需要代码混淆、sass命令自动生成css文件，可以不安装）
```javascript
npm install javascript-obfuscator -g //打包发布时，混淆javascript代码
npm install sass -g //实时生成、更新css文件
```

## 项目结构
    	src
    		api 请求封装
    		assets 静态资源
    		components 组件
    		core 第三方库文件
    		css 第三方库样式和
    			main.css 主界面布局样式
    			variables.css 全局覆盖样式
    		i18n 国际化
    			en English
    			zh-cn 简体中文
    			zh-tw 繁体中文
    		js 核心文件
    			component.js 封装异步加载组件的方法
    			const.js 常量
    			global.js 全局方法和配置
    			main.js 程序入口
    			template.js 封装加载模板的方法
    		router 路由
    		store 数据存储
    		views 页面
    		index.html 程序入口

## 启动程序
1. `npm run sass` 如果您不想使用sass来自动生成css文件，可以跳过此步骤。
2. 找到src/index.html文件，鼠标右键“Open with Live Server”

# 如何开发一个页面
假设开发一个登录页面，首先在“src/views”下新建一个login文件夹，然后在“login”文件夹下面建3个文件分别是“index.html”、“index.css”、“index.js”。

index.html代码：
```html
<div class="cw-view-login">
  <div class="cw-view-login_formwapper" label-width="120px">
    <el-form :form="form">
      <el-form-item :label="$t('system.viewLogin.username')">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item :label="$t('system.viewLogin.password')">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="login">{{$t("system.viewLogin.loginButton")}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
```

index.css代码：
```css
.cw-view-login{width:100%;height:100%;display:flex;align-items:center;justify-content:center}.cw-view-login_formwapper{background-color:#fff;border-radius:8px;box-shadow:var(--el-box-shadow);padding:20px 50px}

```

index.js代码：
```javascript
const template = await $loadTemplate("views/login/index.html", "views/login/index.css", "viewLogin", ["core/echarts.5.4.2.min.js"]);
export default {
  template,
  setup() {
    const router = useRouter();
    const userStore = inject('userStore');

    const form = reactive({
      username: '',
      password: ''
    })

    return {
      form,
      async login() {
        userStore.updateUserInfo({ id: 'zhangsan', name: '张三' });
        await router.replace('/home');
      }
    }
  }
}
```
# 封装在window对象下的全局方法
## async $loadTemplate(htmlFile, cssFile, i18nFile, thirdJSFile = [])：按需加载页面
|  参数名 | 说明  |
| ------------ | ------------ |
|  htmlFile |  当前页面模板文件路径，必填参数 |
|  cssFile |  当前页面样式文件路径，可选参数 |
|  i18nFile |  当前页面国际化配置文件路径，可选参数 |
|  thirdJSFile |  当前页面需要使用到的其他三方文件，需要提前下载好放到代码工程里面，可选参数 |
## $loadComponent(file)：异步加载自定义组件
|  参数名 | 说明  |
| ------------ | ------------ |
| file | 组件文件路径 |
## $request：发送请求
## $router：路由实例，方便在setup外使用，在setup内任然使用“useRouter()”
## $routeValue()：当前路由信息，方便在setup外使用，在setup内任然使用“useRoute()”
# 以下常用的方法也挂载到window对象下了，减少代码量，这种方法只适合懒人
```javascript
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
```
# 打包发布
## 源代码发布
可以直接将src下的工程代码拷贝至服务器即可运行
## 混淆、加密后发布
1. 运行命令`npm run build.prod` 或者 `node build.prod`,然后将dist目录下的资源拷贝至服务器即可运行。
2. 若要发布多环境，可以创建“build.环境.js”代码文件，拷贝“build.prod.js”文件中的代码，稍加修改即可。

# 开源协议
MIT

# 联系我
QQ联系方式：313649063
微信联系方式：jy313649063

# 求推荐、打赏

|  微信 |  支付宝 |
| ------------ | ------------ |
| ![](http://system.es-it.cn/websolution/h5/wx.png)  |  ![](http://system.es-it.cn/websolution/h5/zfb.png) |


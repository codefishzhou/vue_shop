import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'　
import ElementUI from 'element-ui'　　　　
import 'element-ui/lib/theme-chalk/index.css'　
import axios from 'axios'
import './assets/fonts/iconfont.css'
import './assets/css/global.css'

　
Vue.use(ElementUI);

//配置请求更路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //修改请求头携带token
axios.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    // 将axios挂载到vue的实列对象上

Vue.prototype.$http = axios;


Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)

}).$mount('#app')
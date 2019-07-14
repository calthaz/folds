import Vue from 'vue'
//import VeeValidate from 'vee-validate';
import './plugins/vuetify'
import App from './App.vue'
import {router} from './router'
//console.log('breakpoint');
import {store} from './store/index.js'
import {apiUrl} from './helpers/api-config'

Vue.config.productionTip = false

//Vue.use(VeeValidate);
Vue.prototype.$hostname = apiUrl;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

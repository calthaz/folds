import Vue from 'vue'
import VeeValidate from 'vee-validate';
import App from './App.vue'
import {router} from './router'
//console.log('breakpoint');
import {store} from './store/index.js'

Vue.config.productionTip = false

Vue.use(VeeValidate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#9c27b0',
    secondary: '#2196f3',
    accent: '#00bcd4',
    error: '#f44336',
    warning: '#ff9800',
    info: '#607d8b',
    success: '#4caf50'
    }
})

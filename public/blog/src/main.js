import Vue from 'vue'
import App from './App'
import ajax from './ajax'

/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App }
})

ajax()


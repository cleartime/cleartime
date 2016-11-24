import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import configRouter from './routers';
import { timeToNow, timeToUpdata } from './filters';
import store from './vuex/store';

Vue.filter('timeToNow', timeToNow);
Vue.filter('timeToUpdata', timeToUpdata);

Vue.use(VueRouter);

const router = new VueRouter(configRouter);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
/* eslint-enable no-new */

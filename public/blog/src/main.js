import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
// import configRouter from './routers';
import { timeToNow, timeToUpdata } from './filters';
// import { fetchMsgCount } from './vuex/actions';
// import { getToken } from './vuex/getters';
import store from './vuex/store';

Vue.filter('timeToNow', timeToNow);
Vue.filter('timeToUpdata', timeToUpdata);

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: require('./views/page'),
      meta: {
        isindex: true,
      },
    },
    {
      path: '/welcome',
      component: require('./views/welcome'),
      meta: {
        isWelcome: true,
      },
    },
    {
      path: '/post',
      component: require('./views/post'),
      meta: {
        isPost: true,
      },
    },
    {
      path: '/me',
      component: require('./views/me'),
      meta: {
        isMe: true,
      },
    },
  ],
});

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
/* eslint-enable no-new */

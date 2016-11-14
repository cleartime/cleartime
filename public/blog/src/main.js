import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
// import configRouter from './routers';
import { timeToNow, comment, timeToUpdata } from './filters';
// import { fetchMsgCount } from './vuex/actions';
// import { getToken } from './vuex/getters';
import store from './vuex/store';

Vue.filter('timeToNow', timeToNow);
Vue.filter('comment', comment);
Vue.filter('timeToUpdata', timeToUpdata);

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/index',
      component: require('./views/page'),
      meta: {
        isindex: true,
      },
    },
    {
      path: '/welcome',
      component: require('./views/welcome'),
      meta: {
        isPost: true,
      },
    },
    {
      path: '/post/:id',
      component: require('./views/post'),
      meta: {
        isWelcome: true,
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

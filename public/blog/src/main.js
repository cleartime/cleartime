import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import configRouter from './routers';
import { timeToNow, comment, timeToUpdata } from './filters';
import { fetchMsgCount } from './vuex/actions';
import { getToken } from './vuex/getters';
import store from './vuex/store';

Vue.filter('timeToNow', timeToNow);
Vue.filter('comment', comment);
Vue.filter('timeToUpdata', timeToUpdata);

Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
});


configRouter(router);
router.beforeEach((transition) => {
  document.body.scrollTop = 0;
  const token = getToken(store.state);
  if (token) {
    fetchMsgCount(store, token)
    /* eslint-disable no-console */
      .catch((e) => console.log(e));
    /* eslint-enable no-console */
  }
  if (transition.to.auth) {
    if (token) {
      transition.next();
    } else {
      const redirect = encodeURIComponent(transition.to.path);
      transition.redirect({ name: 'login', query: { redirect } });
    }
  } else {
    transition.next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  template: Vue.extend(App),
});
/* eslint-enable no-new */

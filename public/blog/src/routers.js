export default {
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
};

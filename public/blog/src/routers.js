var router = new VueRouter({ // eslint-disable-line no-var
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
  ]
});

export default (router) => router;

export default (router) => router.map({
  '/': {
    name: 'index',
    component: require('./views/page'),
    meta: {
      isindex: true
    },
  },
  '/welcome': {
    name: 'welcome',
    component: require('./views/welcome'),
    meta: {
      isWelcome: true
    },
  },
  '/post/:id': {
    name: 'post',
    component: require('./views/post'),
    meta: {
      isPost: true
    },
  },
  '/me': {
    name: 'me',
    component: require('./views/me'),
    meta: {
      isMe: true
    },
  },
});


export default (router) => router.map({
  '/': {
    name: 'index',
    component: require('./views/page'),
  },
  '/welcome': {
    name: 'welcome',
    component: require('./views/welcome'),
  },
  '/tab/:categoryId/:recommend': {
    name: 'tabA',
    component: require('./views/page'),
  },
  '/tab/:recommend': {
    name: 'tabB',
    component: require('./views/page'),
  },
  '/post/:id/:fileId': {
    name: 'post',
    component: require('./views/post'),
  },
  '/me': {
    name: 'me',
    component: require('./views/me'),
  },
  '*': {
    component: require('./views/404'),
  },
});


import Vuex from 'vuex';
import Vue from 'vue';
import middlewares from './middlewares';

Vue.use(Vuex);

/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */

const state = {
  isShowWelcome: true,
  commentsInfo: '',
  comments: [],
  listname: {
    name: '欢迎来到我的博客',
    id: '',
    index: 0,
  },
  webinfo: '',
  friendLink: '',
  me: '',
  image: '',
  recommend: [],
  topicTabs: [],
  topicLists: [],
  currentTab: '',
  currentPage: '',
  topic: '',
  isSearch: false,
  hint: {
    show: false,
    colorRed: false,
    info: '正在加载中...',
  },
  fileId: '',
};

const mutations = {
  // 获取推荐位成功
  FETCH_RECOMMEND_SUCCESS(state, recommend, topicTab, page) {
    state.hint.show = false;
    state.recommend = recommend;
    state.currentTab = topicTab;
    state.currentPage = page;
  },
  // 获取文章列表成功
  FETCH_TOPIC_LISTS_SUCCESS(state, topicLists, topicTab, page, isSearch) {
    state.hint.show = false;
    state.topicLists = topicLists;
    state.currentTab = topicTab;
    state.currentPage = page;
    state.isSearch = isSearch || false;
  },
  // 获取文章列表失败
  FETCH_TOPIC_LISTS_FAILURE(state, topicTab, page) {
    state.showWelcome = true;
    state.hint = {
      show: true,
      info: '获取文章列表失败',
      colorRed: true,
    };
    state.currentTab = topicTab;
    state.currentPage = page;
  },
  // 获取某一文章成功
  FETCH_TOPIC_SUCCESS(state, topic) {
    state.fileId = topic.fileId;
    state.hint.show = false;
    state.topic = topic;
    state.topic.content = decodeURIComponent(state.topic.content);
  },
  // 获取图片成功
  FETCH_IMG_SUCCESS(state, img) {
    if (img === undefined) {
      state.image.url = 'http://pic.qiantucdn.com/58pic/15/36/43/60d58PICgBI_1024.jpg';
      state.image.name = '只有正直的人才能读取到';
    } else {
      state.image = img;
    }
  },
  // 获取图片失败
  FETCH_IMG_FAILURE(state) {
    state.image.url = 'http://pic.qiantucdn.com/58pic/15/36/43/60d58PICgBI_1024.jpg';
    state.image.name = '只有正直的人才能读取到';
  },
  // 获取文章失败
  FETCH_TOPIC_FAILURE(state) {
    state.hint = {
      show: true,
      info: '获取文章内容失败',
      colorRed: true,
    };
  },
  // 获取文章评论成功
  FETCH_COMMENTS_SUCCESS(state, comments) {
    state.comments = comments;
  },
  // 获取文章评论失败
  FETCH_COMMENTS_FAILURE(state) {
    state.comments = [];
  },
  // 设置文章评论成功
  SET_COMMENTS_SUCCESS(state, data, nickname, email, content, articleId, fid) {
    const newComments = {
      objectId: data.objectId,
      updatedAt: data.createdAt,
      nickname,
      email,
      content,
      articleId,
      fid,
    };
    /* eslint-disable brace-style */
    if (typeof(Storage) !== 'undefined')
    {
      localStorage.nickname = newComments.nickname;
      localStorage.email = newComments.email;
    }
    /* eslint-enable brace-style */
    state.comments.push(newComments);
    state.commentsInfo = '评论成功';
  },
  // 设置文章评论失败
  SET_COMMENTS_FAILURE(state) {
    state.commentsInfo = '评论失败';
  },
  // 获取用户信息成功
  FETCH_USER_SUCCESS(state, info) {
    state.hint.show = false;
    state.user = info;
  },
  // 获取用户信息失败
  FETCH_USER_FAILURE(state) {
    state.hint = {
      show: true,
      info: '获取用户信息失败',
      colorRed: true,
    };
  },
  // 获取SEO
  FETCH_WEBINFO_SUCCESS(state, data) {
    state.webinfo = data;
  },
  // 获取我的信息
  FETCH_ME_SUCCESS(state, data) {
    state.me = data;
  },
  // 获取友情链接
  FETCH_FRIEND_SUCCESS(state, data) {
    state.friendLink = data;
  },

  // 初始化hint
  INIT_HINT(state, topicTabs) {
    state.topicTabs = topicTabs;
    state.hint.show = false;
    state.hint.colorRed = false;
    state.hint.info = '正在加载中...';
  },
  // 显示hint
  SHOW_HINT(state) {
    state.hint.show = true;
  },
  // 显示标题
  LIST_NAME(state, listname, index) {
    state.listname.name = !index ? '欢迎来到我的博客' : listname.name;
    state.listname.id = listname.categoryID;
    state.listname.index = index;
  },
  // 是否显示欢迎页
  SHOW_WELCOME() {
    state.isShowWelcome = false;
  },
};

/* eslint-disable no-new */
export default new Vuex.Store({
  state,
  mutations,
  strict: process.env.NODE_ENV !== 'production',
  middlewares,
});

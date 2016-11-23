import 'whatwg-fetch';
import config from '../config';
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable arrow-body-style */

/**
 * 字符串序列化
 * @param obj
 * @returns {string}
 */
const transformRequest = (obj) => {
  const str = [];
  for (const p of Object.keys(obj)) {
    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
  }
  return str.join('&');
};


/**
 * get请求
 * @param  {String} options.url   api地址
 * @param  {String} options.query query参数
 * @return {Promise}               Promise
 */
const _get = (url, query) => {
  let _url;
  if (query) {
    _url = `${config}${url}?${transformRequest(query)}`;
  } else {
    _url = `${config}${url}`;
  }
  return fetch(_url)
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return res.json();
      }
      return Promise.reject(new Error(res.status));
    });
};


/**
 * post请求
 * @param  {String} url    api地址
 * @param  {Object} params 包含post内容的object
 * @return {Promise}        Promise
 */
const _post = (url, params) => {
  return fetch(`${config}${url}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    },
    body: transformRequest(params),
  })
  .then((res) => {
    if (res.status >= 200 && res.status < 300) {
      return res.json();
    }
    return Promise.reject(new Error(res.status));
  });
};

/**
 * 初始化提示
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const initHint = ({ dispatch }) => dispatch('INIT_HINT');

/**
 * 显示提示
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const showHint = ({ dispatch }) => dispatch('SHOW_HINT');

/**
 * 设置点击列表名称
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 */
export const listName = ({ dispatch }, name, index) => dispatch('LIST_NAME', name, index);


/**
 * 获取所有推荐位
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} topicTab         主题分类
 * @param  {Number} page             页数
 * @return {Promise}                  Promise
 */
export const getRecommend = ({ dispatch }) => {
  const url = '/recommend';
  return _get(url)
    .then((json) => {
      if (json.code === 200) {
        return dispatch('FETCH_RECOMMEND_SUCCESS', json.data);
      }
      return Promise.reject(json.msg);
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_LISTS_FAILURE');
      return Promise.reject(error);
    });
};

/**
 * 获取单个推荐位文章列表
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} topicTab         主题分类
 * @param  {Number} page             页数
 * @return {Promise}                  Promise
 */
export const getRecommendOne = ({ dispatch }, recommend) => {
  const url = '/article/queryRecommend';
  const params = { recommend };
  return _get(url, params)
    .then((json) => {
      if (json.code === 200) {
        return dispatch('FETCH_TOPIC_LISTS_SUCCESS', json.data);
      }
      return Promise.reject(json.msg);
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_LISTS_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取所有栏目
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} topicTab         主题分类
 * @param  {Number} page             页数
 * @return {Promise}                  Promise
 */
export const loginSuccuess = ({ dispatch }) => {
  const url = '/category';
  return _get(url)
    .then((json) => {
      if (json.code === 200) {
        const all = {
          name: '全部',
        };
        json.data.unshift(all);
        return dispatch('INIT_HINT', json.data);
      }
      return Promise.reject(json.msg);
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_LISTS_FAILURE');
      return Promise.reject(error);
    });
};

/**
 * 获取单个栏目文章列表
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} topicTab         主题分类
 * @param  {Number} page             页数
 * @return {Promise}                  Promise
 */
export const fetchCategoryicLists = ({ dispatch }, categoryId) => {
  const url = '/article/queryCategory';
  const params = { categoryId };
  return _get(url, params)
    .then((json) => {
      if (json.code === 200) {
        return dispatch('FETCH_TOPIC_LISTS_SUCCESS', json.data);
      }
      return Promise.reject(json.msg);
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_LISTS_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取所有文章列表
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} topicTab         主题分类
 * @param  {Number} page             页数
 * @return {Promise}                  Promise
 */
export const fetchTopicLists = ({ dispatch }) => {
  const url = '/article';
  return _get(url)
    .then((json) => {
      if (json.code === 200) {
        return dispatch('FETCH_TOPIC_LISTS_SUCCESS', json.data);
      }
      return Promise.reject(new Error('fetchTopicLists failure'));
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_LISTS_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取某一文章
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const fetchTopic = ({ dispatch }, objectId) => {
  const url = '/article/query';
  const params = { objectId };
  return _get(url, params)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_TOPIC_SUCCESS', json.data);
        return json.data;
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取某一文章图片
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const fetchImg = ({ dispatch }, objectId) => {
  const url = '/upload/query';
  const params = { objectId };
  return _get(url, params)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_IMG_SUCCESS', json.data[0]);
        return json.data[0];
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_IMG_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取某一文章评论
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const fetchComments = ({ dispatch }, objectId) => {
  const url = '/comments/query';
  const params = { objectId };
  return _get(url, params)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_COMMENTS_SUCCESS', json.data);
        return json.data[0];
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_COMMENTS_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 评论某一文章
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const setComments = ({ dispatch }, nickname, email, content, articleId, fid, fnickname, femail) => {
  const url = '/comments';
  const params = { nickname, email, content, articleId, fid, fnickname, femail };
  return _post(url, params)
    .then((json) => {
      if (json.code === 200) {
        dispatch('SET_COMMENTS_SUCCESS', json.data, nickname, email, content, articleId, fid);
        return json.data;
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('SET_COMMENTS_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取我的资料
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const fetchMe = ({ dispatch }) => {
  const url = '/information';
  return _get(url)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_ME_SUCCESS', json.data[0]);
        return json.data[0];
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 获取友情链接
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const fetFriendLink = ({ dispatch }) => {
  const url = '/linkfriend';
  return _get(url)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_FRIEND_SUCCESS', json.data);
        return json.data;
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_FAILURE');
      return Promise.reject(error);
    });
};

/**
 * 获取sel
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const fetSEO = ({ dispatch }) => {
  const url = '/webinfo';
  return _get(url)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_WEBINFO_SUCCESS', json.data);
        return json.data;
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_FAILURE');
      return Promise.reject(error);
    });
};

/**
 * 获取sel
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const search = ({ dispatch }, title) => {
  const url = '/article/search';
  const params = { title };
  return _post(url, params)
    .then((json) => {
      if (json.code === 200) {
        dispatch('FETCH_TOPIC_LISTS_SUCCESS', json.data, 1, 1, true);
        return json.data;
      }
      return Promise.reject(new Error('fetchTopic failure'));
    })
    .catch((error) => {
      dispatch('FETCH_TOPIC_FAILURE');
      return Promise.reject(error);
    });
};


/**
 * 是否显示欢迎页
 * @param  {Function} options.dispatch store对象解构出来的函数，无需手动提供
 * @param  {String} id               文章id
 * @return {Promise}                  Promise
 */
export const weclome = ({ dispatch }) => {
  dispatch('SHOW_WELCOME');
};

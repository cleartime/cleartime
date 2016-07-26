<template>
  <div id="app" v-if="!isShow">
    <c-header></c-header>
    <div class="main">
      <router-view transition="back" transition-mode="out-in" keep-alive ></router-view>
    </div>
    <c-footer></c-footer>
    <c-back></c-back>
  </div>
  <welcome v-if="isShow" @click:isShow="isShow"></welcome>
</template>

<script>
import cHeader from './components/header';
import cFooter from './components/footer';
import cBack from './components/backTop';
import welcome from './views/welcome';
import store from './vuex/store';

export default {
  ready() {
    // 会变的 title
    document.addEventListener('visibilitychange', () => {
      document.title = document.hidden ? '出BUG了，快看！' : '桂孝孝的博客';
    });
    // 控制台
    try {
      console.log('一个人到底多无聊\r\n 才会把 console 当成玩具\r\n一个人究竟多堕落\r\n 才会把大好青春荒废在博客上\r\n\r\n\r\n%cfollow me %c https://github.com/cleartime', 'color:red', 'color:green');
    } catch (e) {
      console.log(e);
    }
  },
  data() {
    return {
      isShow: true,
    };
  },
  components: {
    cHeader,
    cFooter,
    cBack,
    welcome,
  },
  store,
  events: {
    isShow(msg) {
      // 事件回调内的 `this` 自动绑定到注册它的实例上
      this.isShow = msg;
    },
  },
};
</script>

<style lang="scss">
  html,
  #app {
    height: 100%;
  }

  body {
    height: 100%;
    font: 16px 'Microsoft YaHei', 微软雅黑, STHeiti, 'WenQuanYi Micro Hei', SimSun, sans-serif;
    background-color: #fff;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    list-style: none;
  }

  a {
    color: #CCC;
    text-decoration: none;
  }

  img {
    vertical-align: middle;
    max-width: 100%;
  }

  .main {
    overflow: hidden;
    padding: 0 5%;
  }

  .back-transition {
    transition: all .5s ease;
  }
  .back-enter{
    opacity: 1;
    transform: translateY(-100%);
  }
  .back-leave {
    opacity: 0;
    transform: translateY(100%);
  }
</style>

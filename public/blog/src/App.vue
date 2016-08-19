<template>
  <div id="app" v-show="!isShow" transition="fade">
    <!--<c-Bar></c-Bar>-->
    <c-header></c-header>
    <div class="main">
      <router-view transition="back" transition-mode="out-in" class="main-wrapper" ></router-view>
    </div>
    <c-footer></c-footer>
    <c-back></c-back>
  </div>
  <welcome v-if="isShow" @click="isShow"></welcome>
</template>

<script>
import cBar from './components/progressBar';
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
      /* eslint-disable no-console */
      console.log('一个人到底多无聊\r\n 才会把 console 当成玩具\r\n一个人究竟多堕落\r\n 才会把大好青春荒废在博客上\r\n\r\n\r\n%cfollow me %c https://github.com/cleartime', 'color:red', 'color:green');
    } catch (e) {
      console.log(e);
      /* eslint-enable  no-console */
    }
    setTimeout(() => {
      this.isShow = false;
    }, 4000);
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
    cBar,
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
    line-height: 1.5;
    height: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  body {
    height: 100%;
    font: 16px 'Microsoft YaHei', 微软雅黑, STHeiti, 'WenQuanYi Micro Hei', SimSun, sans-serif;
    background-color: #fff;
  }
  img[src^="http"]:empty::before {
    content: attr(src,'http://pic.qiantucdn.com/58pic/15/36/43/60d58PICgBI_1024.jpg');
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

  .fade-transition {
    transition: all .5s ease;
  }
  .fade-enter, .fade-leave{
    opacity: 0;
    transform: scale(0);
  }
  .back-transition {
    transition: all .5s ease;
  }
  .back-enter{
    opacity: 0;
    transform: translateY(-100%);
  }
  .back-leave {
    opacity: 0;
    transform: translateY(-100%);
  }
  .list-transition {
    transition: all .5s ease;
  }
  .list-enter{
    opacity: 0;
  }
  .list-leave {
    opacity: 0;
  }
  @media screen and (max-width: 768px){
   .main{
     padding:0;
     font-weight: bold;
   }
  }
</style>

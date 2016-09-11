<template>
  <div>
    <div id="app" v-show="!isShow" :transition="transitionObj">
      <!--<c-Bar></c-Bar>-->
      <c-header></c-header>
      <div class="main">
        <router-view transition="back" transition-mode="out-in" class="main-wrapper"></router-view>
      </div>
      <c-footer></c-footer>
      <c-back></c-back>
    </div>
    <welcome v-if="isShow" @click="isShow"></welcome>
  </div>
</template>

<script>
  import cBar from './components/progressBar';
  import cHeader from './components/header';
  import cFooter from './components/footer';
  import cBack from './components/backTop';
  import welcome from './views/welcome';
  import store from './vuex/store';

  export default {
    data() {
      return {
        isShow: true,
        transitionObj: 'index',
      };
    },
    ready() {
      if (!this.$route.isindex) {
        this.isShow = false;
      }
      this.transitionObj = 'bounce';
      // 会变的 title
      document.addEventListener('visibilitychange', () => {
        document.title = document.hidden ? '出BUG了，快看！' : 'cleartime的博客_web前端技术博客';
      });
      // 会变的复制代码
//      document.body.addEventListener('copy', () => {
//      });
      // 控制台
      try {
        /* eslint-disable no-console */
        console.log('一个人到底多无聊\r\n 才会把 console 当成玩具\r\n一个人究竟多堕落\r\n 才会把大好青春荒废在博客上\r\n\r\n\r\n%cfollow me %c https://github.com/cleartime', 'color:red', 'color:green');
      } catch (e) {
        console.log(e);
        /* eslint-enable  no-console */
      }
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
    -webkit-overflow-scrolling: touch;
    line-height: 1.6em;
    word-spacing: .05em;
    letter-spacing: .05em;
    height: 100%;
    width: 100%;
    text-rendering: optimizeLegibility;
  }

  body {
    height: 100%;
    background-color: #fff;
    font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #34495e;
    margin: 0;
    ::selection {
      color: #00b0e8;
      background: #000000;
    }
  }

  img[src^="http"]:empty::before {
    content: attr(src, 'http://pic.qiantucdn.com/58pic/15/36/43/60d58PICgBI_1024.jpg');
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
    padding: 2em 1.4em 0;
    max-width: 1000px;
    margin: 0 auto;
  }

  .back-transition {
    transition: all .5s ease;
  }

  .back-enter {
    opacity: 0;
    transform: translateY(-100%);
  }

  .back-leave {
    opacity: 0;
    transform: translateY(-100%);
  }

  .fade-transition {
    transition: all 2s ease-in-out;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-leave {
    opacity: 0;
  }

  .search-transition {
    transition: all .5s ease;
  }

  .search-enter, .search-leave {
    transform: translateX(100%);
  }

  .bounce-enter {
    animation: bounce-in 2s;
  }

  .bounce-leave {
    animation: bounce-out 2s;
  }

  @keyframes bounce-out {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-100%);
    }
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: translateY(100%);
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .index-enter, .index-leave {
    animation: index 2s;
  }

  @keyframes index {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }


  @media screen and (max-width: 768px) {
    .main {
      padding: 0;
      font-weight: bold;
    }
  }
</style>

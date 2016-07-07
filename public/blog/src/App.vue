<template>
  <div id="app" v-if="!isShow">
    <c-header></c-header>
    <div class="main">
      <router-view></router-view>
    </div>
    <c-footer></c-footer>
    <c-back></c-back>
  </div>
  <welcome v-if="isShow" v-on:isShow="isShow"></welcome>
</template>

<script>
import cHeader from './components/header';
import cFooter from './components/footer';
import cBack from './components/backTop';
import welcome from './views/welcome';
import store from './vuex/store';

export default {
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
    background-color: #E1E1E1;
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
    min-height: 100%;
  }


</style>

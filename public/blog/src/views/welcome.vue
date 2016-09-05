<template>
    <div class="bg">
      <span class="text">倒计时进入{{ timenum | myblog}}</span>
      <div>{{ getTopicTab }}</div>
      <img src="../assets/bj1.jpg" width="100%" height="100%">
    </div>
  <div class="menu">
      <div class="pic" @click="closeWelcomePage">
        <img src="../assets/head.jpeg">
      </div>
    </div>
</template>

<script>
  import { fetSEO } from '../vuex/actions';
  import { getWebinfo, getTopicLists } from '../vuex/getters';
  export default {
    data() {
      return {
        timenum: 4,
      };
    },
    ready() {
      setInterval(() => {
        if (this.timenum <= 0) {
          return false;
        }
        this.timenum --;
      }, 1000);
    },
    vuex: {
      actions: {
        fetSEO,
      },
      getters: {
        getWebinfo,
        getTopicLists,
      },
    },
    methods: {
      closeWelcomePage() {
        this.$dispatch('isShow', false);
      },
    },
    route: {
      data() {
        this.fetSEO();
      },
    },
    watch: {
      'getTopicLists': function (newVal, oldVal) { // eslint-disable-line object-shorthand
        if (newVal.length > oldVal.length) {
          this.$dispatch('isShow', false);
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .bg{
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    opacity: .5;
    .text{
      font-size: 20px;
      position: absolute;
      background: transparent;
      color: #fff;
      right: 15px;
      top: 15px;
    }
  }
  .menu{
    border-radius: 50%;
    width: 200px;
    height:200px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -100px;
    margin-top: -100px;
    .pic{
      img{
        border-radius: 50%;
      }
      cursor: pointer;
      position: relative;
      left: 50%;
      top: 50%;
      margin-top: -25px;
      margin-left: -25px;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      background-size: 100%;
      transition: transform 2s;
      -webkit-transition: -webkit-transform 2s;
      &:hover{
        transform: rotate(360deg) scale(2)
      }
    }
    &>div:not(.pic){
      position: absolute;
      border-radius: 50%;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>

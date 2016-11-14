<template>
    <div class="bg" :transition="transitionObj">
      <!--<img src="../assets/bj1.jpg" width="100%" height="100%">-->
    </div>
  <div class="menu" :transition="transitionObj">
      <div class="pic" @click="closeWelcomePage">
        <img src="../assets/head.jpeg">
      </div>
    </div>
</template>

<script>
  import { getTopicLists } from '../vuex/getters';
  export default {
    data() {
      return {
        transitionObj: 'bounce',
        time: 0,
      };
    },
    vuex: {
      getters: {
        getTopicLists,
      },
    },
    methods: {
      closeWelcomePage() {
        this.$emit('isShow', false);
      },
    },
    mounted() {
      this.$nextTick(function () {
        if (!this.route.meta.isindex) {
          this.isShow = false;
          this.transitionObj = '';
          return false;
        }
        const self = this;
        setTimeout(() => {
          self.time = 1;
        }, 2000);
      });
    },
    destroyed() {
      this.opacityStyle = 0;
    },
    watch: {
      'getTopicLists': function (newVal, oldVal) { // eslint-disable-line object-shorthand
        if (newVal.length > oldVal.length) {
          if (!!this.time) {
            this.$emit('isShow', false);
            return false;
          }
          setTimeout(() => {
            this.$emit('isShow', false);
          }, 2000);
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
    background: url("../assets/bj1.jpg") no-repeat;
    background-size: cover;
    top: 0;
    left: 0;
    .text{
      font-size: 20px;
      position: absolute;
      background: transparent;
      color: #fff;
      right: 15px;
      top: 15px;
      &:after{
        content: '...';
      }
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

<template>
  <div class="bg">
  </div>
  <div class="menu">
    <div class="pic" @click.prevent.stop="closeWelcomePage"></div>
  </div>
</template>

<script>
  import { setWelcome } from '../vuex/actions';
  export default {
    vuex: {
      actions: {
        setWelcome,
      },
    },
    methods: {
      closeWelcomePage() {
        this.$dispatch('isShow', false);
      },
    },
  };
</script>

<style lang="scss">
  .bg{
    background: url("../assets/img/bj1.jpg") no-repeat;
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    opacity: .5;
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
      cursor: pointer;
      position: relative;
      left: 50%;
      top: 50%;
      margin-top: -25px;
      margin-left: -25px;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      background: url("../assets/head.jpeg") no-repeat center center;
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

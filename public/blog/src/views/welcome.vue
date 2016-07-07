<template>
  <div class="bg"><a href="#" @click.prevent.stop="login">21321</a>
  </div>
  <div class="menu">

    <div class="pic"></div>
  </div>
  <app v-if="store"></app>
</template>

<script>
  import app from '../app';
  import store from '../vuex/store';

  export default {
    components: {
      app,
    },
    methods: {
      login() {
        this.$route.router.go({ name: 'index' });
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

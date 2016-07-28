<template>
	<header>
		<div><a v-link="{name: 'index'}" class="brand">
      <img src="../assets/head.jpeg" alt="logo">
    </a></div>
		<div>
      <ul class="navbar">
        <li><a v-link="{name: 'me'}">我</a></li>
        <!--<li v-if="!token"><a v-link="{name: 'login'}">登入</a></li>-->
      </ul>
    </div>
    <div><p class="header-title">{{ $route.isPost ? topic.title : listname.name}}</p></div>
	</header>
</template>

<script>
  import { getTopic, getListname } from '../vuex/getters';
  export default {
    vuex: {
      getters: {
        topic: getTopic,
        listname: getListname,
      },
    },
//    beforeDestroy() {
//      console.log(111);
//    },
//    created() {
//      console.log(222);
//    },
//    beforeCompile() {
//      console.log(333);
//    },
//    compile() {
//      console.log(444);
//    },
//    destroyed() {
//      console.log(555);
//    },
//    init() {
//      console.log(666);
//    },
//    attached() {
//      console.log(777);
//    },
    watch: {
      'topic': (val, oldVal) => {
        console.log(val, oldVal);
      },
    },
  };
</script>

<style lang="scss" scoped>
  header {
    background: url("../assets/banner.jpg") no-repeat top center;
    background-size: cover;
    height: 288px;
    overflow: hidden;
    text-shadow: 0 1px 3px rgba(0,0,0,.4),0 0 30px rgba(0,0,0,.075);
    padding: 0 5%;
    margin-bottom: 20px;
    border:1px solid #ccc;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    &>div:nth-child(1){
      order: 1;
      flex:1;
      .brand {
        display: block;
        width: 40px;
        height: 40px;
        padding: 5px 0;
        img{
        border-radius: 50%;
        }
      }
    }
    &>div:nth-child(3){
      order: 2;
      flex:auto;
      justify-content: center;
      align-items: center;
      display: flex;
      height: 100%;
      .header-title {
        word-break: break-all;
        line-height: 1.5;
        color: #fff;
        font-weight: bold;
        font-size: 24px;
      }
    }
    &>div:nth-child(2){
      flex:1 0 70px;
      padding-right: 5px;
      order: 3;
        .navbar{
          text-align: right;
          margin-top: 20px;
          a{
            color: #fff;
          }
        }
     }
  }

  @media (max-width: 400px) {
    .brand {
      float: none;
      margin: 0 auto;
      display: block;
    }

    .navbar {
      float: none;
      text-align: center;

      li {
        float: none;
        display: inline-block;
      }
    }
  }
</style>

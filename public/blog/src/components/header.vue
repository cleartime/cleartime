<template>
	<header>
		<div><a v-link="{name: 'index'}" class="brand">
      <img src="../assets/head.jpeg" alt="logo">
    </a></div>
		<div>
      <ul class="navbar">
        <li><a v-link="{name: 'me'}">我的资料</a></li>
        <!--<li v-if="!token"><a v-link="{name: 'login'}">登入</a></li>-->
      </ul>
    </div>
    <div><p class="header-title">{{ topic.title }}</p></div>
	</header>
</template>

<script>
  import {
    changeToken,
    checkToken,
    fetchUser,
    fetchCollection,
    fetchMsgCount,
    delToken,
    changeLoginUser,
  } from '../vuex/actions';
  import { getMsgCount, getToken, getTopic } from '../vuex/getters';
  export default {
    vuex: {
      actions: {
        changeToken,
        checkToken,
        fetchUser,
        fetchCollection,
        fetchMsgCount,
        delToken,
        changeLoginUser,
      },
      getters: {
        topic: getTopic,
        token: getToken,
        msgCount: getMsgCount,
      },
    },
    ready() {
      // 从cookie中获取accesstoken
      if (document.cookie.length > 0) {
        const arr = document.cookie.split(';');
        let t;
        for (let v of arr) {
          v = v.trim();
          if (v.startsWith('token=')) {
            t = v.split('=')[1];
            break;
          }
        }
        // 改变token的状态，检验token的正确性，从而进行一系列初始化工作
        if (t) {
          this.changeToken(t);
          this.checkToken(t)
              .then(this.fetchUser)
              .then((info) => {
                this.changeLoginUser(info);
                return info.loginname;
              })
              .then((name) => this.fetchCollection(name))
              .then(() => this.fetchMsgCount(this.token))
              .catch((e) => console.log(e));
        }
      }
    },
    beforeDestroy() {
      console.log(111);
    },
    created() {
      console.log(222);
    },
    beforeCompile() {
      console.log(333);
    },
    compile() {
      console.log(444);
    },
    destroyed() {
      console.log(555);
    },
    init() {
      console.log(666);
    },
    attached() {
      console.log(777);
    },
    watch: {
    },
    methods: {
      // 退出
      exit() {
        this.delToken();
        this.$route.router.go({ name: 'index' });
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
      flex:1 0 100px;
      .brand {
        display: block;
        width: 40px;
        height: 40px;
        padding: 5px 20px;
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
        color: #fff;
        font-weight: bold;
        font-size: 24px;
      }
    }
    &>div:nth-child(2){
      flex:1 0 100px;
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

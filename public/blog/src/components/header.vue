<template>
	<header>
		<a v-link="{name: 'index'}" class="brand">
      <img src="../assets/head.jpeg" alt="logo">
    </a>
		<ul class="navbar">
      <li><a v-link="{name: 'me'}">我的资料</a></li>
			<!--<li v-if="!token"><a v-link="{name: 'login'}">登入</a></li>-->
		</ul>
    <p class="header-title">{{ topic.title }}</p>
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
    .header-title {
      text-align: center;
      margin-top: 120px;
      color: #fff;
      font-weight: bold;
      font-size: 24px;

    }
  }

  .brand {
    float: left;
    width: 40px;
    height: 40px;
    padding: 5px 20px;
      img{
        border-radius: 50%;
      }
  }

  .navbar {
    float: right;
    overflow: hidden;
    display: block;

    li {
      float: left;
    }

    a {
      color: #fff;
      font-size: 16px;
      display: block;
      padding: 16px;
    }
  }

  .h {
    background-color: #80BD01;
    height: 14px;
    min-width: 14px;
    padding: 0 2px;
    padding-top: 1px;
    margin-left: 1px;
    display: inline-block;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
    border-radius: 10px;
    color: #FFF;
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

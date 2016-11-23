<template>
	<header>
    <div class="hearder-fixed" :class=" isShowFixed ? 'hearder-fixed-active' : 'hearder-absoleteve'" >
      <a class="hearder-icon">
        <router-link to="/">
          <img src="../assets/head.jpeg" alt="logo">
        </router-link>
      </a>
      <ul class="navbar">
        <li><router-link to="/me">我的资料</router-link></li>
        <li v-if='$route.meta.isindex'>
          <a @click="searchtitle(title)" class="search" ><i class="iconfont icon-xiazai15"></i></a>
          <transition name="search">
            <input type="text" v-model="title" v-if='isShowTitle' />
          </transition>
        </li>
      </ul>
    </div>
    <div class="hearder-content">
      <p class="header-title">{{ $route.meta.isPost ? topic.title : $route.meta.isMe? '我的资料' : isSearch ? '搜索结果如下' : listname.name}}</p>
    </div>
	</header>
</template>

<script>
  import { getTopic, getListname, getSearch } from '../vuex/getters';
  import { search } from '../vuex/actions';
  export default {
    data() {
      return {
        title: '',
        isShowTitle: false,
        isShowFixed: false,
        isTop: 0,
        positionobj: '30px',
      };
    },
    vuex: {
      actions: {
        search,
      },
      getters: {
        isSearch: getSearch,
        topic: getTopic,
        listname: getListname,
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.scroll();
      });
    },
    methods: {
      searchtitle(title) {
        this.isShowTitle = !this.isShowTitle;
        if (!title.length) {
          return false;
        }
        this.search(title);
      },
      scroll() {
        let beforeScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
//        window.onscroll = () => {
          document.addEventListener('scroll', () => { // eslint-disable-line indent
            const afterScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const delta = afterScrollTop - beforeScrollTop;
            if (afterScrollTop <= 70 || afterScrollTop === 0) {
              this.isShowFixed = !1;
              return false;
            }
            else if (delta > 0) {// eslint-disable-line brace-style
              this.isShowFixed = !1;
            } else {
              if (afterScrollTop > 70 && afterScrollTop < 80) {
                this.isShowFixed = !1;
              } else {
                this.isShowFixed = !0;
              }
            }
//          this.isTop = afterScrollTop === 0;
//          if (delta === 0) return false;
            beforeScrollTop = afterScrollTop;
//          this.isShowFixed = delta <= 0;
          }, false);
//        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../assets/font/iconfont';
  header {
    background:#0E2231 url("../assets/banner2.png") no-repeat top center;
    background-size: cover;
    height: 288px;
    overflow: hidden;
    text-shadow: 0 1px 3px rgba(0,0,0,.4),0 0 30px rgba(0,0,0,.075);
    padding: 0 5%;
    margin-bottom: 20px;
    border:1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;

    .hearder-fixed{
      transition: all 1s;
      padding: 10px;
      position: fixed;
      z-index: 10;
      top: 0;
      left: 0;
      box-sizing: border-box;
      background: transparent;
      width: 200%;
      transform: translateY(-71px);
      opacity: 0;
      .hearder-icon{
        display: inline-block;
        float: left;
        img{
          width: 50px;
          border-radius: 50%;
        }
      }
      .navbar{
        display: inline-block;
        float: right;
        padding-top: 12px;
        font-size: 18px;
        li{
          margin-left: 20px;
          float: left;
          a{
            color: #fff;
            font-weight: bold;
          }
          input{
            outline: none;
            border-radius: 15px;
            width: 50px;
            padding-left: 10px;
          }
        }
      }
    }
    .hearder-absoleteve{
      transform: translateY(0);
      opacity: 1;
      width: 100%;
      padding: 20px;
      position: absolute;
    }
    .hearder-fixed-active{
      transform: translateY(0px);
      opacity: 1;
      width: 100%;
      background: #fff;
      border-bottom: 1px solid #ccc;
      a{
        color: rgba(000,000,000,.5)!important;
      }
    }
    .hearder-content{
      p{
        color: #fff;
        font-size: 24px;
        font-weight: bold;
        text-shadow: 0 1px 0 #fff;
        line-height: 36px;
      }
     }
  }

</style>

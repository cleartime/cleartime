<template>
  <footer>
    <!--<div class="link">-->
      <!--<a href="https://github.com/cleartime/cleartime/tree/master/public/blog">源码在此</a>-->
    <!--</div>-->
    <!--友情链接:-->
      <!--<span  v-for="t in friendLink" class="friendLink">-->
        <!--<a v-bind:="t.url">{{ t.title }}</a>-->
      <!--</span>-->
    <!--<p>此网站采用vuejs + vue-router + vuex 搭建</p>-->
    <a href='http://www.miitbeian.gov.cn/' target='_blank'>皖ICP备16014114号</a>
  </footer>
</template>

<script>
  /* eslint-disable max-len */
  import { getFriendLink } from '../vuex/getters';
  import { fetFriendLink } from '../vuex/actions';
  export default {
    vuex: {
      getters: {
        friendLink: getFriendLink,
      },
      actions: {
        fetFriendLink,
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.fetFriendLink();
      });
    },
  };
</script>

<style lang="scss">
  footer {
    text-align: center;
    clear: both;
    background-color: #FFF;
    padding: 20px 5%;
    color: #CCC;
  }

  .link {
    font-size: 14px;
    margin-bottom: 10px;
    a {
      color: #666;
      &:hover{
        color: red;
      }
    }
  }

  .friendLink{
    a{
      color: #5bc0de;
      &:hover{
        color: red;
      }
    }
  }


</style>

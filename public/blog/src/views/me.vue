<template>
  <div class="content">
    <p>电子邮箱:{{ me.email }}</p>
    <p>个人介绍:{{ me.introduction }}</p>
    <p>个性签名:{{ me.sign }}</p>
    <p>微博账号:<a :href="me.weibo" target="_blank">{{ me.weibo }}</a></p>
    <p>github:<a :href="me.github" target="_blank">{{ me.github }}</a></p>
  </div>
</template>

<script>
  /* eslint-disable max-len */
  import { getMe } from '../vuex/getters';
  import { fetchMe } from '../vuex/actions';
  export default {
    vuex: {
      getters: {
        me: getMe,
      },
      actions: {
        fetchMe,
      },
    },
    mounted() {
      // 初始化hint
      this.fetchMe();
    },
  };
</script>

<style lang="scss" scoped>
  .content {
    padding: 10px;
    a{
      color: #5bc0de;
    }
  }
</style>

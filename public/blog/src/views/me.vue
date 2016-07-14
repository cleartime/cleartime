<template>
  <div class="content">
    <p>电子邮箱:{{ me.email }}</p>
    <p>github账号:{{ me.github }}</p>
    <p>个人介绍:{{ me.introduction }}</p>
    <p>个性签名:{{ me.sign }}</p>
    <p>微博账号:{{ me.weibo }}</p>
  </div>
</template>

<script>
  /* eslint-disable max-len */
  import { getMe } from '../vuex/getters';
  import { fetchMe } from '../vuex/actions';
  export default {
    data() {
    },
    vuex: {
      getters: {
        me: getMe,
      },
      actions: {
        fetchMe,
      },
    },
    route: {
      data() {
        // 初始化hint
        this.fetchMe();
      },
    },
  };
</script>

<style lang="scss">
</style>

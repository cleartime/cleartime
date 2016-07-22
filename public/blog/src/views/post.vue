<template>
  <div class="post">
    <c-hint v-if="hint.show"></c-hint>
    <template v-if="topic && !hint.show">
      <c-article></c-article>
      <!--<c-comment></c-comment>-->
    </template>
  </div>
  <div class="sider">
    <c-siderbar></c-siderbar>
  </div>
</template>

<script>
  import cHint from '../components/hint';
  import cSiderbar from '../components/siderbar';
  import cArticle from '../components/article';
  import cComment from '../components/comment';
  import {
    fetchTopic,
    changeCollectStatus,
    initHint,
    showHint,
    fetchUser,
    fetchImg,
  } from '../vuex/actions';
  import {
    getToken,
    getCollection,
    getHint,
    getTopic,
    getImg,
  } from '../vuex/getters';
  export default {
    components: {
      cSiderbar,
      cArticle,
      cComment,
      cHint,
    },
    vuex: {
      actions: {
        fetchTopic,
        changeCollectStatus,
        initHint,
        showHint,
        fetchUser,
        fetchImg,
      },
      getters: {
        img: getImg,
        topic: getTopic,
        hint: getHint,
        token: getToken,
        collection: getCollection,
      },
    },
    route: {
      data({ to: { params: { id, fileId } } }) {
        // 初始化hint
        this.initHint();
        // 显示hint
        this.showHint();
        // 获取文章具体内容
        this.fetchTopic(id)
          .then()
          .catch((e) => console.log(e));
        // 获取文章图片
        this.fetchImg(fileId)
          .then()
          .catch((e) => console.log(e));
      },
    },
  };
</script>


<style lang="scss">
  .post {
    float: left;
    width: 100%;
    min-height: 1px;
    .panel {
      display: inline-block;
      float: left;
      width: 100%;
      a {
        display: block;
        &.v-link-active {
          color: #0000AA;
        }
      }
    }
    .content-list {
      display: inline-block;
      box-shadow: 0 0 5px #CCC;
      border-radius: 5px;
      float: right;
    }
  }

  .sider {
    float: left;
    width: 30%;
    box-sizing: border-box;
    padding-left: 20px;
    display: none;
  }

  @media (max-width: 512px) {
    .content {
      float: none;
      width: 100%;
    }
    .sider {
      float: none;
      width: 100%;
      padding-left: 0;
    }
  }

</style>

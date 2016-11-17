<template>
    <div class="post">
      <c-hint v-if="hint.show"></c-hint>
      <template v-if="topic && !hint.show">
        <c-article></c-article>
        <c-comment :comment = 'comment' :topic = 'topic.objectId' ></c-comment>
      </template>
    </div>
</template>

<script>
  import cComment from '../components/comment';
  import cHint from '../components/hint';
  import cArticle from '../components/article';
  import {
    fetchTopic,
    initHint,
    showHint,
    fetchImg,
    fetchComments,
  } from '../vuex/actions';
  import {
    getHint,
    getTopic,
    getSearch,
    getComments,
    getFileId,
  } from '../vuex/getters';
  export default {
    components: {
      cArticle,
      cHint,
      cComment,
    },
    vuex: {
      actions: {
        fetchTopic,
        initHint,
        showHint,
        fetchImg,
        fetchComments,
      },
      getters: {
        topic: getTopic,
        hint: getHint,
        searchType: getSearch,
        comment: getComments,
        fileId: getFileId,
      },
    },
    mounted() {
      this.$nextTick(function () {
        // 初始化hint
        this.initHint();
        // 显示hint
        this.showHint();
        // 获取文章具体内容
        /* eslint-disable no-console, prefer-arrow-callback,
         space-before-function-paren, space-before-blocks */
        const self = this;
        this.fetchTopic(this.$route.query.id)
          .then(function(){
            // 获取文章图片
            if (self.fileId) {
              self.fetchImg(self.fileId)
                .then()
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
        // 获取文章评论
        this.fetchComments(this.$route.query.id)
          .then()
          .catch((e) => console.log(e));
        /* eslint-enable no-console, prefer-arrow-callback,
         space-before-function-paren, space-before-blocks */
      });
    },
  };
</script>


<style lang="scss" scoped>
  .post {
    float: left;
    width: 100%;
    min-height: 1px;
    .panel {
      display: inline-block;
      float: left;
      width: 100%;
      padding-bottom: 30px;
      border-bottom: 1px solid #ccc;
      a {
        display: block;
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

  @media screen and (max-width: 768px){
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

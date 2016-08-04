<template>
    <div>
      <div>
        <p @click="setcomment(nickname,email,content)">点我评论</p>
        <div>
          <input type="text" placeholder="您的昵称" v-model="nickname">
          <input type="email" placeholder="您的邮箱" v-model="email">
           <textarea placeholder="评论的内容" v-model="content" ></textarea>
        </div>
      </div>
      <div class="comment" v-for="i in comment" transition="list" transition-mode="out-in">
        <p class="comment-head">
        <span class="comment-nickname">{{ i.nickname }}</span>
        <span class="comment-email">{{ i.email }}</span>
        <span class="comment-time">{{ i.updatedAt | timeToNow }}</span>
        </p>
        <p class="comment-content">{{ i.content }}</p>
        <a>回复</a>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  .comment{
    border:1px solid #ccc;
  }
</style>
<script>
  import { setComments } from '../vuex/actions';
  export default {
    vuex: {
      actions: {
        setComments,
      },
    },
    data() {
      return {
        nickname: '',
        email: '',
        content: '',
        articleId: this.topic,
      };
    },
    props: ['comment', 'topic'],
    ready() {
    },
    methods: {
      setcomment() {
        this.setComments(this.nickname, this.email, this.content, this.articleId);
      },
    },
  };
</script>

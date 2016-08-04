<template>
    <div>
      <h2>讨论区</h2>
      <div class="comment" v-for="i in comment" transition="list" transition-mode="out-in" >
        <p class="comment-head">
        <span class="comment-nickname">{{ i.nickname }}</span>
        <span class="comment-email">{{ i.email }}</span>
        <span class="comment-time">{{ i.updatedAt | timeToNow }}</span>
        </p>
        <p class="comment-content">{{ i.content }}</p>
        <a @click='isShowCommet(i.nickname, i.objectId)'>回复他</a>
      </div>
      <div class="comment-body">
        <div v-if='isShow'>
          <input type="text" placeholder="您的昵称" v-model="nickname">
          <input type="email" placeholder="您的邮箱" v-model="email">
        </div>
        <div class="comment-pep">
          <img src="../assets/pep.png">
          <p>{{ nickname }}</p>
        </div>
        <textarea placeholder="评论的内容" v-model="content" ></textarea>
        <a @click='setcomment()'>{{ user }}</a>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  .comment{
    border:1px solid #ccc;
  }
  .comment-body{
    .comment-pep{
      width: 50px;
      border-radius: 50%;
    }
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
        isShow: false,
        user: '点击评论',
        commentsId: '',
      };
    },
    props: ['comment', 'topic'],
    ready() {
      /* eslint-disable brace-style */
      if (typeof(Storage) !== 'undefined')
      {
        if (localStorage.nickname && localStorage.email) {
          this.nickname = localStorage.nickname;
          this.email = localStorage.email;
          this.isShow = false;
        } else {
          this.isShow = true;
        }
      }
      /* eslint-enable brace-style */
    },
    methods: {
      setcomment() {
        this.setComments(this.nickname, this.email, this.content, this.articleId, this.commentsId);
        this.isShow = false;
      },
      isShowCommet(name, id) {
        this.user = `回复${name}`;
        if (id) {
          this.commentsId = id;
        }
      },
    },
  };
</script>

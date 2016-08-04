<template>
    <div>
      <h2>讨论区</h2>
      <div v-for="i in comment" transition="list" transition-mode="out-in" >
        <div class="comment"  v-if = '!i.fid'  >
          <p class="comment-head">
            <span class="comment-nickname">{{ i.nickname }}</span>
            <span class="comment-email">{{ i.email }}</span>
            <span class="comment-time">{{ i.updatedAt }}</span>
          </p>
          <p class="comment-content">{{ i.content}}</p>
          <a @click='isShowCommet(i.nickname, i.objectId)'>回复他</a>
        </div>
        <div class="fcomment"  v-for="j in comment" v-if = 'j.fid === i.objectId'>
          <p class="comment-head">
            <span class="comment-nickname">{{ j.nickname }}</span>
            <span class="comment-email">{{ j.email }}</span>
            <span class="comment-time">{{ j.updatedAt }}</span>
          </p>
          <p class="comment-content">{{ j.fid ? j.content : '@'+j.content }}</p>
          <a @click='isShowCommet(j.nickname, j.objectId)'>回复他</a>
        </div>
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
  .fcomment{
    margin-left: 20px;
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
        fid: '',
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
        this.setComments(this.nickname, this.email, this.content, this.articleId, this.fid);
        this.isShow = false;
      },
      isShowCommet(name, fid) {
        this.user = `回复${name}`;
        this.fid = fid;
      },
    },
  };
</script>

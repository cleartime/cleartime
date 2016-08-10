<template>
    <div class="comment-main">
      <h2>讨论区</h2>
      <div v-for="i in comment" transition="list" transition-mode="out-in" >
        <div class="comment"  v-if = '!i.fid' >
          <div class="comment-pep">
            <img src="../assets/pep.png">
            <p>{{ i.nickname }}</p>
          </div>
          <p class="comment-text">
            <span class="comment-email">{{ i.email }}</span>
            <span class="comment-time">{{ i.updatedAt | timeToUpdata }}</span>
          </p>
          <p class="comment-content">{{ i.content}}</p>
          <a @click='isShowCommet(i.nickname, i.objectId)'>回复他</a>
        </div>
        <div class="fcomment"  v-for="j in comment" v-if = 'j.fid == i.objectId'>
          <div class="comment-pep">
            <img src="../assets/pep.png">
            <p>{{ j.nickname }}</p>
          </div>
          <p class="comment-text">
            <span class="comment-email">{{ j.email }}</span>
            <span class="comment-time">{{ j.updatedAt | timeToUpdata}}</span>
          </p>
          <p class="comment-content">{{ '@'+i.nickname+'&nbsp;&nbsp;'+j.content }}</p>
          <a @click='isShowCommet(j.nickname, j.objectId)'>回复他</a>
        </div>
      </div>
      <div class="comment-body">
        <div class="comment-pep">
          <img src="../assets/pep.png">
          <p>{{ nickname }}</p>
        </div>
        <div v-if='isShow' class='comment-text'>
          <input type="text" placeholder="您的昵称" v-model="nickname">
          <input type="email" placeholder="您的邮箱" v-model="email">
        </div>
        <div class="comment-footer" >
          <textarea placeholder="评论的内容" v-model="content" ></textarea>
          <a name='content' class="comment-click" @click='setcomment()'>{{ user }} <span v-if='isCancel' @click.stop='cancel()' class="cancel"></span></a>
        </div>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  .comment-main{
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .comment{
    padding: 10px;
    border:1px solid #ccc;
  }
  .fcomment{
    padding: 10px;
    border:1px solid #ccc;
    margin-left: 10%;
    width: 80%;
  }
  .comment-pep{
    width: 20%;
    float: left;
    img{
      width: 50px;
      border-radius: 50%;
    }
  }
  .comment-text{
    float: left;
    width: 80%;

  }
  .comment-body{
    margin-top: 10px;
    .comment-click{
      clear: both;
      color: #181818;
      margin-left: 20%;
    }
    .cancel{
      &:after{
        position: relative;
        top: 3px;
        display: inline-block;
        transform: rotate(45deg);
        content: '+';
        font-size: 20px;
      }
    }
  }
  @media screen and (max-width: 768px){
    .comment-pep{
      width: 100%;
      float: none;
      text-align: center;
    }
    .comment-text{
      float: none;
      width: 100%;
      .comment-time{
        float: right;
      }

    }
    .comment-footer{
      clear: both;
      text-align: center;
      textarea{
        border:1px solid #5bc0de;
        width: 100%;
      }
      .comment-click{
        margin-left: 0;
      }
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
        isCancel: false,
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
        /* eslint-disable brace-style,no-alert */
        if (!!this.nickname.length && !!this.email.length && !!this.content.length) {
          this.setComments(this.nickname, this.email, this.content, this.articleId, this.fid);
          this.isShow = false;
          this.content = '';
        }
        else {
          alert('昵称,邮箱,评论内容不能为空!');
        }
        /* eslint-enable brace-style,no-alert */
      },
      isShowCommet(name, fid) {
        window.location.hash = '';
        window.location.hash = 'content';
        this.user = `回复${name}`;
        this.isCancel = true;
        this.fid = fid;
        document.getElementsByTagName('textarea')[0].focus();
      },
      cancel() {
        this.isCancel = false;
        this.user = '点击评论';
        this.fid = '';
      },
    },
  };
</script>

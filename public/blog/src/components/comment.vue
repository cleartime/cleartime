<template>
    <div class="comment-main">
      <h2>讨论区</h2>
      <div v-for="i in comment" transition="list" transition-mode="out-in" >
        <div class="comment"  v-if = '!i.fid' >
          <div class="comment-pep">
            <i class="iconfont icon-myline"></i>
            <!--<img src="../assets/pep.png">-->
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
            <i class="iconfont icon-myline"></i>
            <!--<img src="../assets/pep.png">-->
            <p>{{ j.nickname }}</p>
          </div>
          <p class="comment-text">
            <span class="comment-email">{{ j.email }}</span>
            <span class="comment-time">{{ j.updatedAt | timeToUpdata}}</span>
          </p>
          <p class="comment-content"><span>{{ '@'+i.nickname }}</span>{{ j.content }}</p>
          <a @click='isShowCommet(j.nickname, j.objectId)'>回复他</a>
        </div>
      </div>
      <div class="comment-body">
        <div class="comment-pep">
          <i class="iconfont icon-myline"></i>
          <!--<img src="../assets/pep.png">-->
          <p>{{ nickname }}</p>
        </div>
        <div v-if='isShow' class='comment-text'>
          <from>
          <input type="text" placeholder="您的昵称" v-model="nickname" required pattern="[A-Za-z]{3}" title="Three letter country code">
          <input type="email" placeholder="您的邮箱" v-model="email" required pattern="[A-Za-z]{3}" title="Three letter country code">
          </from>
        </div>
        <div class="comment-footer" >
          <textarea placeholder="评论的内容" v-model="content" required pattern="[A-Za-z]{3}" title="Three letter country code"></textarea>
          <a name='content' class="comment-click" @click='setcomment()'>{{ user }} <span v-if='isCancel' @click.stop='cancel()' class="iconfont icon-close" title="取消"></span></a>
        </div>
      </div>
    </div>
</template>
<style lang="scss" scoped>
  @import '../assets/font/iconfont';
  .comment-main{
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .comment{
    margin: 20px 0;
    padding: 10px;
    border-bottom: 1px dashed #ccc;
  }
  .fcomment{
    margin: 20px 0;
    padding: 15px 0;
    border-bottom: 1px dashed #ccc;
    .comment-content span{
      padding-right: 15px;
      font-weight: bold;
      color: #9c0033;
    }
  }
  .comment-pep{
    .iconfont{
      font-size: 40px;
    }
    margin: 16px 0;
    text-align: center;
    width: 20%;
    float: left;
    img{
      width: 50px;
      border-radius: 50%;
    }
    p{
      margin: 5px 0 0;
    }
  }
  .comment-text{
    span:nth-child(2){
      float: right;
    }
    input{
      display: block;
      margin:10px 0px;
      outline: #00AA00;
    }
    input:nth-child(1){
    }
    float: left;
    width: 80%;
  }
  .comment-footer{
    width: 80%;
    margin-top:16px ;
    float: left;
    .comment-click{
      display: block;
      clear: both;
    }
    textarea{
      box-sizing: border-box;
      border:1px solid #ccc;
      padding: 15px;
      width: 100%;
      outline: none;
    }
  }
  .comment-body{
    margin-top: 10px;
    .comment-click{
      clear: both;
      color: #181818;
      font-size: 18px;
      padding-left: 15px;
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
      width: 100%;
      clear: both;
      text-align: center;
      textarea{
        width: 100%;
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
        this.user = `@${name}`;
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

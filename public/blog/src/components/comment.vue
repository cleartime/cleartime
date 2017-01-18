<template>
    <div class="comment-main">
      <h2>讨论区<span>评论一下,有惊喜哦!</span></h2>
      <transition-group name="list" mode="out-in" tag="div">
      <div v-for="i in comment" :key="i.fid">
        <transition name="fade">
        <div class="comment"  v-if = '!i.fid'>
          <div class="comment-pep">
            <i class="iconfont icon-myline"></i>
            <!--<img src="../assets/pep.png">-->
            <p>{{ i.nickname }}</p>
          </div>
          <div class="comment-pep-right">
            <p class="comment-text">
              <span class="comment-email">{{ i.email }}</span>
              <span class="comment-time">{{ i.updatedAt | timeToUpdata }}</span>
            </p>
            <p class="comment-content">{{ i.content}}</p>
            <p @click='isShowCommet(i.nickname, i.email, i.objectId)' class="reply">回复他</p>
          </div>
        </div>
        </transition>
        <transition-group name="fade" mode="out-in" tag="div">
        <div class="fcomment"  v-for="j in comment" v-if = 'j.fid == i.objectId' :key="j.fid">
          <div class="comment-pep">
            <i class="iconfont icon-myline"></i>
            <!--<img src="../assets/pep.png">-->
            <p>{{ j.nickname }}</p>
          </div>
          <div class="comment-pep-right">
            <p class="comment-text">
              <span class="comment-email">{{ j.email }}</span>
              <span class="comment-time">{{ j.updatedAt | timeToUpdata}}</span>
            </p>
            <p class="comment-content"><span>{{ '@'+i.nickname }}</span>{{ j.content }}</p>
            <p @click='isShowCommet(j.nickname, i.email, j.objectId)' class="reply">回复他</p>
          </div>
        </div>
        </transition-group>
      </div>
      </transition-group>
      <div class="comment-body">
        <div class="comment-pep updatePep" @click='updatePep()' title="点击更换用户">
          <i class="iconfont icon-myline"></i>
          <!--<img src="../assets/pep.png">-->
          <p>{{ nickname }}</p>
        </div>
        <div class="comment-pep-right">
          <transition name="fade" >
          <div v-if='isShow' class='comment-text'>
            <p class="pattern" v-if='pattern.pattern_nickname'>{{ pattern.pattern_nickname }}</p>
            <input type="text" placeholder="您的昵称" v-model="nickname"  >
            <transition name="fade">
            <p class="pattern" v-if='pattern.pattern_email'>{{ pattern.pattern_email }}</p>
            </transition>
            <input type="email" placeholder="您的邮箱方便交流" v-model="email"  >
          </div>
          </transition>
          <div class="comment-footer" >
            <transition name="fade">
            <p class="pattern" v-if='pattern.pattern_content'>{{ pattern.pattern_content }}</p>
            </transition>
            <textarea placeholder="评论的内容" v-model="content" ></textarea>
            <a name='content' class="comment-click"  :class=" commentClickDisabled ? 'commentClickDisabled' : ''"  @click='setcomment()'>{{ user }}
              <transition name='fade'>
              <span v-if='isCancel' @click.stop='cancel()' class="iconfont icon-close" title="取消" ></span>
              </transition>
            </a>
          </div>
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
    h2 span{
      float: right;
      font-size: 14px;
    }
  }
  .comment{
    overflow: hidden;
    margin: 20px 0;
    padding: 10px;
    border-bottom: 1px dashed #ccc;
  }
  .reply{
    text-align: right;
    cursor: pointer
  }
  .fcomment{
    overflow: hidden;
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
  .comment-pep-right{
    width: 80%;
    float: left;
    .comment-text{
      span:nth-child(2){
        float: right;
      }
      input{
        width: 100%;
        box-sizing: border-box;
        padding:10px 15px;
        display: block;
        margin:10px 0px;
        outline: #00AA00;
      }
    }
  }
  .comment-footer{
    width: 100%;
    float: left;
    .comment-click{
      cursor: pointer;
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
  .commentClickDisabled{
    pointer-events: none;
    color: #ccc!important;
  }
  .pattern{
    color: #990000;
    text-align: left;
  }
  .updatePep{
    cursor: pointer;
  }
  @media screen and (max-width: 768px){
    .comment-pep{
      width: 100%;
      float: none;
      text-align: center;
    }
    .comment-pep-right{
      width: 100%;
    }
    .comment-text{
      float: none;
      width: 100%;
      .comment-time{
        float: right;
      }
      input{
        padding: 15px;
        box-sizing: border-box;
        border:1px solid #ccc;
        float: none;
        height: 35px;
        line-height: 35px;
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
        nickname: '', // 昵称
        email: '', // 邮箱
        content: '', // 内容
        articleId: this.topic, // 文章ID
        isShow: false, // 是否显示昵称和邮箱文本框
        user: '点击评论', // 提交按钮文字显示
        fid: '', // 评论谁就是谁的ID
        isCancel: false, // 是否取消回复
        femail: '', // 评论谁就是谁的邮箱
        fnickname: '', // 评论谁就是谁的昵称
        commentClickDisabled: true, // 评论按钮不可点击
        pattern: {// 验证的提示
          pattern_nickname: false,
          pattern_email: false,
          pattern_content: false,
        },
        fill: {// 是否填写了数据,默认不填写
          fill_nickname: false,
          fill_email: false,
          fill_content: false,
        },
        isSetcomment: false, //是否提交了评论(用来hack后面评论提示的bug,暂时先这么解决了)
      };
    },
    props: ['comment', 'topic'],
    mounted() {
      this.$nextTick(function () {
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
      });
    },
    methods: {
      // 提交评论
      setcomment() {
        this.setComments(this.nickname, this.email, this.content, this.articleId,
          this.fid, this.fnickname, this.femail);
        this.isShow = false;
        this.content = '';
      },
      // 是否显示昵称和邮箱
      isShowCommet(name, email, fid) {
        window.location.hash = '';
        window.location.hash = 'content';
        this.user = `@${name}`;
        this.isCancel = true;
        this.fid = fid;
        this.femail = email;
        this.fnickname = name;
        document.getElementsByTagName('textarea')[0].focus();
      },
      // 取消回复按钮
      cancel() {
        this.isCancel = false;
        this.user = '点击评论';
        this.fid = '';
        this.fnickname = '';
      },
      // 更改用户状态恢复出厂设置
      updatePep() {
        this.isShow = !this.isShow;
      },
    },
    watch: {
      'nickname': function (newVal) { // eslint-disable-line object-shorthand, func-names
        this.commentClickDisabled = true;
        this.fill.fill_nickname = true;
        if (!newVal.length) {
          this.pattern.pattern_nickname = '请输入昵称!';
        } else if (/\s/.test(newVal)) {
          this.pattern.pattern_nickname = '昵称不能包含空格!';
        } else {
          this.pattern.pattern_nickname = false;
        }
        if ((this.fill.fill_nickname && this.fill.fill_email && this.fill.fill_content)
          && (!this.pattern.pattern_nickname && !this.pattern.pattern_email
          && !this.pattern.pattern_content)) {
          this.commentClickDisabled = false;
        }
      },
      'email': function (newVal) { // eslint-disable-line object-shorthand, func-names
        this.commentClickDisabled = true;
        this.fill.fill_email = true;
        if (!newVal.length) {
          this.pattern.pattern_email = '请输入邮箱!';
        } else if (!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(newVal)) {
          this.pattern.pattern_email = '邮箱格式不正确,请输入正确的邮箱!!';
        } else {
          this.pattern.pattern_email = false;
        }
        if ((this.fill.fill_nickname && this.fill.fill_email && this.fill.fill_content)
          && (!this.pattern.pattern_nickname && !this.pattern.pattern_email
          && !this.pattern.pattern_content)) {
          this.commentClickDisabled = false;
        }
      },
      'content': function (newVal) { // eslint-disable-line object-shorthand, func-names
        this.commentClickDisabled = true;
        this.fill.fill_content = true;
        if (!newVal.length) {
          this.pattern.pattern_content = '请输入评论内容!';
        } else {
          this.pattern.pattern_content = false;
        }
        if ((this.fill.fill_nickname && this.fill.fill_email && this.fill.fill_content)
          && (!this.pattern.pattern_nickname && !this.pattern.pattern_email
          && !this.pattern.pattern_content)) {
          this.commentClickDisabled = false;
        }
      },
      // 状态恢复出厂设置
      'comment': function (newVal) { // eslint-disable-line object-shorthand, func-names
        if (newVal) {
          this.pattern.pattern_nickname = false;
          this.pattern.pattern_email = false;
          this.pattern.pattern_content = false;
          this.fill.fill_content = false;
        }
      },
    },
  };
</script>

<template>
  <article class="panel">
    <div class="panel-header article-header">
      <h2>
        {{ topic.title }}
      </h2>
      <div class="info">
        <span>发布于{{ topic.updatedAt | timeToNow }}</span>
        <p>{{ topic.description }}</p>
      </div>
    </div>
    <div class="inner padding">
      <img :src="setimg.url" :alt="'桂孝孝的博客图片名称' + setimg.name" class="head-img">
      <div class="article" v-html="content">
      </div>
    </div>
  </article>
</template>

<script>
  import { getTopic, getImg } from '../vuex/getters';
  import marked from 'marked';
  import Prism from 'prismjs';
  import 'prismjs/themes/prism.css';

  export default {
    data() {
      return {
        content: '',
      };
    },
    vuex: {
      getters: {
        setimg: getImg,
        topic: getTopic,
      },
    },
    mounted() {
      this.$nextTick(function () { // eslint-disable-line func-names
        marked.setOptions({ highlight: (code) => Prism.highlight(code, Prism.languages.javascript),
        });
        marked(this.topic.content, (err, content) => {
          if (!err) {
            this.content = content;
          }
        });
      });
    },
  };
</script>

<style lang="scss">
  .head-img{
    padding: 20px 0;
    clear: both;
    display: block;
    margin:auto;
  }
  .article-header {
    background-color: #FFF;
    border-bottom: 1px solid #E5E5E5;
    padding-bottom: 15px;
  }
  .info {
    color: #838383;
    font-size: 12px;
    span {
      &:before {
        content: '•';
      }
    }
    p{
      font-size: 15px;
    }
    a {
      color: #FFF;
      margin: 5px 0;

      &:hover {
        color: #FFF;
      }

    }

  }

  .btn-failure {
    background-color: #909090;
    color: #000;
  }
  .article {
    display: flex;
    padding: 15px;
    flex-direction: column;
    h3:after,h4:after,h5:after{
      content: ':';
    }
    table{
      margin: 20px auto;
      border-collapse: collapse;
      tbody tr:nth-child(2n+1) {
        background-color: #f7f7f7;
      }
      td, th {
        border: 1px solid #ddd;
        padding: .3rem .6rem;
      }
    }

    p > code, h2 > code, h4>code, h5>code{
      color: #e96900;
      padding: 3px 5px;
      margin: 0 2px;
      border-radius: 2px;
      white-space: nowrap;
    }
    pre{
      line-height: 1.2;
      padding: 15px;
      border-radius: 5px;
      white-space: pre;
      overflow-x:auto;
      word-wrap: break-word;
      background: #f7f7f7;
      color: #000;
      font-weight: normal;
    }
    a{
      color: #00b0e8;
    }
    ul li{
      list-style: disc;
      list-style-position: inside;
    }
    ol li{
      list-style: decimal;
    }
    img{
      padding: 20px 0;
      clear: both;
      display: block;
      margin:auto;
    }
    h2{
      border-bottom: 1px solid #d2d2d2;
      padding-bottom: .7em;
    }
    blockquote {
      background:#f9f9f9;
      border-left:10px solid #ccc;
      margin:1.5em 10px;
      padding:.5em 10px;
      quotes:"\201C""\201D""\2018""\2019";
    }
    blockquote:before {
      color:#ccc;
      content:open-quote;
      font-size:4em;
      line-height:.1em;
      margin-right:.25em;
      vertical-align:-.4em;
    }
    blockquote p {
      display:inline;
    }
  }


  @media screen and (max-width: 768px) {
    .article-header h2{
      padding-bottom: 10px;
      border-bottom: 1px solid #d2d2d2;
    }
    .article-header{
      padding:0 10px;
      box-sizing: border-box;
      box-shadow: none;
      background: #fff;
    }

  }
</style>

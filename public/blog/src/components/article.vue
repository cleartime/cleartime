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
      <img :src="setimg.url" alt="桂孝孝的博客图片名称{{ setimg.name }}" class="head-img">
      <div class="article">
        {{{ content }}}
      </div>
    </div>
  </article>
</template>

<script>
  import { getTopic, getImg } from '../vuex/getters';
  import marked from 'marked';
//  import highlight from 'highlight';
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
    ready() {
      marked.setOptions({ highlight: (code) => Prism.highlight(code, Prism.languages.javascript),
      });
      marked(this.topic.content, (err, content) => {
        if (!err) {
          this.content = content;
        }
      });
      console.log(this.content);
    },
  };
</script>

<style lang="scss">
  @import '../assets/lib/github-markdown';
  .head-img{
    max-width: 100%;
    width: auto;
    height: auto;
    width: 50%;
    height: 50%;
    transform: translate(50%);
    margin:20px 0;
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
    pre{
      padding: 15px;
      border-radius: 5px;
      white-space: pre-wrap;
      word-wrap: break-word;
      background: rgb(39,40,34);
      color: #fff;
    }
    a{
      color: #00b0e8;
    }
    img{
      display: flex;
      justify-content:center;
    }
  }


  @media screen and (max-width: 768px) {
    .article-header h2{
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

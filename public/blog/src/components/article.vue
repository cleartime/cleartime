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
      <img :src="setimg.url" alt="桂孝孝的博客图片名称{{ setimg.name }}">
      <div class="markdown-body">
        {{{ topic.content }}}
      </div>
    </div>
  </article>
</template>

<script>
  import { getTopic, getImg } from '../vuex/getters';
  export default {
    vuex: {
      getters: {
        setimg: getImg,
        topic: getTopic,
      },
    },
  };
</script>

<style lang="scss">
  @import '../assets/lib/github-markdown';
  .panel img{
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

  .markdown-body {
    padding: 0 15px;
    img {
      max-width: 100%;
      width: auto;
      height: auto;
    }
  }

</style>

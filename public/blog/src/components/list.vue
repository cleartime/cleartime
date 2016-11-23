<template>
  <div class="inner">
    <div class="topic-list">
      <transition-group name="fade" tag="div">
        <div class="cell" v-for="topicItem in items" :key="topicItem.objectId">
          <div class="topic-wrapper">
            <router-link :to="{ path: 'post', query: {id: topicItem.objectId} }" :title="' ' + topicItem.title" >
              <p>{{ topicItem.title }} <span>{{ topicItem.createdAt | timeToNow }}</span></p>
              <p>{{ topicItem.description }}</p>
            </router-link>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import { getTopicLists } from '../vuex/getters';
  export default {
    vuex: {
      getters: {
        topicLists: getTopicLists,
      },
    },
    props: ['items'],
    components: {
    },
  };
</script>

<style lang="scss">

  .panel {
    margin-bottom: 15px;
  }
  .panel-header {
    font-size: .9em;
    background-color: #F6F6F6;
    padding: 10px;
    border-radius: 3px 3px 0 0;

    a {
      cursor: pointer;
      color: #80BD01;
      padding: 3px 4px;
      margin: 0 10px;
      border-radius: 3px;

      &:hover {
        color: #005580;
      }
    }

    .active {
      background-color: #80BD01;
      color: #FFF;

      &:hover {
        background-color: #80BD01;
        color: #FFF;
      }
    }

  }

  .inner {
    background-color: #FFF;
  }

  .cell {
    word-break: break-all;
    transition-property: all;
    transition-duration: 0.2s;
    transition-timing-function: ease-in-out;
    transition-delay: initial;
    background: #fff;
    padding: 10px;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    &:last-child{
      border-bottom: none;
    }
    &:hover {
      background-color:#f7f7f7;
    }
    a p{
      line-height:15px;
    }
    a p:nth-child(1){
      font-size: 22px;
      font-weight: 400;
      color: #404040;
      line-height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    a p span{
      float: right;
      font-size: 14px;
      color: #8b8b8b;
    }
    a p:nth-child(2){
      color: #919191;
      font-size: 13px;
      white-space: normal;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .avatar {
    float: left;
  }

  .info-count {
    float: left;
    line-height: 30px;
    width: 70px;
    text-align: center;
    font-size: 12px;
  }

  .reply-count {
    color: #9e78c0;
    font-size: 13px;
  }

  .seperator {
    margin-left: -3px;
  }

  .last-time {
    float: right;
    font-size: 12px;
    line-height: 30px;

    img {
      width: 20px;
      height: 20px;
    }

    span {
      margin-left: 5px;
      text-align: right;
      min-width: 50px;
      display: inline-block;
    }
  }

  .top {
    background-color: #80BD01;
    font-size: .6em;
    padding: 3px;
    color: #FFF;
    border-radius: 3px;
  }

  .normal {
    background-color: #E5E5E5;
    color: #999;
  }

  .topic-wrapper {
    a {
      color: #333;
      line-height: 30px;
      overflow: hidden;
      vertical-align: middle;
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .hello + a {
    margin-right: 20px;
  }
  @media screen and (max-width: 768px){
    body {
      font-size: 14px;
    }
    .panel-header{
      padding: 0;
    }
    .topic-wrapper {
      a {
        /*width: 90%;*/
      }
    }
    .panel-header li{
      margin: 5px!important;
    }
  }
</style>

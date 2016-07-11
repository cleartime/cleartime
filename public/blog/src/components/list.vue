<template>
  <div class="inner">
    <div class="topic-list">

      <div class="cell" v-for="topicItem in items">
        <a href="#" class="last-time">
          <span>{{ topicItem.last_reply_at | timeToNow }}</span>
        </a>
        <div class="topic-wrapper">
          <a v-link="{name: 'post', params: {id: topicItem.objectId , fileId: topicItem.fileId}}" title=" {{ topicItem.title }}">
            {{ topicItem.title }}
            <br>
            {{ topicItem.description }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['items'],
    components: {
    },
  };
</script>

<style lang="scss">
  .panel {
    margin-bottom: 15px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 3px;
    }

    box-shadow: 0 0 5px #CCC;
  }
  .panel-header {
    font-size: .9em;
    background-color: #F6F6F6;
    padding: 10px;
    border-radius: 3px 3px 0 0;

    a {
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
    padding: 10px;
    overflow: hidden;

    &:hover {
      background-color:#22c4f5;
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

  @media (max-width: 512px) {
    body {
      font-size: 14px;
    }

    .topic-wrapper {
      a {
        display: inline-block;
        width: 90%;
      }
    }
  }


</style>

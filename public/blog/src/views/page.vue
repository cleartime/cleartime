<template>
  <div class="content">
    <div class="panel">
      <div class="panel-header">
        <a v-link="{name: 'index'}">全部</a><a v-link="{name: 'tabA', params: {categoryId: tab.categoryID}}"  v-for="tab in topicTabs" :class="tab.categoryID === currentTab ? 'active' : ''">{{ tab.name }}</a>
      </div>
      <div class="panel-header recommend-header">
        <a v-link="{name: 'tabB', params: {recommend: tab.nickname}}"  v-for="tab in recommendList" :class="tab.nickname === currentTab ? 'active' : ''">{{ tab.name }}</a>
      </div>
    </div>
    <div class="content-list">
      <c-hint v-if="hint.show"></c-hint>
      <c-list :items='topicLists' v-else></c-list>
    </div>
  </div>
  <div class="sider">
    <c-siderbar></c-siderbar>
  </div>
</template>

<script>
  /* eslint-disable max-len */
  import cHint from '../components/hint';
  import cList from '../components/list';
  import cSiderbar from '../components/siderbar';
  import { fetchTopicLists, changeUser, fetchUser, checkToken, fetchMsgCount, fetchCollection, showHint, initHint, changeLoginUser, loginSuccuess, fetchCategoryicLists, getRecommend, getRecommendOne } from '../vuex/actions';
  import { getTopicTabs, getCurrentTab, getTopicLists, getHint, getLoginUser, getRecommendLists } from '../vuex/getters';
  export default {
    components: {
      cHint,
      cList,
      cSiderbar,
    },
    vuex: {
      actions: {
        getRecommendOne,
        getRecommend,
        fetchCategoryicLists,
        loginSuccuess,
        fetchTopicLists,
        fetchUser,
        changeUser,
        checkToken,
        fetchCollection,
        fetchMsgCount,
        showHint,
        initHint,
        changeLoginUser,
      },
      getters: {
        recommendList: getRecommendLists,
        topicTabs: getTopicTabs,
        currentTab: getCurrentTab,
        topicLists: getTopicLists,
        hint: getHint,
        loginUser: getLoginUser,
      },
    },
    route: {
      data({ to: { params: { categoryId, recommend } } }) {
        // 初始化hint
        this.initHint();
        // 显示hint
        this.showHint();
        // 获取栏目
        this.loginSuccuess();
        // 获取标签
        this.getRecommend();
        // 获取文章列表
        if (categoryId) {
          this.fetchCategoryicLists(Number(categoryId));
        } else if (recommend) {
          this.getRecommendOne(recommend);
        } else {
          this.fetchTopicLists();
        }
      },
    },
  };

</script>

<style lang="scss">
  .content {
    float: left;
    width: 100%;
    min-height: 1px;
    .panel {
      display: inline-block;
      float: left;
      width: 20%;
      a {
        display: block;
        &.v-link-active {
          color: #0000AA;
        }
      }
    }
    .content-list {
      display: inline-block;
      box-shadow: 0 0 5px #CCC;
      border-radius: 5px;
      width: 75%;
      float: right;
      .cell {
        border-top: 1px solid #ccc;
        transition: all 1s;
        &:hover {
          box-shadow: -5px -5px 5px #CCC;
          transform: scale(1.2);
        }
      }
      .cell:nth-child(1){
        border-top: none;
      }

    }
  }

  .sider {
    float: left;
    width: 30%;
    box-sizing: border-box;
    padding-left: 20px;
    display: none;
  }

  @media (max-width: 512px) {
    .content {
      float: none;
      width: 100%;
    }
    .sider {
      float: none;
      width: 100%;
      padding-left: 0;
    }
  }

</style>

<template>
  <div class="content">
    <div class="panel">
      <!--<div class="panel-header" v-if="topicLists">-->
        <!--<a v-link="{name: 'index'}">全部</a><a v-link="{name: 'tabA', params: {categoryId: tab.categoryID}}"  v-for="tab in topicTabs"  :class="tab.categoryID === currentTab ? 'active' : ''" >{{ tab.name }}</a>-->
      <!--</div>-->
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

<style lang="scss" scoped>
  .content {
    float: left;
    width: 100%;
    min-height: 1px
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

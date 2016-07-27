<template>
  <div>
    <div class="content">
      <div class="panel">
          <ul class="panel-header" v-if="topicLists">
            <li v-for="tab in topicTabs">
              <a @click.prevent.stop="update($index,tab.categoryID)"
                 :class="{'link-active': $index === selected}" >{{ tab.name }}</a>
            </li>
          </ul>
        <c-hint v-if="hint.show"></c-hint>
        <c-list :items='topicLists' v-else ></c-list>
      </div>
    </div>
    <div class="sider">
      <c-siderbar></c-siderbar>
    </div>
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
    methods: {
      update(index, categoryId) {
        this.fetchCategoryicLists(Number(categoryId));
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
  .link-active{
    background: #5bc0de;
  }
  .panel-header{
    overflow: hidden;
    background: #fff;
    margin-bottom: 20px;
    li{
      float: left;
      padding: 5px 10px;
      border: 1px solid #eee;
      margin: 5px 10px;
      border-radius: 10px;
      &:hover{
        background: #5bc0de;
        a{
          color: #fff;
        }
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

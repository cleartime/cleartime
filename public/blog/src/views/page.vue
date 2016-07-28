<template>
    <div class="content">
      <div class="panel">
          <ul class="panel-header" v-if="topicLists">
            <li v-for="tab in topicTabs" :class="$index === selected ? 'link-active' : ''" >
              <a @click.prevent.stop="update($index,tab.categoryID)">{{ tab.name }}</a>
            </li>
          </ul>
        <c-hint v-if="hint.show"></c-hint>
        <c-list :items='topicLists' v-else ></c-list>
      </div>
    </div>
</template>

<script>
  /* eslint-disable max-len */
  import cHint from '../components/hint';
  import cList from '../components/list';
  import { fetchTopicLists, showHint, initHint, loginSuccuess, fetchCategoryicLists, getRecommend, getRecommendOne, listName } from '../vuex/actions';
  import { getTopicLists, getHint, getTopicTabs, getListname } from '../vuex/getters';
  export default {
    data() {
      return {
        selected: 0,
      };
    },
    components: {
      cHint,
      cList,
    },
    vuex: {
      actions: {
        fetchCategoryicLists,
        loginSuccuess,
        fetchTopicLists,
        showHint,
        initHint,
        getRecommend,
        getRecommendOne,
        listName,
      },
      getters: {
        topicTabs: getTopicTabs,
        topicLists: getTopicLists,
        hint: getHint,
        getlistname: getListname,
      },
    },
    route: {
      data({ to: { params: { recommend } } }) {
        // 初始化hint
        this.initHint();
        // 显示hint
        this.showHint();
        // 获取栏目
        this.loginSuccuess();
        // 获取标签
        this.getRecommend();
        // 获取文章列表
        if (this.getlistname.id) {
          this.selected = this.getlistname.index;
          this.fetchCategoryicLists(Number(this.getlistname.id));
        } else if (recommend) {
          this.getRecommendOne(recommend);
        } else {
          this.fetchTopicLists();
        }
      },
    },
    methods: {
      update(index, categoryId) {
        this.selected = index;
        if (!categoryId) {
          this.fetchTopicLists();
        } else {
          this.fetchCategoryicLists(Number(categoryId));
        }
        this.listName(this.topicTabs[index], index);
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
      &:hover, &.link-active{
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

<template>
  <div class="back-top" v-show="show">
    <a href="#" @click.prevent.stop="toTop"><i class="iconfont icon-back2top"></i></a>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        show: false,
      };
    },
    methods: {
      toTop() {
        document.body.scrollTop = 0;
      },
    },
    mounted() {
      this.$nextTick(function () {
        window.onscroll = () => {
          if (document.body.scrollTop > 400) {
            this.show = true;
          } else {
            this.show = false;
          }
        };
      });
    },
    beforeDestory() {
      window.onscroll = null;
    },
  };
</script>

<style lang="scss">
  @import '../assets/font/iconfont';
  .back-top {
    padding: 8px 5px 8px 8px;
    border-radius: 8px 0 0 8px;
    position: fixed;
    right: 0;
    bottom: 98px;
    width: 16px;
    background-color: #f7f6f6;
  }
</style>

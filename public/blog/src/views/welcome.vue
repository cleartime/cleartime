<template>
  <div class='welcome' :class=" isShowWelcomeLever ? 'welcome-lever' : ''">
    <p>{{ isShowWelcomeLever }}</p>
    <div class="pic head-enter" @click="closeWelcomePage"></div>
  </div>
</template>

<script>
  import { getTopicLists } from '../vuex/getters';
  export default {
    data() {
      return {
        isShowWelcomeLever: false,
      };
    },
    vuex: {
      getters: {
        getTopicLists,
      },
    },
    methods: {
      closeWelcomePage() {
        this.isShowWelcomeLever = true;
//        this.$dispatch('isShow', false);
      },
    },
    watch: {
      'getTopicLists': function (newVal, oldVal) { // eslint-disable-line object-shorthand
        if (newVal.length > oldVal.length) {
//          const self = this;
          setTimeout(() => {
//            self.$dispatch('isShow', false);
          }, 2000
        )
          ;
        }
      },
    },
    destroyed() {
      this.isShowWelcomeLever = true;
    },
  };
</script>

<style lang="scss" scoped>
  .welcome {
    display: flex;
    background: url("../assets/bj1.jpg") no-repeat;
    background-size: cover;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    height: 100%;
    .pic {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-image: url("../assets/head.jpeg");
      cursor: pointer;
      transition: transform 2s;
      -webkit-transition: -webkit-transform 2s;
      &:hover {
        transform: rotate(360deg) scale(2)
      }
    }

    .welcome-lever {
      animation: welcome-lever 2s;
    }

    @keyframes welcome-lever {
      0% {
        opacity: 1;
        transform: translateY(0);
      }
      100% {
        opacity: 0;
        transform: translateY(-100%);
      }
    }


    .head-enter {
      animation-name: head-in1;
      animation-duration: 2s;
    }

    .head-leave {
      animation: head-out 2s;
    }

    @keyframes head-in1 {
      0% {
        transform: translateY(-100%);
      }
      85% {
        transform: translateY(0);
      }
      100% {
        transform: translateY(-30px);
      }
    }

    @keyframes head-in2 {
      0% {
        transform: translateY(0px);
      }
      100% {
        transform: translateY(-30px);
      }
    }
  }

</style>

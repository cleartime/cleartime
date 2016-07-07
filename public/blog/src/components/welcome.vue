<template>
  <div class="bg"></div>
  <div class="menu">
    <div class="pic"></div>
    <div>文章</div>
    <div>关于我</div>
    <div>留言</div>
    <div>1111</div>
  </div>
</template>

<script>
</script>

<style lang="scss">
  .bg{
    background: url("../assets/img/bj1.jpg") no-repeat;
    position: fixed;
    width: 100%;
    height: 100%;
    background-size: 100%;
    top: 0;
    left: 0;
    opacity: .5;
  }
  .menu{
    border-radius: 50%;
    width: 200px;
    height:200px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -100px;
    margin-top: -100px;
    .pic{
      position: relative;
      left: 50%;
      top: 50%;
      margin-top: -25px;
      margin-left: -25px;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      background: url("../assets/head.jpeg") no-repeat center center;
      background-size: 100%;
    }
    &>div:not(.pic){
      position: absolute;
      border-radius: 50%;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    &>div:nth-child(2){
      border:1px solid red;
      z-index: 1;
    }
    &>div:nth-child(3){
      border:1px solid green;
      z-index: 2;
    }
    &>div:nth-child(4){
      border:1px solid gray;
      z-index: 3;
    }
    &>div:nth-child(5){
      border:1px solid yellow;
      z-index: 4;
    }

  }
</style>

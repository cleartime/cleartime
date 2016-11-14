<template>
    <div>
      <div class="barContro_space"><span class="vader" :style="{ width: owidth + '%' }" id="barvader"></span></div>
    </div>
</template>
<style scoped>
  .barContro_space {
    margin: 10px 0;
    background: grey;
    border-radius: 5px;
  }
  .vader {
    height: 7px;
    border-radius: 2px;
    display: block;
    width: 0%;
    box-shadow: 0px 0px 10px 1px #3B8CF8, 0 0 1px #3B8CF8, 0 0 1px #3B8CF8, 0 0 1px #3B8CF8, 0 0 1px #3B8CF8, 0 0 1px #3B8CF8, 0 0 1px #3B8CF8;
    background-color: #fff;
  }
</style>
<script>
  export default {
    data() {
      return {
        owidth: 0,
      };
    },
  };
</script>

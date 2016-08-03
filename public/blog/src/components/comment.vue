<template>
    <div>
      <div class="comment-title" v-for="i in data">
        <p class="comment-nickname">{{ i.nickname }}</p>
        <p class="comment-email"><{ i.email }}/p>
        <p class="comment-time">{{ topic.updatedAt | timeToNow }}</p>
        <p class="comment-content">{ i.content }}</p>
      </div>
    </div>
</template>
<style lang="scss" scoped>

</style>
<script>
  export default {
    ready() {
    },
  };
</script>

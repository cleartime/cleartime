<template>
    <div>
      <div class="ds-thread" data-thread-key="{{ topic.objectId }}" data-title="{{ topic.title }}" data-url="http://guixiaoxiao.cn/#!/post/{{ topic.objectId }}/{{ topic.fileId }}"></div>
    </div>
</template>
<style>
</style>
<script>
  export default {
    props: ['topic'],
  };
</script>

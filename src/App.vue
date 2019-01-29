<template>
  <div id="app">
    <a-spin size="large" :spinning="loading" tip="加载中...">
    <router-view/>
    </a-spin>

  </div>
</template>
<script>
  export default {
    computed: {
      loading: function(){
        return this.$store.state.loading;
      }
    }
  }
</script>
<style>

</style>


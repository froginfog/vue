<template>
  <div>
    <a-row type="flex" justify="end">
      <a-col>
        <a-pagination
                :total="total"
                :showTotal="t => `共有 ${t} 条`"
                :pageSize="pageSize"
                :defaultCurrent="1"
                @change="handlePageChange"
        ></a-pagination>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: "Pager",
    props: {
      total: {
        type: Number,
        required: true
      },
      pageSize: {
        type: Number,
        default: 30
      }
    },
    methods: {
      handlePageChange: function(page){
        this.$emit('pageChange', page);
      }
    }
  }
</script>

<style scoped>

</style>

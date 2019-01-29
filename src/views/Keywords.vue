<template>
  <a-layout id="components-layout-demo-fixed-sider">

    <Left pathKey="keywords"></Left>

    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <a-card title="添加关键词" :bordered="false">
          <a-form layout="inline" @submit="addKeyword">
            <a-form-item>
              <a-input
                      placeholder="输入关键词"
                      v-model="keywordName"
              ></a-input>
            </a-form-item>

            <a-form-item>
              <a-button type="primary" htmlType="submit" :disabled="buttonDisabled">确定</a-button>
            </a-form-item>
          </a-form>
        </a-card>
        <a-divider />
        <a-card title="关键词列表" :bordered="false" >

          <a-table
                  bordered
                  :columns="columns"
                  :dataSource="keywords"
                  :rowKey="keyword=>keyword.keyword_id"
                  :loading="loading"
                  :pagination="pagination"
                  :rowSelection="{selectedRowKeys:selected,onChange:onSelectChange}"
                  @change="handleChange"
          >
            <span slot="action" slot-scope="keyword">
              <a href="javascript:;" @click="updateKeyword(keyword.keyword_id)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除这一项吗?" @confirm="deleteKeywords(keyword.keyword_id)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
            <template slot="footer" slot-scope="currentPageData">
              <a-popconfirm title="确定要删除所选项吗？" @confirm="deleteKeywords" @cancel="cancel" :visible="confirmVisible">
                <a-button
                        type="primary"
                        :disabled="deleteButtonDisabled"
                        @click="callConfirm"
                >删除所选</a-button>
              </a-popconfirm>
            </template>
          </a-table>

          <br>
          <!--<a-pagination :defaultCurrent="20" :total="500"/>-->
        </a-card>
      </a-layout-content>
    </a-layout>
    <a-modal
            title="修改关键词"
            :visible="visible"
            @ok="submit"
            @cancel="cancel"
            :confirmLoading="confirmLoading"
    >
          <a-input
                  placeholder="输入关键词"
                  v-model="curKeyword.keyword_name"
          ></a-input>

    </a-modal>
  </a-layout>

</template>

<script>
  import Left from '../components/Left';
  import api from '../api';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'keyword_id',
      width: '5%',
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'keyword_name',
      width: '80%'
    },
    {
      title: '操作',
      scopedSlots: {customRender: 'action'},
      width: '15%',
      align: 'center'
    }
  ];
  export default {
    name: "Keywords",
    components: {Left},
    data: function(){
      return {
        curPage: 1,
        keywordName: '',
        columns,
        keywords: [],
        loading: false,
        confirmLoading: false,
        selected: [],
        visible: false,
        confirmVisible: false,
        curKeyword: {
          keyword_id: '',
          keyword_name: '',
        },
        pagination: {
          defaultPageSize: 30,
          total:0,
          current: 1,
          showTotal: (total) => {
            return `共有${total}项`
          }
        },
      }
    },
    watch: {
      'pagination.current': function(){
        this.keywordsList();
      }
    },
    computed: {
      buttonDisabled: function(){
        return this.keywordName.trim() === '';
      },
      deleteButtonDisabled: function(){

        return this.selected.length < 1;
      }
    },
    methods: {
      addKeyword: function(e){
        e.preventDefault();
        this.$http.post(api.addKeyword, {keyword_name:this.keywordName.trim()}).then(response => {
          this.keywordName = '';
          if(response.data.success){
            this.keywordsList();
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        })
      },
      keywordsList: function(){
        this.loading = true;
        this.$http.all([
          this.$http.get(api.keywords, {params: {page: this.pagination.current}}),
          this.$http.get(api.keywordsCount)
        ]).then(this.$http.spread((keywordsRresponse, countResponse) => {
          if(keywordsRresponse.data.success){
            this.keywords = keywordsRresponse.data.keywords;
          }else{
            this.$store.dispatch('notice', {type:'error',title:'错误',message:keywordsRresponse.data.message})
          }
          if(countResponse.data.success){
            this.pagination.total = +countResponse.data.count;
          }else{
            this.$store.dispatch('notice', {type:'error',title:'错误',message:countResponse.data.message})
          }
        }));
        this.loading = false;
      },
      onSelectChange(keys){
        this.selected = keys;
      },
      deleteKeywords(){
        let params;
        if(arguments[0] instanceof Object){
          params = {id: this.selected};
        }else{
          params = {id: arguments[0]};
        }
        this.$http.post(api.deleteKeywords, params).then(response => {
          this.confirmVisible = false;
          if(response.data.success){
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '操作完成'
            });
            this.keywordsList();
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      },
      updateKeyword(keyword_id){
        for(let item of this.keywords){
          if(item.keyword_id === keyword_id){
            this.curKeyword = item;
          }
        }
        this.visible = true;
      },
      submit(){
        this.confirmLoading = true;
        this.$http.post(api.updateKeyword, this.curKeyword).then(response => {
          this.confirmLoading = false;
          this.visible = false;
          if(response.data.success){
            this.keywordsList();
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '操作完成'
            })
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        })
      },
      callConfirm(){
        this.confirmVisible = true;
      },
      cancel(){
        this.confirmVisible = false;
        this.visible = false;
      },
      handleChange(p){
        this.pagination.current = p.current;
      }
    },
    mounted(){
      this.keywordsList();
      // console.log(this.keywords);
      this.$store.dispatch('toggleLoading', false);
    },
    destroyed(){
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>

</style>

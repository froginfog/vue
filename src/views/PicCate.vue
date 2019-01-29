<template>
  <a-layout id="components-layout-demo-fixed-sider">

    <Left pathKey="pic,picCate"></Left>

    <a-layout :style="{ marginLeft: '200px' }" >
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <a-card title="添加分类" :bordered="false">
          <a-form layout="inline" @submit="addNewPicCate">
            <a-form-item>
              <a-input
                      placeholder="输入分类名称"
                      v-model="newPicCate.pic_cate_name"
              ></a-input>
            </a-form-item>

            <a-form-item>
              <a-select
                      style="width: 400px"
                      :value="newPicCate.pic_cate_father"
                      @change="setNewPicCateFather"
              >
                <a-select-option :value="0">父类</a-select-option>
                <a-select-option v-for="item in picCate" :value="item.pic_cate_id" :key="item.pic_cate_id"><span v-html="item.pic_cate_name"></span></a-select-option>
              </a-select>

            </a-form-item>

            <a-form-item>
              <a-button type="primary" htmlType="submit" :disabled="buttonDisabled">确定</a-button>
            </a-form-item>
          </a-form>
        </a-card>
        <a-divider />
        <a-card title="分类列表" :bordered="false">
          <a-table
                  bordered
                  :columns="columns"
                  :dataSource="picCate"
                  :rowKey="cate=>cate.pic_cate_id"
                  :loading="tableLoading"
                  :pagination="false"
          >
            <span slot="name" slot-scope="_cate" v-html="_cate.pic_cate_name"></span>

            <span slot="level" slot-scope="_cate">{{_cate.level}}级</span>

            <span slot="order" slot-scope="_cate">
              <a-input
                      :id="_cate.pic_cate_id"
                      :placeholder="_cate.pic_cate_order"
                      @blur="e => updatePicCateOrder(e.target.value, _cate.pic_cate_id)"
              ></a-input>
            </span>

            <span slot="rec" slot-scope="_cate">
              <a-switch
                :checked="_cate.pic_cate_isrec | intToBool"
                @change="updateRec(_cate.pic_cate_id)"
              >
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>

            </span>

            <span slot="action" slot-scope="_cate">
              <a href="javascript:;" @click="getPicCateInfo(_cate.pic_cate_id)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除这一项吗?" @confirm="deletePicCate(_cate.pic_cate_id)">
                <a href="javascript:;" @click="callConfirm">删除</a>
              </a-popconfirm>
            </span>

          </a-table>
        </a-card>

      </a-layout-content>
    </a-layout>
    <a-modal
            title="修改分类"
            :width=800
            :visible="visible"
            @cancel="ModalCancel"
            :destroyOnClose="true"
            @ok="updatePicCate"
            :confirmLoading="confirmLoading"
    >
      <a-form
              :layout="'horizontal'"
      >
        <a-form-item label="名称" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }">
          <a-input
                  v-model="curCate.pic_cate_name"
          ></a-input>
        </a-form-item>

        <a-form-item label="关键词" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }">
          <a-select
                  mode="multiple"
                  :value="selectDefaultValue"
                  @change="handleSelectChange"
          >
            <a-select-option v-for="keyword in keywords" :key="keyword.keyword_id" :value="keyword.keyword_id">{{keyword.keyword_name}}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="所属分类" :labelCol="{span:3}" :wrapperCol="{span:18}">
          <a-select
                  :value="curCate.pic_cate_father"
                  @change="updatePicCateFather"
          >
            <a-select-option value="0">父类</a-select-option>
            <a-select-option v-for="cate in picCate" :value="cate.pic_cate_id" :key="cate.pic_cate_id"><span v-html="cate.pic_cate_name"></span></a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="封面" :labelCol="{span:3}" :wrapperCol="{span:18}">
          <a-upload
                  name="file"
                  accept="image/*"
                  :customRequest="fileUpload"
                  listType="picture"
                  :fileList="fileList"
                  :remove="removeFromFileList"
          >
            <a-button>选择图片</a-button>
          </a-upload>
        </a-form-item>

        <a-form-item label="介绍" :labelCol="{ span: 3 }" :wrapperCol="{ span: 18 }">
          <Editor v-model="curCate.pic_cate_intro"></Editor>
        </a-form-item>

      </a-form>
    </a-modal>
  </a-layout>
</template>

<script>
  import Left from '../components/Left';
  import api from '../api';
  import fileUpload from '../upload';
  import Editor from '../components/Editor';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'pic_cate_id',
      width: '5%',
      align: 'center',

    },
    {
      title: '分类名称',
      scopedSlots: {customRender: 'name'},
      width: '55%',
    },
    {
      title: '级别',
      scopedSlots: {customRender: 'level'},
      width: '10%'
    },
    {
      title: '排序',
      scopedSlots: {customRender: 'order'},
      width: '10%',
      align: 'center',
    },
    {
      title: '推荐',
      scopedSlots: {customRender: 'rec'},
      width: '5%',
      align: 'center'
    },
    {
      title: '操作',
      scopedSlots: {customRender: 'action'},
      width: '10%',
      align: 'center'
    }
  ];
  let _ = require('lodash');
  export default {
    name: "PicCate",
    data: function(){
      return {
        columns,
        tableLoading: false,
        confirmVisible: false,
        picCate: [],
        newPicCate: {
          pic_cate_name: '',
          pic_cate_father: 0,
        },
        visible: false,
        curCate: {},
        keywords: [],
        selectDefaultValue: [],
        fileList: [],
        confirmLoading: false
      }
    },
    components: {Left,Editor},
    watch: {
      'curCate.pic_cate_keyword': function(){
        if(JSON.stringify(this.curCate) !== '{}'){
          for(let item of this.curCate.pic_cate_keyword){
            this.selectDefaultValue.push(item.keyword_id)
          }
        }

      },
      'curCate.pic_cate_cover': function(){
        if(this.curCate.pic_cate_cover){
          this.fileList = [{
            uid: this.curCate.pic_cate_cover,
            name: this.curCate.pic_cate_cover,
            url: api.baseUrl + this.curCate.pic_cate_cover
          }];
        }else{
          this.fileList = [];
        }

      }
    },
    computed: {
      buttonDisabled: function(){
        return this.newPicCate.pic_cate_name.trim() === '';
      },
    },
    methods: {
      picCateList: function () {
        this.tableLoading = true;
        this.$http.all([
          this.$http.get(api.picCateList)
        ]).then(this.$http.spread((piccateResponse) => {
          this.picCate = piccateResponse.data.cate;
        }));
        this.tableLoading = false;
      },
      setNewPicCateFather: function (value) {
        this.newPicCate.pic_cate_father = value;
      },
      addNewPicCate: function (e) {
        e.preventDefault();
        this.$http.post(api.addPicCate, this.newPicCate).then(response => {
          if (response.data.success) {
            this.newPicCate.pic_cate_father = 0;
            this.newPicCate.pic_cate_name = '';
            this.picCateList();
          } else {
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      },
      updatePicCateOrder: _.debounce(function (value, id) {
        if(isNaN(value) || value==='') return false;
        this.tableLoading = true;
        for(let item of this.picCate){
          if(item.pic_cate_id === id){
            item.pic_cate_order = value
          }
        }
        this.$http.post(api.updatePicCateOrder, {
          pic_cate_id: id,
          pic_cate_order: value
        }).then(response => {
          this.tableLoading = false;

          if(response.data.success){
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '修改成功'
            })
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      },500),
      cancel: function(){
        this.confirmVisible = false;
      },
      deletePicCate: function(id){
        this.tableLoading = true;
        this.$http.post(api.deletePicCate, {pic_cate_id: id}).then(response => {
          this.tableLoading = false;
          if(response.data.success){
            for(let index in this.picCate){
              if(this.picCate[index].pic_cate_id === id){
                this.picCate.splice(index, 1)
              }
            }
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '删除成功'
            })
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      },
      callConfirm: function(){
        this.confirmVisible = true;
      },
      updateRec: function(id){
        this.tableLoading = true;
        let rec;
        for(let item of this.picCate){
          if(item.pic_cate_id === id){
            rec = item.pic_cate_isrec === '1' ? '0' : '1';
            item.pic_cate_isrec = rec;
          }
        }
        this.$http.post(api.updatePicCateRec, {
          pic_cate_id: id,
          pic_cate_isrec: rec
        }).then(response => {
          this.tableLoading = false;
          if(response.data.success){
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '修改成功'
            })
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      },
      getPicCateInfo: function(id){
        this.tableLoading = true;
        this.$http.all([
          this.$http.get(api.PicCateDetail, {params: {pic_cate_id: id}}),
          this.$http.get(api.keywordsNoPage)
        ]).then(this.$http.spread((detailResponse, keywordResponse) => {
          this.tableLoading = false;
          if(detailResponse.data.success && keywordResponse.data.success){
            this.curCate = detailResponse.data.detail;
            this.keywords = keywordResponse.data.keywords;
            this.visible = true;
            console.log(this.curCate);
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: detailResponse.data.success ? keywordResponse.data.message : detailResponse.data.message
            })
          }
        }))
      },
      handleSelectChange: function(value){
        console.log(value);
        this.selectDefaultValue = value;
      },
      updatePicCateFather: function(value){
        this.curCate.pic_cate_father = value;
      },
      fileUpload: function(data){
        fileUpload(data.file).then(res => {
          this.curCate.pic_cate_cover = res;
        });
      },
      removeFromFileList: function(){
        this.curCate.pic_cate_cover = '';
      },
      ModalCancel: function(){
        this.visible = false;
        this.selectDefaultValue = [];
      },
      updatePicCate: function(){
        this.confirmLoading = true;
        const payload = this.curCate;
        payload.pic_cate_keyword = this.selectDefaultValue;
        this.selectDefaultValue = [];
        this.curCate = {};
        this.$http.post(api.updatePicCate, payload).then(response => {
          if(response.data.success){
            this.confirmLoading = false;
            this.visible = false;

            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '修改成功'
            });
            this.picCateList();
          }else{
            this.confirmLoading = false;
            this.visible = false;
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            });
          }
        })
      }
    },
    mounted() {
      this.$store.dispatch('toggleLoading', false);
      this.picCateList();

    },
    destroyed() {
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>

</style>

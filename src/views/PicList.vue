<template>
  <a-layout>
    <Left pathKey="pic,picList"></Left>

    <a-layout :style="{ marginLeft: '200px' }" >
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <a-card title="筛选" :bordered="false">
          <a-form layout="inline" @submit="handleSearch">
            <a-form-item>
              <a-input
                      placeholder="名称"
                      v-model="condition.pic_name"
                      @change="searchInputChange"
              ></a-input>
            </a-form-item>

            <a-form-item>
              <a-select
                      style="width: 400px"
                      placeholder="选择所属分类"
                      @change="searchSelectedPicCate"
              >
                <a-select-option key="0" value="">选择所属分类</a-select-option>
                <a-select-option v-for="cate in picCate" :value="cate.pic_cate_id" :key="cate.pic_cate_id"><span v-html="cate.pic_cate_name"></span></a-select-option>
              </a-select>

            </a-form-item>

            <a-form-item>
              <a-select
                      style="width: 100px"
                      placeholder="是否最新"
                      @change="searchSelectedIsnew"
              >
                <a-select-option key="0" value="">是否最新</a-select-option>
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-select
                      style="width: 100px"
                      placeholder="是否推荐"
                      @change="searchSelectedIsRec"
              >
                <a-select-option key="0" value="">是否推荐</a-select-option>
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item>
              <a-select
                      style="width: 100px"
                      placeholder="是否显示"
                      @change="searchSelectedIsShow"
              >
                <a-select-option key="0" value="">是否显示</a-select-option>
                <a-select-option value="1">是</a-select-option>
                <a-select-option value="0">否</a-select-option>
              </a-select>
            </a-form-item>

          </a-form>
        </a-card>
        <a-divider />

        <a-card title="图片列表" :bordered="false" >
          <a-table
                  bordered
                  :loading="tableLoading"
                  :columns="columns"
                  :dataSource="picList"
                  :rowKey="pic=>pic.pic_id"
                  :pagination="false"
                  :rowSelection="{selectedRowKeys:selected,onChange:onSelectChange}"
          >
            <span slot="cover" slot-scope="_pic">
              <a-popover>
                <template slot="content">
                  <img :src="_pic.pic_cover | imageFullSrc" alt="">
                </template>
                <a-icon type="eye" />
              </a-popover>
            </span>

            <span slot="cate" slot-scope="_pic">
              <span v-for="cate in picCate" v-if="cate.pic_cate_id===_pic.pic_cate" :key="cate.pic_cate_id" v-html="cate.pic_cate_name"></span>
            </span>

            <span slot="new" slot-scope="_pic">
              <a-switch
                      :checked="_pic.pic_isnew | intToBool"
                      @change="updateNew(_pic.pic_id)"
              >
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>
            </span>

            <span slot="rec" slot-scope="_pic">
              <a-switch
                      :checked="_pic.pic_isrec | intToBool"
                      @change="updateRec(_pic.pic_id)"
              >
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>
            </span>

            <span slot="show" slot-scope="_pic">
              <a-switch
                      :checked="_pic.pic_isshow | intToBool"
                      @change="updateShow(_pic.pic_id)"
              >
                <a-icon type="check" slot="checkedChildren"/>
                <a-icon type="close" slot="unCheckedChildren"/>
              </a-switch>
            </span>

            <span slot="date" slot-scope="_pic">
              {{_pic.pic_date | timeToStr}}
            </span>

            <span slot="order" slot-scope="_pic">
              <a-input
                      :placeholder="_pic.pic_order"
                      @blur="e=>updatePicOrder(e.target.value, _pic.pic_id)"
              ></a-input>
            </span>

            <span slot="action" slot-scope="_pic">
              <router-link :to="{path:'pic-detail', query:{pic_id:_pic.pic_id}}">修改</router-link>
              <a-divider type="vertical" />
              <a-popconfirm title="确定要删除这一项吗?" @confirm="deletePic(_pic.pic_id)">
                <a href="javascript:;" >删除</a>
              </a-popconfirm>
            </span>

            <span slot="footer" slot-scope="_pic">
              <a-popconfirm title="确定要删除所选项吗？" @confirm="deletePic" @cancel="closeConfirm" :visible="visible">
                <a-button
                        type="primary"
                        :disabled="selectButtonDisabled"
                        @click="callConfirm"
                >删除所选</a-button>
              </a-popconfirm>
            </span>

          </a-table>
          <br>
          <Pager
                  :total="totalPic"
                  @pageChange="handlePageChange"
          ></Pager>
        </a-card>

      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import Left from '../components/Left';
  import Pager from '../components/Pager';
  import api from '../api';
  import _ from 'lodash';

  const columns = [
    {
      title: 'ID',
      dataIndex: 'pic_id',
      width: '5%',
      align: 'center'
    },
    {
      title: '名称',
      dataIndex: 'pic_name',
      width: '25%'
    },
    {
      title: '缩略图',
      scopedSlots: {customRender: 'cover'},
      width: '5%',
      align: 'center'
    },
    {
      title: '所属分类',
      scopedSlots: {customRender: 'cate'},
      width: '15%',
      align: 'center'
    },
    {
      title: '最新',
      scopedSlots: {customRender: 'new'},
      width: '5%',
      align: 'center'
    },
    {
      title: '推荐',
      scopedSlots: {customRender: 'rec'},
      width: '5%',
      align: 'center'
    },
    {
      title: '显示',
      scopedSlots: {customRender: 'show'},
      width: '5%',
      align: 'center'
    },
    {
      title: '添加时间',
      scopedSlots: {customRender: 'date'},
      width: '10%',
      align: 'center'
    },
    {
      title: '排序',
      scopedSlots: {customRender: 'order'},
      width: '10%',
      align: 'center',
    },
    {
      title: '操作',
      scopedSlots: {customRender: 'action'},
      width: '10%',
      align: 'center',
    }
  ];

  export default {
    name: "PicList",
    components: {Left, Pager},
    data: function(){
      return {
        columns,
        condition: {
          pic_name: '',
          pic_cate: '',
          pic_isnew: '',
          pic_isrec: '',
          pic_isshow: '',
          page: 1
        },
        totalPic: 0,
        picCate: [],
        picList: [],
        tableLoading: false,
        selected: [],
        visible: false
      }
    },
    computed: {
      // searchButtonDisabled: function(){
      //   for(let index in this.condition){
      //     if(this.condition.hasOwnProperty(index)){
      //       if(index === 'page') continue;
      //       if(this.condition[index] !== ''){
      //         return false
      //       }
      //     }
      //   }
      //   return true;
      // }
      selectButtonDisabled: function(){
        return this.selected.length < 1;
      }
    },
    methods: {
      handleSearch: function(e){
        e.preventDefault();
        this.getPicList();
      },
      getPicList: function(){
        this.$http.get(api.picList, {params: this.condition}).then(response => {
          this.totalPic = +response.data.pic.count;
          this.picList = response.data.pic.pic;
        })
      },
      getPicCate: function(){
        this.$http.get(api.picCateList).then(response => {
          if(response.data.success){
            this.picCate = response.data.cate;
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      },
      searchInputChange: _.debounce(function(e){
        this.condition.pic_name = e.target.value;
        this.getPicList();
      }, 500),
      searchSelectedPicCate: function(value){
        this.condition.pic_cate = value;
        this.getPicList();
      },
      searchSelectedIsnew: function(value){
        this.condition.pic_isnew = value;
        this.getPicList();
      },
      searchSelectedIsRec: function(value){
        this.condition.pic_isrec = value;
        this.getPicList();
      },
      searchSelectedIsShow: function(value){
        this.condition.pic_isshow = value;
        this.getPicList();
      },
      updateNew: function(id){
        this.tableLoading = true;
        let check;
        for(let item of this.picList){
          if(item.pic_id === id){
            check = item.pic_isnew === '1' ? '0' : '1';
            item.pic_isnew = check
          }
        }
        this.$http.post(api.picCheck, {
          pic_id: id,
          value: check,
          action: 'new'
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
              title: '失败',
              message: response.data.message
            })
          }
        });
      },
      updateRec: function(id){
        this.tableLoading = true;
        let check;
        for(let item of this.picList){
          if(item.pic_id === id){
            check = item.pic_isrec === '1' ? '0' : '1';
            item.pic_isrec = check
          }
        }
        this.$http.post(api.picCheck, {
          pic_id: id,
          value: check,
          action: 'rec'
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
              title: '失败',
              message: response.data.message
            })
          }
        });
      },
      updateShow: function(id){
        this.tableLoading = true;
        let check;
        for(let item of this.picList){
          if(item.pic_id === id){
            check = item.pic_isshow === '1' ? '0' : '1';
            item.pic_isshow = check
          }
        }
        this.$http.post(api.picCheck, {
          pic_id: id,
          value: check,
          action: 'show'
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
              title: '失败',
              message: response.data.message
            })
          }
        });
      },
      updatePicOrder: _.debounce(function(value, id){
        const v = value.trim();
        if(isNaN(v) || v ==='') return false;
        this.tableLoading = true;
        this.$http.post(api.updatePicOrder, {
          pic_id: id,
          pic_order: v
        }).then(response => {
          this.tableLoading = false;
          if(response.data.success){
            for(let item of this.picList){
              if(item.pic_id === id){
                item.pic_order = v
              }
            }
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '修改成功'
            })
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '失败',
              message: response.data.message
            })
          }
        });
      }, 500),
      onSelectChange: function(key){
        this.selected = key;
      },
      callConfirm: function(){
        this.visible = true;
      },
      closeConfirm: function(){
        this.visible = false;
      },
      deletePic: function(){
        this.tableLoading = true;
        this.visible = false;
        let params;
        if(arguments[0] instanceof Object){
          params = {pic_id: this.selected};
        }else{
          params = {pic_id: arguments[0]};
        }
        this.$http.post(api.deletePic, params).then(response => {
          if(response.data.success){
            this.$store.dispatch('notice', {
              type: 'success',
              title: '完成',
              message: '修改成功'
            });
            this.getPicList();
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '失败',
              message: response.data.message
            })
          }
          this.tableLoading = false;
        });
      },
      handlePageChange: function(page){
        this.condition.page = page;
        this.getPicList();
      }
    },
    mounted(){
      this.getPicCate();
      this.getPicList();
      this.$store.dispatch('toggleLoading', false);
    },
    destroy(){
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>

</style>

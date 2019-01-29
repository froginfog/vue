<template>
  <a-layout>
    <Left pathKey="pic,picDetail"></Left>

    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <a-card :bordered="false">
          <a-row :gutter="20">
            <a-form @submit="handleSubmit">
              <a-col :span="18">

                <a-form-item :wrapperCol="{span:2}">
                  <a-button type='primary' htmlType='submit'>
                    确定{{pic.pic_cate}}
                  </a-button>
                </a-form-item>

                <a-form-item
                        label="公司名称"
                        :labelCol="{ span: 24 }"
                        :wrapperCol="{ span: 24 }"
                        :validateStatus="validate.pic_name.status"
                        :help="validate.pic_name.help"
                >
                  <a-input
                          v-model="pic.pic_name"
                  ></a-input>
                </a-form-item>

                <a-row :gutter="20">
                  <a-col :span="12">
                    <a-form-item label="所属分类" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                      <a-select
                              :value="pic.pic_cate"
                              @change="handleCateChange"
                              :validateStatus="validate.pic_cate.status"
                              :help="validate.pic_cate.help"
                      >
                        <a-select-option value="" :key="0">选择所属分类</a-select-option>
                        <a-select-option v-for="cate in picCate" :value="cate.pic_cate_id" :key="cate.pic_cate_id"><span v-html="cate.pic_cate_name"></span></a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item label="添加日期" :labelCol="{ span:24}" :wrapperCol="{ span:24 }">
                      <a-date-picker
                              style="width: 100%"
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              :value="handleDate"
                              :validateStatus="validate.pic_date.status"
                              :help="validate.pic_date.help"
                      ></a-date-picker>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="封面" :labelCol="{span:24}" :wrapperCol="{span:24}">
                  <a-upload
                          :fileList="imageList"
                          list-type="picture"
                          :customRequest="imageUpload"
                          :remove="coverRemove"
                          :validateStatus="validate.pic_cover.status"
                          :help="validate.pic_cover.help"
                  >
                    <a-button>点击选择图片</a-button>
                  </a-upload>
                </a-form-item>

                <a-form-item label="内容" :labelCol="{span:24}" :wrapperCol="{span:24}">
                  <Editor
                          :value="pic.pic_content"
                  ></Editor>
                </a-form-item>

              </a-col>
              <a-col :span="6">
                <a-form-item label="简介" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-textarea
                          :rows="4"
                          :value="pic.pic_intro"
                  ></a-textarea>
                </a-form-item>

                <a-form-item label="最新" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          :checked="pic.pic_isnew | intToBool"
                          @change="handleNewChange"
                  ></a-switch>
                </a-form-item>

                <a-form-item label="推荐" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          :checked="pic.pic_isrec | intToBool"
                          @change="handleRecChange"
                  ></a-switch>
                </a-form-item>

                <a-form-item label="显示" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          :checked="pic.pic_isshow | intToBool"
                          @change="handleShowChange"
                  ></a-switch>
                </a-form-item>

                <a-form-item label="更多图片" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-upload
                          list-type="picture"
                          :fileList="multiImageList"
                          :customRequest="multiImageUpload"
                          :remove="multiImageListRemove"
                  >
                    <a-button>点击选择图片</a-button>
                  </a-upload>
                </a-form-item>

                <a-form-item label="关键词" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-select
                          mode="multiple"
                          :value="selectedKeywords"
                  >
                    <a-select-option v-for="keyword in keywords" :value="keyword.keyword_id" :key="keyword.keyword_id">{{keyword.keyword_name}}</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="规格" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-input
                          :value="pic.pic_spec"
                  ></a-input>
                </a-form-item>

                <a-form-item label="价格" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-input
                          :value="pic.pic_price"
                  ></a-input>
                </a-form-item>

                <a-form-item label="附件" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-upload
                          list-type="text"
                          :fileList="fileList"
                          :customRequest="multiFileUpload"
                  >
                    <a-button>点击选择文件</a-button>
                  </a-upload>
                </a-form-item>

              </a-col>
            </a-form>
          </a-row>
        </a-card>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import Left from '../components/Left';
  import Editor from '../components/Editor';
  import api from '../api';
  import moment from 'moment';
  import fileUpload from '../upload';
  import {notification} from 'ant-design-vue';

  export default {
    name: "PicDetail",
    components: {Left, Editor},
    data: function(){
      return {
        picCate: [],
        keywords: [],
        selectedKeywords: [],
        pic: {
          pic_id: '',
          pic_name: '',
          pic_cate: '',
          pic_date: '',
          pic_cover: '',
          pic_content: '',
          pic_intro: '',
          pic_isnew: 0,
          pic_isrec: 0,
          pic_isshow: 1,
          pic_keyword: [],
          pic_more: '',
          pic_spec: '',
          pic_price: '',
          pic_attach: '',
        },
        validate: {
          pic_name: {
            status: '',
            help: ''
          },
          pic_cate: {
            status: '',
            help: ''
          },
          pic_date: {
            status: '',
            help: ''
          },
          pic_cover: {
            status: '',
            help: ''
          }
        },
        imageList: [],
        multiImageList: [],
        fileList: [],
        second: 10,
        timer: null
      }
    },
    watch: {
      'pic.pic_cover': function(){
        if(this.pic.pic_cover === ''){
          this.imageList = [];
        }else{
          this.imageList = [{
            uid: this.pic.pic_cover,
            name: this.pic.pic_cover,
            url: api.baseUrl + this.pic.pic_cover
          }]
        }
      },
      'pic.pic_more': function(){
        this.multiImageList = [];
        if(this.pic.pic_more !== ''){
          const listArr = this.pic.pic_more.split(',');
          for(let item of listArr){
            let _item = {
              uid: item,
              name: item,
              url: api.baseUrl + item
            };
            this.multiImageList.push(_item);
          }
        }
      },
      'pic.pic_attach': function(){
        this.fileList = [];
        if(this.pic.pic_attach !== ''){
          const listArr = this.pic.pic_attach.split(',');
          for(let item of listArr){
            let _item = {
              uid: item,
              name: item,
              url: api.baseUrl + item
            };
            this.fileList.push(_item);
          }
        }
      },
      'pic.pic_cate': function(){
        this.$store.dispatch('toggleLoading', true);

        this.$http.get(api.keywordsForPicCate, {params: {pic_cate_id: this.pic.pic_cate}}).then(response => {
          this.$store.dispatch('toggleLoading', false);
          if(response.data.success){
            this.keywords = response.data.keywords
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '失败',
              message: response.data.message
            })
          }
        });
      }
    },
    computed: {
      handleDate: {
        get: function(){
          const date = new Date();
          date.setTime(this.pic.pic_date * 1000);
          const y = date.getFullYear();
          let m = date.getMonth() + 1;
          m = m < 10 ? ('0' + m) : m;
          let d = date.getDate();
          d = d < 10 ? ('0' + d) : d;
          const res =  y + m + d;
          return moment(res, 'YYYY-MM-DD');
        },
        set: function(newDate){
          console.log(newDate);
        }
      }
    },
    methods: {
      getPicDetail: function(){
        this.$http.get(api.picDetail, {params: {pic_id: this.$route.query.pic_id}}).then(response => {
          this.pic = response.data.detail;
        });
      },
      getKeywordsForPic: function(){
        this.$http.get(api.keywordsForPic, {params: {pic_id: this.$route.query.pic_id}}).then(response => {
          if(response.data.success){
            if(response.data.keywords.length === 0){
              this.selectedKeywords = [];
            }else{
              for(let item of response.data.keywords){
                this.selectedKeywords.push(item.keyword_id);
              }
            }
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '失败',
              message: response.data.message
            })
          }
        })
      },
      getPicCate: function(){
        this.$http.get(api.picCateList).then(response => {
          if(response.data.success){
            this.picCate = response.data.cate;
          }else{
            this.$store.dispatch('notice', {type: 'error', title: '失败', message: response.data.message})
          }
          console.log(this.picCate);
        });
      },
      imageUpload: function(data){
        fileUpload(data.file).then(res => {
          this.pic.pic_cover = res;
        });
      },
      multiImageUpload: function(data){
        fileUpload(data.file).then(res => {
          if(this.pic.pic_more === ''){
            this.pic.pic_more = res;
          }else{
            this.pic.pic_more += ',' + res;
          }
        })
      },
      multiFileUpload: function(data){
        fileUpload(data.file).then(res => {
          if(this.pic.pic_attach === ''){
            this.pic.pic_attach = res;
          }else{
            this.pic.pic_attach += ',' + res;
          }
        })
      },
      coverRemove: function(){
        this.pic.pic_cover = '';
      },
      handleNewChange: function(value){
        if(value){
          this.pic.pic_isnew = '1';
        }else{
          this.pic.pic_isnew = '0';
        }
      },
      handleRecChange: function(value){
        if(value){
          this.pic.pic_isrec = '1';
        }else{
          this.pic.pic_isrec = '0';
        }
      },
      handleShowChange: function(value){
        if(value){
          this.pic.pic_isshow = '1';
        }else{
          this.pic.pic_isshwo = '0';
        }
      },
      multiImageListRemove: function(image){
        const lisArr = this.pic.pic_more.split(',');
        for(let index in lisArr){
          if(lisArr[index] === image.uid)
            lisArr.splice(index, 1);
        }
        this.pic.pic_more = lisArr.join(',');
      },
      handleCateChange: function(value){
        this.pic.pic_cate = value;
        this.selectedKeywords = [];
      },
      handleSubmit: function(e){
        e.preventDefault();
        let validate = true;
        if(this.pic.pic_name === ''){
          validate = false;
          this.validate.pic_name.status = 'error';
          this.validate.pic_name.help = '名称必须填写';
        }
        if(this.pic.pic_cate === ''){
          validate = false;
          this.validate.pic_cate.status = 'error';
          this.validate.pic_cate.help = '必须选择分类';
        }
        if(this.pic.pic_date === ''){
          validate = false;
          this.validate.pic_date.status = 'error';
          this.validate.pic_date.help = '日期必须选择';
        }
        if(this.pic.pic_cover === ''){
          validate = false;
          this.validate.pic_cover.status = 'error';
          this.validate.pic_cover.help = '必须选择一张图片';
        }
        if(validate){
          this.$store.dispatch('toggleLoading', true);
          this.$http.post(api.picUpdate, this.pic).then(response => {
            this.$store.dispatch('toggleLoading', false);
            if(response.data.success){
              this.timer = setInterval(()=>{
                this.$router.replace('/pic-list')
              }, this.second * 1000);
              notification.open({
                message: '修改成功',
                description: `点击按钮添加另一个图片，${this.second}秒后跳转到列表页，关闭这个提示可以停留在当前页。`,
                placement: 'bottomRight',
                duration: this.second,
                btn: (h) => {
                  return h(
                    'a-button',
                    {
                      props: {
                        type: 'primary',
                      },
                      on: {
                        click: () => {
                          this.$router.push('/pic-add');
                          notification.close('fuck')
                        },
                        close: () => {
                          clearInterval(this.timer);
                          notification.close('fuck')
                        }
                      }
                    },
                    '新添加一个'
                  )
                }
              });
            }else{
              this.$store.dispatch('notice')
            }
          });
        }
      }
    },
    mounted(){
      this.getPicDetail();
      this.getPicCate();
      this.getKeywordsForPic();
      console.log(this);
      this.$store.dispatch('toggleLoading', false);
    },
    destroyed(){
      clearInterval(this.timer);
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>

</style>

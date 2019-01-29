<template>
  <a-layout>
    <Left pathKey="pic,picAdd"></Left>

    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <a-card :bordered="false">
          <a-row :gutter="20">
            <a-form @submit="handleSubmit">
              <a-col :span="18">

                <a-form-item :wrapperCol="{span:2}">
                  <a-button type='primary' htmlType='submit'>
                    确定
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
                    <a-form-item
                            label="所属分类"
                            :labelCol="{ span: 24 }"
                            :wrapperCol="{ span: 24 }"
                            :validateStatus="validate.pic_cate.status"
                            :help="validate.pic_cate.help"
                    >
                      <a-select
                              @change="handlePicCateChange"
                      >
                        <a-select-option value="" :key="0">选择所属分类</a-select-option>
                        <a-select-option v-for="cate in picCate" :value="cate.pic_cate_id" :key="cate.pic_cate_id"><span v-html="cate.pic_cate_name"></span></a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :span="12">
                    <a-form-item
                            label="添加日期"
                            :labelCol="{ span:24 }"
                            :wrapperCol="{ span:24 }"
                            :validateStatus="validate.pic_date.status"
                            :help="validate.pic_cate.help"
                    >
                      <a-date-picker
                              style="width: 100%"
                              showTime
                              format="YYYY-MM-DD HH:mm:ss"
                              @change="handleDateChange"
                      ></a-date-picker>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item
                        label="封面"
                        :labelCol="{span:24}"
                        :wrapperCol="{span:24}"
                        :validateStatus="validate.pic_cover.status"
                        :help="validate.pic_cover.help"
                >
                  <a-upload
                          accept="image/*"
                          :customRequest="imageUpload"
                          listType="picture"
                          :fileList="imageList"
                  >
                    <a-button>点击选择图片</a-button>
                  </a-upload>
                </a-form-item>

                <a-form-item label="内容" :labelCol="{span:24}" :wrapperCol="{span:24}">
                  <Editor
                          v-model="pic.pic_content"
                  ></Editor>
                </a-form-item>

              </a-col>
              <a-col :span="6">
                <a-form-item label="简介" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-textarea
                          :rows="4"
                          v-model="pic.pic_intro"
                  ></a-textarea>
                </a-form-item>

                <a-form-item label="最新" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          @change="handleNewSwitch"
                  ></a-switch>
                </a-form-item>

                <a-form-item label="推荐" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          @change="handleRecSwitch"
                  ></a-switch>
                </a-form-item>

                <a-form-item label="显示" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-switch
                          checkedChildren="是"
                          unCheckedChildren="否"
                          defaultChecked
                          @change="handleShowSwitch"
                  ></a-switch>
                </a-form-item>

                <a-form-item label="更多图片" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-upload
                          :fileList="multiImageList"
                          accept="image/*"
                          list-type="picture"
                          :customRequest="multiImageUpload"
                          :remove="multiImageRemove"
                  >
                    <a-button>点击选择图片</a-button>
                  </a-upload>
                </a-form-item>

                <a-form-item label="关键词" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-select
                          mode="multiple"
                          @change="handleKeywordSwitch"
                  >
                    <a-select-option v-for="keyword in keywords" :value="keyword.keyword_id" :key="keyword.keyword_id">{{keyword.keyword_name}}</a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="规格" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-input
                          v-model="pic.pic_spec"
                  ></a-input>
                </a-form-item>

                <a-form-item label="价格" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-input
                          v-model="pic.pic_price"
                  ></a-input>
                </a-form-item>

                <a-form-item label="附件" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
                  <a-upload
                          :fileList="fileList"
                          list-type="text"
                          :customRequest="fileUpload"
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
  import fileUpload from '../upload';
  import {notification} from 'ant-design-vue';

  export default {
    name: "PicAdd",
    components: {Left, Editor},
    data: function(){
      return {
        picCate: [],
        keywords: [],
        pic: {
          pic_name: '',
          pic_cate: '',
          pic_date: '',
          pic_cover: '',
          pic_content: '',
          pic_intro: '',
          pic_isnew: 0,
          pic_isrec: 0,
          pic_isshow: 1,
          pic_more: '',
          pic_keyword: [],
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
      };
    },
    watch: {
      'pic.pic_cover': function(){
        console.log(this.pic.pic_cover);
        this.imageList = [{
          uid: this.pic.pic_cover,
          name: this.pic.pic_cover,
          url: api.baseUrl + this.pic.pic_cover
        }]
      },
      'pic.pic_more': function(){
        const listArr = this.pic.pic_more.split(',');
        this.multiImageList = [];
        for(let item of listArr){
          const info = {
            uid: item,
            name: item,
            url: api.baseUrl + item
          };
          this.multiImageList.push(info);
        }
      },
      'pic.pic_attach': function(){
        this.fileList = [{
          uid:this.pic.pic_attach,
          name: this.pic.pic_attach,
          url: api.baseUrl + this.pic.pic_attach
        }];
      }
    },
    methods: {
      getPicCate: function(){
        this.$http.get(api.picCateList).then(response => {
          if(response.data.success){
            this.picCate = response.data.cate;
          }else{
            this.$store.dispatch('notice', {type: 'error', title: '失败', message: response.data.message})
          }
        });
      },
      handlePicCateChange: function(value){
        this.$store.dispatch('toggleLoading', true);
        this.pic.pic_cate = value;
        this.$http.get(api.keywordsForPicCate, {params: {pic_cate_id: value}}).then(response => {
          this.$store.dispatch('toggleLoading', false);
          if(response.data.success){
            this.keywords = response.data.keywords;
          }else{
            this.$store.dispatch('notice', {type: 'error', title: '失败', message: response.data.message})
          }
        });
      },
      handleSubmit: function(e){
        e.preventDefault();
        let validate = true;
        if(this.pic.pic_name === ''){
          validate = false;
          this.validate.pic_name.status = 'error';
          this.validate.pic_name.help = '图片名称必须填写';
        }
        if(this.pic.pic_cate === ''){
          validate = false;
          this.validate.pic_cate.status = 'error';
          this.validate.pic_cate.help = '图片名称必须选择';
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
          this.$http.post(api.picAdd, this.pic).then(response => {
            this.$store.dispatch('toggleLoading', false);
            if(response.data.success){
              notification.open({
                message: '添加成功',
                description: `点击按钮添加另一个图片，${this.second}秒后跳转到列表页，关闭这个提示可以停留在当前页。`,
                placement: 'bottomRight',
                duration: 10,
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
                        }
                      }
                    },
                    '新添加一个'
                  )
                }
              });
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
      handleDateChange:function(date, dateString){
        console.log(dateString);
        this.pic.pic_date = dateString;
      },
      imageUpload: function(data){
        fileUpload(data.file).then(res => {
          this.pic.pic_cover = res;
        })
      },
      fileUpload: function(data){
        fileUpload(data.file).then(res => {
          this.pic.pic_attach = res;
        });
      },
      multiImageUpload: function(data){
        fileUpload(data.file).then(res => {
          console.log(res);
          if (this.pic.pic_more === '') {
            this.pic.pic_more = res;
          } else {
            this.pic.pic_more += ',' + res;
          }
        })
      },
      handleNewSwitch: function(value){
        if(value){
          this.pic.pic_isnew = 1;
        }else{
          this.pic.pic_isnre = 0;
        }
      },
      handleRecSwitch: function(value){
        if(value){
          this.pic.pic_isrec = 1;
        }else{
          this.pic.pic_isrec = 0;
        }
      },
      handleShowSwitch: function(value){
        if(value){
          this.pic.pic_isshow = 1;
        }else{
          this.pic.pic_isshow = 0;
        }
      },
      multiImageRemove: function(image){
        const arr = this.pic.pic_more.split(',');
        for(let index in arr){
          if(arr[index] === image.uid){
            arr.splice(index, 1);
          }
        }
        this.pic.pic_more = arr.join(',');
      },
      handleKeywordSwitch: function(value){
        this.pic.pic_keyword = value
      },
    },
    mounted() {
      this.getPicCate();
      this.$store.dispatch('toggleLoading', false);
    },
    destroyed(){
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>

</style>

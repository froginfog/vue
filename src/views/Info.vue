<template>
  <a-layout id="components-layout-demo-fixed-sider">

    <Left pathKey="info"></Left>

    <a-layout :style="{ marginLeft: '200px' }" >
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">

        <a-form :layout="'horizontal'" @submit="infoUpdate">
          <a-form-item label="公司名称" :labelCol="{ span: 2 }" :wrapperCol="{ span: 20 }">
            <a-input
                    v-model="info.info_sitename"
            ></a-input>
          </a-form-item>

          <a-form-item label="网址" :labelCol="{ span: 2 }" :wrapperCol="{ span: 20 }">
            <a-input
                    type="url"
                    v-model="info.info_domain"
            ></a-input>
          </a-form-item>

          <a-form-item label="关键词" :labelCol="{ span: 2 }" :wrapperCol="{ span: 20 }">
            <a-select
                    :value="defaultKeywords"
                    mode="tags"
                    style="width: 100%"
                    @change="newKeywords"
            ></a-select>
          </a-form-item>

          <a-form-item label="描述" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-textarea
                    v-model="info.info_description"
            ></a-textarea>
          </a-form-item>

          <a-form-item label="地址" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_addr"
            ></a-input>
          </a-form-item>

          <a-form-item label="邮编" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_zipcode"
            ></a-input>
          </a-form-item>

          <a-form-item label="联系人" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_linkman"
            ></a-input>
          </a-form-item>

          <a-form-item label="手机" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_mobile"
            ></a-input>
          </a-form-item>

          <a-form-item label="电话" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_phone"
            ></a-input>
          </a-form-item>

          <a-form-item label="传真" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_fax"
            ></a-input>
          </a-form-item>

          <a-form-item label="电子邮箱" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_email"
            ></a-input>
          </a-form-item>

          <a-form-item label="微信" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_wechat"
            ></a-input>
          </a-form-item>

          <a-form-item label="QQ" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_qq"
            ></a-input>
          </a-form-item>

          <a-form-item label="Skype" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_skype"
            ></a-input>
          </a-form-item>

          <a-form-item label="其他" :labelCol="{span:2}" :wrapperCol="{span:20}">
            <a-input
                    v-model="info.info_other"
            ></a-input>
          </a-form-item>

          <a-form-item label="banner" :labelCol="{span:2}" :wrapperCol="{span:3}">
            <a-upload
                    name="file"
                    accept="image/*"
                    :customRequest="fileUpload"
                    listType="picture"
                    :fileList="fileList"
            >
              <a-button>点击选择图片</a-button>
            </a-upload>
          </a-form-item>

          <a-form-item label="轮播" :labelCol="{span:2}" :wrapperCol="{span:3}">
            <a-upload
                    :fileList="multiFileList"
                    name="file"
                    list-type="picture"
                    :customRequest="multiFileUpload"
                    :remove="multiFileListRemove"
            >
              <a-button>点击选择图片</a-button>
            </a-upload>
          </a-form-item>

          <a-form-item :wrapperCol="{span:2,offset:2}">
            <a-button type='primary' htmlType='submit'>
              确定
            </a-button>
          </a-form-item>

        </a-form>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
  import Left from '../components/Left';
  import api from '../api';
  import fileUpload from '../upload';

  export default {
    name: "Info",
    components: {Left},
    data: function () {
      return {
        info: {
          info_sitename: '',
          info_domain: '',
          info_keywords: '',
          info_description: '',
          info_addr: '',
          info_zipcode: '',
          info_linkman: '',
          info_mobile: '',
          info_phone: '',
          info_fax: '',
          info_email: '',
          info_wechat: '',
          info_qq: '',
          info_skype: '',
          info_other: '',
          info_banner: '',
          info_carousel: ''
        },
        fileList: [],
        multiFileList: [],
      }
    },
    methods: {
      multiFileUpload: function (data) {
        fileUpload(data.file).then(res => {
          if (this.info.info_carousel === '') {
            this.info.info_carousel = res;
          } else {
            this.info.info_carousel += ',' + res;
          }
        })
      },
      fileUpload: function (data) {
        fileUpload(data.file).then(res => {
          this.info.info_banner = res;
        });
      },
      newKeywords: function (value) {
        this.info.info_keywords = value.join();
      },
      multiFileListRemove: function (info) {
        console.log(info);
        const list = this.info.info_carousel.split(',');
        for (let index in list) {
          if (list[index] === info.uid) {
            list.splice(index, 1);
          }
        }
        this.info.info_carousel = list.join();
        console.log(this.info.info_carousel);
      },
      infoUpdate: function (e) {
        e.preventDefault();
        this.$store.dispatch('toggleLoading', true);
        this.$http.post(api.siteInfoUpdate, this.info).then(response => {
          this.$store.dispatch('toggleLoading', false);
          if (response.data.success) {
            this.$store.dispatch('notice', {
              type: 'success',
              title: '成功',
              message: '更新成功'
            })
          } else {
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        })
      }
    },
    computed: {
      defaultKeywords: function () {
        return this.info.info_keywords.split(',');
      }
    },
    watch: {
      'info.info_banner': function () {
        this.fileList = [{
          uid: this.info.info_banner,
          name: this.info.info_banner,
          url: api.baseUrl + this.info.info_banner
        }]
      },
      'info.info_carousel': function () {
        const temp = this.info.info_carousel.split(',');
        this.multiFileList = [];
        for (let item of temp) {
          let _info = {
            uid: item,
            name: item,
            url: api.baseUrl + item,
          };
          this.multiFileList.push(_info);
        }
      }
    },
    mounted() {
      this.$http.get(api.siteinfo).then(response => {
        if (response.data.success) {
          this.info = response.data.info;
        } else {
          this.$store.dispatch('notice', {
            type: 'error',
            title: '错误',
            message: response.data.message
          })
        }
        this.$store.dispatch('toggleLoading', false)
      });
    },
    destroyed() {
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>

</style>

<template>
  <a-layout-sider :style="{ overflow: 'auto', height: '100%', position: 'fixed', left: 0 }">
    <div class="logo"><h2>内容管理</h2></div>
    <a-menu
            theme="dark"
            mode="inline"
            :selectedKeys="[selectedKey]"
    >
      <a-menu-item key="info">
        <router-link to="/info">
          <a-icon type="info-circle" />
          <span class="nav-text">基本信息</span>
        </router-link>
      </a-menu-item>
      <a-menu-item key="keywords">
        <router-link to="/keywords">
          <a-icon type="tool" />
          <span class="nav-text">关键词设置</span>
        </router-link>
      </a-menu-item>

      <a-sub-menu key="pic">
        <span slot="title"><a-icon type="picture" /><span>图片类内容</span></span>
        <a-menu-item key="picCate"><router-link to="/pic-cate">分类设置</router-link></a-menu-item>
        <a-menu-item key="picAdd"><router-link to="/pic-add">添加图片</router-link></a-menu-item>
        <a-menu-item key="picList"><router-link to="/pic-list">图片列表</router-link></a-menu-item>
      </a-sub-menu>

      <a-sub-menu>
        <span slot="title"><a-icon type="file-word" /><span>新闻类内容</span></span>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>
      </a-sub-menu>

      <a-sub-menu>
        <span slot="title"><a-icon type="file-text" /><span>单页类内容</span></span>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>
      </a-sub-menu>

      <a-menu-item>
        <a-icon type="message" />
        <span class="nav-text">查看留言</span>
      </a-menu-item>

      <a-sub-menu>
        <span slot="title"><a-icon type="contacts" /><span>联系方式</span></span>
        <a-menu-item key="5">Option 5</a-menu-item>
        <a-menu-item key="6">Option 6</a-menu-item>
        <a-menu-item key="7">Option 7</a-menu-item>
        <a-menu-item key="8">Option 8</a-menu-item>
      </a-sub-menu>

      <a-menu-item>
        <a-icon type="smile" />
        <span class="nav-text">人事招聘</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script>
  export default {
    name: "Left",
    props:{
      pathKey: {
        type: String,
        default: ''
      }
    },
    computed: {
      selectedKey: function(){
        const key = this.pathKey.split(',');
        if(key.length > 1){
          return key[1];
        }else{
          return key[0];
        }
      },
    }
  }
</script>

<style scoped>
  .logo {
    height: 32px;
    margin: 40px;
  }
  h2 {
    color: white;
  }

</style>

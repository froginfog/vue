<template>
  <div class="container-fluid">
    <div class="login-box">
      <div class="login-form row">
        <div class="col-sm-12">
          <div class="login-body">
            <a-form @submit="loginSubmit">
              <a-form-item>
                <a-input
                  placeholder="用户名"
                  v-model="user.username"
                > <a-icon slot="prefix" type='user' style="color: rgba(0,0,0,.25)" /> </a-input>
              </a-form-item>
              <a-form-item>
                <a-input
                  placeholder="密码"
                  v-model="user.password"
                  type="password"
                > <a-icon slot="prefix" type='lock' style="color: rgba(0,0,0,.25)" /> </a-input>
              </a-form-item>

              <a-form-item>
                <a-col :span="11">
                  <a-input
                    placeholder="验证码"
                    v-model="captcha"
                  ></a-input>
                </a-col>
                <a-col :span="11" style="margin-left: 10px">
                  <img :src="imgSrc" @click="refresh">
                </a-col>
              </a-form-item>
              <a-form-item>
                <a-button class="login-form-button" type="primary" htmlType="submit" :disabled="buttonDisable">登入</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../api'
  export default {
    name: "Login",
    data: function(){
      return {
        user: {
          username: '',
          password: ''
        },
        captcha: '',
        imgSrc: null
      }
    },
    computed: {
      buttonDisable: function(){
        return !(this.user.username !== '' && this.user.password !== '' && this.captcha !== '');
      }
    },
    methods: {
      refresh(){
        this.$store.dispatch('toggleLoading');
        this.$http.get(api.verifycode).then(response => {
          this.imgSrc = response.data.src;
          this.$store.dispatch('toggleLoading', false);
        })
      },
      loginSubmit(e){
        e.preventDefault();
        this.$http.post(api.userLogin, {
          username: this.user.username,
          password: this.user.password,
          captcha: this.captcha
        }).then(response => {
          if(response.data.success){
            this.$router.replace('/info');
          }else{
            this.$store.dispatch('notice', {
              type: 'error',
              title: '错误',
              message: response.data.message
            })
          }
        });
      }
    },
    mounted(){
      this.$http.get(api.verifycode).then(response => {
        this.imgSrc = response.data.src;
        this.$store.dispatch('toggleLoading', false);
      });
    },
    destroyed(){
      this.$store.dispatch('toggleLoading', true);
    }
  }
</script>

<style scoped>
  .container-fluid {
    background-color: #353d47;
    background-size: cover;
    position: relative;
    height: 100vh;
  }
  .login-box {
    width: 100%;
    max-width: 320px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -200px;
  }
  .login-form {
    padding: 0;
  }
  .login-body {
    background-color: white;
    padding: 1.5em;
  }
  .login-form-button {
    width: 100%;
  }
</style>

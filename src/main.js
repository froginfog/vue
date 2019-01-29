import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import axios from 'axios';
import VueAxios from 'vue-axios';
import "ant-design-vue/dist/antd.css";
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
  Layout,
  Menu,
  Icon,
  Spin,
  Form,
  Input,
  Select,
  Button,
  Col,
  Row,
  Upload,
  Card,
  Divider,
  Pagination,
  Table,
  Modal,
  Popconfirm,
  Switch,
  Popover,
  DatePicker
} from 'ant-design-vue';

import filters from './filters';

Vue.use(Layout);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(Spin);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Upload);
Vue.use(Card);
Vue.use(Divider);
Vue.use(Pagination);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Popconfirm);
Vue.use(Switch);
Vue.use(Popover);
Vue.use(DatePicker);

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
axios.defaults.baseURL = 'http://localhost/houtai';
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    switch (error.response.status) {
      case 401:
        router.replace('/login');
        break
    }
  }
);

moment.locale('zh-cn');

for(let key in filters){
  if(filters.hasOwnProperty(key)){
    Vue.filter(key, filters[key])
  }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');

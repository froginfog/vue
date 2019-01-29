import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/info'
    },
    {
      path: '/info',
      name: 'info',
      component: () => import('./views/Info.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/keywords',
      name: 'keywords',
      component: () => import('./views/Keywords.vue')
    },
    {
      path: '/pic-cate',
      name: 'picCate',
      component: () => import('./views/PicCate.vue')
    },
    {
      path: '/pic-list',
      name: 'picList',
      component: () => import('./views/PicList.vue')
    },
    {
      path: '/pic-add',
      name: 'picAdd',
      component: () => import('./views/PicAdd.vue')
    },
    {
      path: '/pic-detail',
      name: 'picDetail',
      component: () => import('./views/PicDetail.vue')
    }
  ]
})

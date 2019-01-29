import Vue from 'vue'
import Vuex from 'vuex'
import {notification} from 'ant-design-vue';


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: true
  },
  mutations: {
    toggleLoading: function(state, show){
      state.loading = show;
    },
    notice: function(state, payload){
      notification[payload.type]({
        message: payload.title,
        description: payload.message,
        placement: 'bottomRight'
      })
    }
  },
  actions: {
    toggleLoading: function(context, show){
      context.commit('toggleLoading', show);
    },
    notice: function(context, payload){
      context.commit('notice', payload);
    }
  }
})

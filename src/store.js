import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// root state object.
// each Vuex instance is just a single state tree.
const state = {
  is_loading: false,
  params_total: 0,
  params_page: 1,
  params_key: '房地产',
  params_total_page: 0,
  estate: [],
  dat_58: {
    params_total: 0,
    params_page: 1,
    params_total_page: 0,
  },
  dat_xz: {
    params_total: 0,
    params_page: 1,
    params_total_page: 0,
  },
  laypage: [
    {value: 1,key: 1},
    {value: 2,key: 2},
    {value: 3,key: 3},
    {value: 4,key: 4},
    {value: 5,key: 5}
  ],
  keyword: '房地产',
  api: locartion.host+':8090?',
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
  searchFun: function(state){
    let type='query='+state.keyword.key;
    let nowpage='page='+state['dat_'+state.keyword.key]['params_page'];
    let params=[type, nowpage];
    let url=state.api+params.join('&');
    state.is_loading=true;
    $.get(url, function(response){
      state.is_loading=false;
      state.estate=JSON.parse(response);
    })
  },
  setkeyword (state, key) {
     state.keyword=key;
   },
   setpage (state, page) {
    state['dat_'+state.keyword.key]['params_page']=page.tab;
    state.params_page=page.tab;
    console.log(page);
   }
}

// actions are functions that causes side effects and can involve
// asynchronous operations.
const actions = {
  searchFun: ({ commit }) => commit('searchFun'),
  changesite ({ commit, state }, site) {
    commit('setkeyword', site);
    commit('searchFun');
  },
  changetab ({ commit, state }, tab) {
    commit('setpage', tab);
    commit('searchFun');
  }

}

// getters are functions
const getters = {
  estate: state => state.state,
  keywords: state => state.state,
  params_page: state => state.params_page
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})

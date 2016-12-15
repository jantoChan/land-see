<template>
  <div class="mui-page">
    <header class="mui-bar mui-bar-nav">
        <a class="mui-icon mui-icon-bars mui-pull-left mui-plus-visible"></a>
        <a class="mui-icon mui-pull-right"></a>
        <h1 class="mui-title">个人房源</h1>
      </header>
      <nav class="mui-bar mui-bar-tab">
        <a class="mui-tab-item" 
             href="javascript:;"
             :class="{'mui-active': keyword.key=='58'}"
             @click="set_key(58)">
          <span class="mui-icon icon-58logo iconfont"></span>
          <span class="mui-tab-label">58同城</span>
        </a>
        <a class="mui-tab-item" href="javascript:;"
             :class="{'mui-active': keyword.key=='xz'}"
             @click="set_key('xz')">
          <span class="mui-icon icon-xi iconfont"></span>
          <span class="mui-tab-label">西子湖畔</span>
        </a>
    </nav>
    <div class="mui-progressbar mui-progressbar-success mui-progressbar-infinite"
            v-if="is_loading">
    </div>
    <div class="mui-content-padded">
      <div class="mui-content">
        <div class="mui-card" v-for="(item, index) in estate">
          <a :href="item.links">
            <div class="mui-card-header mui-card-media" :style="{backgroundImage: 'url('+item.pic+')', height: '40vw'}">
            </div>
          </a>
          <div class="mui-card-content">
            <div class="mui-card-content-inner">
              <p v-text="item.title" class="s-c_333"></p>
              <p v-cloak v-html="item.price"> </p>
            </div>
          </div>
          <div class="mui-card-footer">
            <a class="mui-card-link pull-left" v-text="item.address"></a>
            <a class="mui-card-link pull-right" v-text="item.date"></a>
          </div>
        </div>
      </div>
    </div>
    <div class="mui-content-padded" v-if="estate.length>0">
        <ul class="mui-pagination">
          <li class="u-item" v-for="(item, index) in laypage"
                             :class="{'mui-active': cur_page==item.value}"
                             @click="set_page(item.value)">
            <a href="javascript:;" v-cloak class="u-txt">
              {{item.value}}
            </a>
          </li>
        </ul>
      </div>
      <div class="m-for_footer"> </div>
  </div>
</template>

<script>
  require('../../static/js/zepto.min.js')
  import { mapState ,mapActions, mapMutations} from 'vuex'

  export default {
    name: 'search',
    data () {
      return {
        keyWord: '房地产',
        api: 'http://localhost:8090?query='
      }
    },
    computed: {
      ...mapState({
        is_loading: 'is_loading',
        estate: 'estate',
        laypage: 'laypage',
        keyword: 'keyword',
        cur_page: 'params_page'
      }),
    },
   methods: {
      ...mapActions([
        'searchFun', // 映射 this.searchFun() 为 this.$store.dispatch('searchFun')
      ]),
    ...mapMutations({
      setkeyword: 'setkeyword' // 映射 this.add() 为 this.$store.commit('increment')
    }),
      set_key: function(params_key){
        // 以对象形式分发
        this.$store.dispatch({
          type: 'changesite',
          key: params_key
        })
      },
      set_page: function(params_page){
        // 以对象形式分发
        this.$store.dispatch({
          type: 'changetab',
          tab: params_page
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.s-c_333{
  color: #333;
}

.mui-card{
  text-align: left;
}

.pull-left{
  width: 80%;
}
.pull-right{
  text-align: right;
}
.mui-card-link{
  height: auto;
  line-height: 24px;
}

.mui-pagination{
  text-align: left;
}

.mui-pagination .u-item{
  text-align: center;
  margin: 10px auto;
}

.mui-pagination .u-txt{
  margin: 0 4px;
}

.mui-progressbar{
  position: fixed;
  top: 44px;
  left: 0;
  z-index: 2;
}
.m-for_footer{
  height: 50px;
}
</style>

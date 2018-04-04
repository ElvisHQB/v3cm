<template>
  <div id="app" ref="app">
    <common-header class="header"></common-header>
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <tab v-show="tabDisplay" class="tab"></tab>
  </div>
</template>

<script>
  import Tab from 'base/tab/tab'
  import CommonHeader from 'base/commonHeader/commonHeader'
  import { mapMutations } from 'vuex'

  const TAB_ROUTES = ['/newestMeeting', '/historyMeeting', '/meetingInfo', '/personalCenter']

  export default {
    name: 'App',
    //created中的变量，也会动态绑定？
    created() {
      this.tabDisplay = false
      this.regExp = this.genRegExp()
    },
    components: {
      Tab, CommonHeader
    },
    mounted() {
      this.setAppInfo({
        width: this.$refs.app.clientWidth,
        height: this.$refs.app.clientHeight
      })
    },
    methods: {
      ...mapMutations({
        setAppInfo: 'SET_APP_INFO'
      }),
      genRegExp() {
        let regex = ''
        for (let item of TAB_ROUTES) {
          regex += item + '|'
        }
        regex = '^' + regex.substring(0, regex.length - 1) + '$'
        return new RegExp(regex)
      }
    },
    watch: {
      // 根据路由控制底部tab的显示，只在四个tab对应的页面显示tab，其他页面隐藏tab
      $route() {
        this.tabDisplay = this.regExp.test(this.$route.path)
      }
    }
  }
</script>

<style lang="scss">
  @import "./common/scss/index";

  #app {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .header {
      flex: 0 0 auto
    }

    .main {
      flex: 1 1 auto;
      overflow: hidden;
    }

    .tab {
      flex: 0 0 auto;
    }
    .ali-player {
      margin-bottom: 50px;
    }
  }
</style>

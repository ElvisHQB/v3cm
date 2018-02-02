<template>
  <div id="app">
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
  import * as ERR_CODE from 'api/errorCode'
  import { loginUrl, sid } from './api/config'
  import api from './api/fetchData'
  import Tab from 'base/tab/tab'
  import CommonHeader from 'base/commonHeader/commonHeader'
  import { mapMutations } from 'vuex'

  export default {
    name: 'App',
    data () {
      return {
        tabDisplay: true
      }
    },
    components: {
      Tab, CommonHeader
    },
    created () {
      this._login(sid)
    },
    methods: {
      _login (sessionid) {
        const url = loginUrl
        return api.getData(url, 'get', {
          params: {'wind.sessionid': sessionid}
        }).then((res) => {
          console.log(res)
          // TODO mutation state
          //this.userInfo(res)
        }).catch((e) => {
          console.log(e)
          console.log(ERR_CODE)
        })
      },
      ...mapMutations({
        userInfo: 'SET_USER_INFO'
      })
    },
    watch: {
      // 根据路由控制底部tab的显示，只在四个tab对应的页面显示tab，其他页面隐藏tab
      '$route': {
        handler: function () {
          // TODO 路由可配置，不要写死
          const regex = /^(\/newestMeeting)|(\/historyMeeting)|(\/meetingInfo)|(\/personalCenter)$/
          this.tabDisplay = regex.test(this.$route.path)
        },
        immediate: true
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
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .tab {
      flex: 0 0 auto;
    }
    .ali-player {
      margin-bottom: 50px;
    }
  }
</style>

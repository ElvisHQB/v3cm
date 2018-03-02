<template>
  <div id="app">
    <common-header class="header"></common-header>
    <div class="main">
      <div v-show="mainDisplay">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <tab v-show="tabDisplay" class="tab"></tab>
  </div>
</template>

<script>
  import ERR_CODE from './api/errorCode'
  import { loginUrl, sid } from './api/config'
  import api from './api/fetchData'
  import Tab from 'base/tab/tab'
  import CommonHeader from 'base/commonHeader/commonHeader'
  import { mapMutations } from 'vuex'
  import {closeWebView} from './api/native'
  import { SET_SERVERINFO } from './store/mutation-types'
  import { MessageBox } from 'mint-ui'

  export default {
    name: 'App',
    data () {
      return {
        tabDisplay: true,
        mainDisplay: false
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
          params: {'windsessionid': sessionid}
        }).then((res) => {
          console.log(res)
          // TODO mutation state
          //存储serverInfo
          this.$store.commit(SET_SERVERINFO, window.location.href.substr(0, window.location.href.indexOf('/3C')))
          if (res) {
            this.userInfo(res)
            this.sessionId(sessionid)
            this.mainDisplay = true
          } else {
            MessageBox.alert(ERR_CODE.NO_DATE_ERROR.MSG).then(action => {
              //TODO
              closeWebView(true)
            })
          }
        }).catch((e) => {
          console.log(e.response)
          let response = e.response.data ? e.response.data : false
          if (response && response.errorMsg) {
            if (response.errorCode === ERR_CODE.LOGIN_ERR.CODE) {
              MessageBox.alert(ERR_CODE.LOGIN_ERR.MSG).then(action => {
                closeWebView(true)
              })
            } else if (response.errorCode === ERR_CODE.INFO_NOT_COMPLETE.CODE) {
              MessageBox.alert(ERR_CODE.INFO_NOT_COMPLETE.MSG).then(action => {
                closeWebView(true)
              })
            } else if (response.errorCode === ERR_CODE.INFO_ERR.CODE) {
              MessageBox.alert(ERR_CODE.INFO_ERR.MSG).then(action => {
                closeWebView(true)
              })
            } else if (response.errorCode === ERR_CODE.INFO_NEED_REGISTER.CODE) {
              MessageBox.alert(ERR_CODE.INFO_NEED_REGISTER.MSG).then(action => {
                closeWebView(true)
              })
            } else if (response.errorCode === ERR_CODE.STAFF_ERROR.CODE) {
              MessageBox.alert(ERR_CODE.STAFF_ERROR.MSG).then(action => {
                closeWebView(true)
              })
            } else {
              MessageBox.alert(ERR_CODE.NO_DATE_ERROR.MSG).then(action => {
                closeWebView(true)
              })
            }
          } else {
            MessageBox.alert(ERR_CODE.SERVER_ERROR.MSG).then(action => {
              closeWebView(true)
            })
          }
        })
      },
      ...mapMutations({
        userInfo: 'SET_USER_INFO',
        sessionId: 'SET_SESSIONID'
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

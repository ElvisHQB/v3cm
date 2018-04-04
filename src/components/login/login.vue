<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
  import ERR_CODE from 'api/errorCode'
  import {loginUrl} from 'api/config'
  import api from 'api/fetchData'
  import {mapMutations} from 'vuex'
  import {closeWebView, getSessionId} from 'api/native'
  import {MessageBox} from 'mint-ui'

  export default {
    name: 'App',
    data() {
      return {
      }
    },
    created() {
      this._login()
    },
    methods: {
      _login() {
        let sessionId = this.$route.query.windsessionid
        if (!sessionId) {
          sessionId = getSessionId()
        }
        if (sessionId) {
          return api.getData(loginUrl, 'get', {
            params: {'windsessionid': sessionId}
          }).then((res) => {
            console.log(res)
            //存储serverInfo
            this.setServerInfo(window.location.href.substr(0, window.location.href.indexOf('/3C')))
            if (res) {
              this.userInfo(res)
              this.saveSessionId(sessionId)
              this.$router.push(this.$route.query.to.replace('%2F', '/'))
            } else {
              MessageBox.alert(ERR_CODE.NO_DATE_ERROR.MSG).then(action => {
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
        } else {
          MessageBox.alert(ERR_CODE.NO_SESSIONID.MSG).then(action => {
            closeWebView(true)
          })
        }
      },
      ...mapMutations({
        userInfo: 'SET_USER_INFO',
        saveSessionId: 'SET_SESSIONID',
        setServerInfo: 'SET_SERVERINFO'
      })
    }
  }
</script>

<style scoped lang="scss">

</style>

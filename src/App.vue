<template>
  <div id="app">
    <common-header class="header"></common-header>
    <div class="main">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
    <tab class="tab"></tab>
  </div>
</template>

<script>
  import * as ERR_CODE from 'api/errorCode'
  import { HOST } from './api/config'
  import { sid } from 'api/config'
  import api from './api/fetchData'
  import Tab from 'base/tab/tab'
  import CommonHeader from 'base/commonHeader/commonHeader'
  import {mapMutations} from 'vuex'

  export default {
    name: 'App',
    data () {
      return {}
    },
    components: {
      Tab, CommonHeader
    },
    created () {
      this._login(sid)
    },
    methods: {
      _login (sessionid) {
        const url = HOST + '/login.json'
        return api.getData(url, 'get', {
          params: {'wind.sessionid': sessionid}
        }).then((res) => {
          console.log(res)
          // TODO mutation state
          this.userInfo(res)
        }).catch((e) => {
          console.log(e)
          console.log(ERR_CODE)
        })
      },
      ...mapMutations({
        userInfo: 'SET_USER_INFO'
      })
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
  }
</style>

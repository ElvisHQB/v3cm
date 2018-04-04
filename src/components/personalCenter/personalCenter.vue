<template>
  <div class="per-center">
    <div class="scroll-list-wrapper">
      <scroll :data="[]" :pullDownRefresh="true" :pullUpLoad="true"
              @pullingDown="_getUserInfo()"
              class="scroll" ref="scroll">
        <div>
          <per-head :imgUrl="headImg" :userName="name" :inst="inst"></per-head>
          <router-link tag="div" to="/personalCenter/publishedMeeting">
            <per-list :iconTypeClass="'icon-qunfenglianxiren'" :listName=publishedMeeting :listNum="personalCenterCount.publishedMeetingCount"
                      :moreClass="'icon-xiangyou'"></per-list>
          </router-link>
          <router-link tag="div" to="/personalCenter/privateMeeting">
            <per-list :iconTypeClass="'icon-lianxiren'" :listName=privateMeeting :listNum="personalCenterCount.privateMeetingCount"
                      :moreClass="'icon-xiangyou'"></per-list>
          </router-link>
          <router-link tag="div" to="/personalCenter/myCollection">
            <per-list :iconTypeClass="'icon-shoucang1'" :listName=myCollection :listNum="personalCenterCount.myCollectionCount"
                      :moreClass="'icon-xiangyou'"></per-list>
          </router-link>
          <router-link tag="div" to="/personalCenter/latestPlay">
            <per-list :iconTypeClass="'icon-zaixianhuiyi'" :listName=latestPlay :listNum="personalCenterCount.latestPlayCount"
                      :moreClass="'icon-xiangyou'"></per-list>
          </router-link>
          <a @click="_openDownloadPage">
            <per-list :iconTypeClass="'icon-download'" :listName=download :listNum="personalCenterCount.downloadCount"
                      :moreClass="'icon-xiangyou'"></per-list>
          </a>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import perList from './personalCenterList'
  import perHead from './personalCenterHead'
  import {getUserInfoUrl, defaultHead, getUserHeadPortraitByCRMIdUrl} from '../../api/config'
  import api from '../../api/fetchData'
  import ERR_CODE from '../../api/errorCode'
  import {getDownloadItemCount, openDownloadPage, closeWebView} from '../../api/native'
  import {getLatestPlayArray} from '../../common/js/utils'
  import { mapGetters, mapMutations } from 'vuex'
  import Scroll from 'base/scroll/scroll'
  import { MessageBox } from 'mint-ui'

  export default {
    components: {
      perList,
      perHead,
      Scroll
    },
    mounted() {
      this._getUserInfo()
    },
    data() {
      return {
        topPullText: '下拉可以刷新',
        topDropText: '释放立即刷新',
        topLoadingText: '正在刷新...',
        distance: 50,
        noMore: false,
        name: 'null',
        inst: 'null',
        headImg: localStorage.userHead ? localStorage.userHead : '',
        publishedMeeting: '公开会议',
        privateMeeting: '私人会议',
        myCollection: '我的收藏',
        latestPlay: '最近播放',
        download: '下载管理'
      }
    },
    computed: {
      ...mapGetters({
        personalCenterCount: 'personalCenterCount',
        userCrmId: 'userCrmId '
      })
    },
    methods: {
      _getUserInfo() {
        const url = getUserInfoUrl
        return api.getData(url, 'get')
          .then((res) => {
            this.name = res.name ? res.name : '未认证用户'
            this.inst = res.institutionName
            this._getUserHeadPortrait(res.crmId)
            // TODO mutation state
            console.log('res.myMeetingCount' + res.myMeetingCount)
            this.setPersonalCount({type: 'publishedMeeting', num: res.myMeetingCount})
            this.setPersonalCount({type: 'privateMeeting', num: res.myPrivateMeetingCount})
            this.setPersonalCount({type: 'myCollection', num: res.myCollectionCount})
            this.setPersonalCount({type: 'latestPlay', num: this._getLatestPlayCount()})
            this.setPersonalCount({type: 'download', num: getDownloadItemCount()})
            console.log('____log______')
          }).catch((e) => {
            console.log(e.response)
            let response = e.response.data ? e.response.data : false
            if (response && response.errorMsg) {
              if (response.errorCode === ERR_CODE.LOGIN_ERR.CODE) {
                MessageBox.alert(ERR_CODE.LOGIN_ERR.MSG).then(action => {
                  closeWebView(true)
                })
              } else {
                MessageBox.alert(ERR_CODE.NO_DATE_ERROR.MSG).then(action => {
                  closeWebView(true)
                })
              }
            } else {
              MessageBox.alert(ERR_CODE.NO_DATE_ERROR.MSG).then(action => {
                closeWebView(true)
              })
            }
          })
      },
      _getUserHeadPortrait(crmId) {
        const url = getUserHeadPortraitByCRMIdUrl
        return api.getData(url, 'get', {params: {crmId: crmId}})
          .then((res) => {
            if (res && res.length > 0) {
              let iconData = res[0].iconData
              if (iconData.length <= 8) {
                if (localStorage.userHead) {
                  this.headImg = 'data:image/png;base64,' + defaultHead
                  localStorage.removeItem('userHead')
                }
              } else {
                this.headImg = 'data:image/png;base64,' + iconData
                localStorage.userHead = this.headImg
              }
            }
            // TODO mutation state
            console.log('____log______')
          }).catch((e) => {
          })
      },
      _getLatestPlayCount() {
        return getLatestPlayArray(this.userCrmId).length
      },
      _openDownloadPage() {
        openDownloadPage()
      },
      ...mapMutations({
        setPersonalCount: 'SET_PERSONAL_CENTER_COUNT'
      })
    }
  }

</script>

<style scoped lang="scss" type="text/scss">
  .per-center {
    .scroll-list-wrapper {
      .scroll {
        height: 520px;
      }
    }
  }
</style>

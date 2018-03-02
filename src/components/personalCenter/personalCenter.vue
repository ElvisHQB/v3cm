<template>
  <div class="per-center">
    <div class="scroll-list-wrapper">
      <mt-loadmore :top-method="_loadTop"
                   :topPullText="topPullText"
                   :topDropText="topDropText"
                   :topLoadingText="topLoadingText"
                   :topDistance="distance"
                   :autoFill="false"
                   ref="loadmore" class="load-more">
        <per-head :imgUrl="headImg" :userName="name" :inst="inst"></per-head>
        <router-link tag="div" to="/personalCenter/publishedMeeting">
          <per-list :iconTypeClass="'icon-qunfenglianxiren'" :listName="'公开会议'" :listNum="personalCenterCount.publishedMeetingCount"
                    :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <router-link tag="div" to="/personalCenter/privateMeeting">
          <per-list :iconTypeClass="'icon-lianxiren'" :listName="'私人会议'" :listNum="personalCenterCount.privateMeetingCount"
                    :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <router-link tag="div" to="/personalCenter/myCollection">
          <per-list :iconTypeClass="'icon-shoucang1'" :listName="'我的收藏'" :listNum="personalCenterCount.myCollectionCount"
                    :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <router-link tag="div" to="/personalCenter/latestPlay">
          <per-list :iconTypeClass="'icon-zaixianhuiyi'" :listName="'最近播放'" :listNum="personalCenterCount.latestPlayCount"
                    :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <a @click="_openDownloadPage">
          <per-list :iconTypeClass="'icon-download'" :listName="'下载管理'" :listNum="personalCenterCount.downloadCount"
                    :moreClass="'icon-xiangyou'"></per-list>
        </a>
      </mt-loadmore>
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
  import {SET_PERSONAL_CENTER_COUNT} from '../../store/mutation-types'
  import { MessageBox, Loadmore } from 'mint-ui'

  export default {
    components: {
      perList,
      perHead,
      'mt-loadmore': Loadmore
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
        headImg: localStorage.userHead ? localStorage.userHead : ''
      }
    },
    computed: {
      personalCenterCount() {
        return this.$store.getters.personalCenterCount
      }
    },
    methods: {
      // 触发下拉刷新事件
      _loadTop() {
        this._getUserInfo()
        this.$refs.loadmore.onTopLoaded()
      },
      _getUserInfo() {
        const url = getUserInfoUrl
        return api.getData(url, 'get')
          .then((res) => {
            this.name = res.name ? res.name : '未认证用户'
            this.inst = res.institutionName
            this._getUserHeadPortrait(res.crmId)
            // TODO mutation state
            console.log('res.myMeetingCount' + res.myMeetingCount)
            this.$store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'publishedMeeting', num: res.myMeetingCount})
            this.$store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'privateMeeting', num: res.myPrivateMeetingCount})
            this.$store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'myCollection', num: res.myCollectionCount})
            this.$store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'latestPlay', num: this._getLatestPlayCount()})
            this.$store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'download', num: getDownloadItemCount()})
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
        return getLatestPlayArray().length
      },
      _openDownloadPage() {
        openDownloadPage()
      }
    }
  }

</script>

<style scoped lang="scss" type="text/scss">
  $load-more-height: 550px;
  .per-center {
    .scroll-list-wrapper {
      .load-more {
        height: $load-more-height;
      }
    }
  }
</style>

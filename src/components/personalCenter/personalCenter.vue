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
          <per-list :iconTypeClass="'icon-qunfenglianxiren'" :listName="'公开会议'" :listNum="publisedMeetingCount" :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <router-link tag="div" to="/personalCenter/privateMeeting">
          <per-list :iconTypeClass="'icon-lianxiren'" :listName="'私人会议'" :listNum="privateMeetingCount" :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <router-link tag="div" to="/personalCenter/myCollection">
          <per-list :iconTypeClass="'icon-shoucang1'" :listName="'我的收藏'" :listNum="myCollectionCount" :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <router-link tag="div" to="/personalCenter/latestPlay">
          <per-list :iconTypeClass="'icon-zaixianhuiyi'" :listName="'最近播放'" :listNum="latestPlayCount" :moreClass="'icon-xiangyou'"></per-list>
        </router-link>
        <per-list :iconTypeClass="'icon-download'" :listName="'下载管理'" :listNum="downloadCount" :moreClass="'icon-xiangyou'"></per-list>
      </mt-loadmore>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import perList from '../../base/personalCenterList/personalCenterList'
  import perHead from '../../base/personalCenterList/personalCenterHead'
  import {getUserInfoUrl, defaultHead, getUserHeadPortraitByCRMIdUrl} from '../../api/config'
  import api from '../../api/fetchData'
  import * as ERR_CODE from '../../api/errorCode'
  import { getDownloadItemCount } from '../../api/native'

  export default {
    components: {
      perList, perHead
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
        publisedMeetingCount: 0,
        privateMeetingCount: 0,
        myCollectionCount: 0,
        //TODO 最近播放
        latestPlayCount: 0,
        downloadCount: 0
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
            this.name = res.name
            this.inst = res.institutionName
            this.publisedMeetingCount = res.myMeetingCount
            this.privateMeetingCount = res.myPrivateMeetingCount
            this.myCollectionCount = res.myCollectionCount
            this._getUserHeadPortrait(res.crmId)
            this.downloadCount = getDownloadItemCount()
            // TODO mutation state
            console.log('____log______')
          }).catch((e) => {
            console.log(e)
            console.log(ERR_CODE)
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
            console.log(e)
            console.log(ERR_CODE)
          })
      }
    }
  }

</script>

<style scoped lang="scss" type="text/scss">
  .per-center {
    .scroll-list-wrapper {
      .load-more {
        height: 550px;
      }
    }
  }
</style>

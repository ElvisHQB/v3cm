<template>
  <div class="private-meeting-body">
    <div class="scroll-list-wrapper">
      <mt-loadmore :top-method="_loadTop"
                   :topPullText="topPullText"
                   :topDropText="topDropText"
                   :topLoadingText="topLoadingText"
                   :topDistance="distance"
                   :bottom-method="_loadBottom"
                   :bottomAllLoaded="allLoaded"
                   :autoFill="false"
                   :bottomLoadingText="bottomLoadingText"
                   :bottomDistance="distance"
                   ref="loadmore">
        <!--会议资讯列表-->
        <div v-for="(item, index) in privateMeeting" :key="index">
          <pri-meeting-list :item="item"></pri-meeting-list>
        </div>
      </mt-loadmore>
      <!--底部无更多数据-->
      <div v-show="noMore" class="pull-bottom-wrapper">
        <div class="pull-bottom">
          <span>没有更多数据了</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import PriMeetingList from '../../../base/privateMeetingList/privateMeetingList'
  import {getMyPrivateMeetingUrl} from '../../../api/config'
  import {genPrivateMeetingList} from '../../../common/js/utils'
  import api from '../../../api/fetchData'
  import * as ERR_CODE from '../../../api/errorCode'

  export default {
    name: 'private-meeting',
    components: {
      PriMeetingList
    },
    mounted() {
      this._getPrivateMeeing(1)
    },
    data() {
      return {
        topPullText: '下拉可以刷新',
        topDropText: '释放立即刷新',
        topLoadingText: '正在刷新...',
        distance: 50,
        allLoaded: false,
        bottomLoadingText: '正在加载...',
        noMore: false,
        privateMeeting: [],
        currentPage: 1,
        // TODO 分页大小，可配置？
        pageSize: 10,
        isPaging: true,
        meetingInfo: []
      }
    },
    methods: {
      // 触发下拉刷新事件
      _loadTop() {
        this._getPrivateMeeing(1)
        this.$refs.loadmore.onTopLoaded()
      },
      // 触发上拉加载事件
      _loadBottom() {
        this._getPrivateMeeing(this.currentPage + 1)
        this.allLoaded = false
        this.$refs.loadmore.onBottomLoaded()
      },
      _getPrivateMeeing(currentPage) {
        this.currentPage = currentPage
        const url = getMyPrivateMeetingUrl
        let params = {
          'isPaging': this.isPaging,
          'pageSize': this.pageSize,
          'currentPage': currentPage
        }
        return api.getData(url, 'post', params)
          .then((res) => {
            let meetingList = []
            for (let meeting of res.list) {
              let meetingItem = genPrivateMeetingList(meeting)
              meetingList.push(meetingItem)
            }
            // 没有更多数据
            if (meetingList.length < this.pageSize) {
              this.noMore = true
            } else {
              this.noMore = false
            }
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.privateMeeting = meetingList
            } else {
              this.privateMeeting = this.privateMeeting.concat(meetingList)
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

<style scoped lang="scss">
  @import "../../../common/scss/variable";

  .private-meeting-body {

    .pull-bottom-wrapper {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .pull-bottom {
        height: 24px;
        line-height: 24px;
        font-size: $font-size-medium;
        color: #777;
      }
    }
  }
</style>

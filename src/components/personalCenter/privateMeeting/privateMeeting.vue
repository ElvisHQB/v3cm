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
  import PriMeetingList from './privateMeetingList'
  import {getMyPrivateMeetingUrl} from '../../../api/config'
  import {genPrivateMeetingList} from '../../../common/js/utils'
  import api from '../../../api/fetchData'
  import ERR_CODE from '../../../api/errorCode'
  import { closeWebView } from '../../../api/native'
  import { SET_PRIVATE_MEETING_LIST } from '../../../store/mutation-types'
  import { MessageBox, Loadmore } from 'mint-ui'

  export default {
    name: 'private-meeting',
    components: {
      PriMeetingList,
      'mt-loadmore': Loadmore
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
        currentPage: 1,
        // TODO 分页大小，可配置？
        pageSize: 10,
        isPaging: true
      }
    },
    computed: {
      privateMeeting() {
        return this.$store.getters.privateMeetingList
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
              this.$store.commit(SET_PRIVATE_MEETING_LIST, meetingList)
            } else {
              this.$store.commit(SET_PRIVATE_MEETING_LIST, this.historyMeeting.concat(meetingList))
            }
            // TODO mutation state
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
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../common/scss/variable";
  $pull-buttom-height: 40px;
  $pull-buttom-text-height: 24px;
  $pull-buttom-text-color: #777;

  .private-meeting-body {

    .pull-bottom-wrapper {
      height: $pull-buttom-height;
      display: flex;
      justify-content: center;
      align-items: center;
      .pull-bottom {
        height: $pull-buttom-text-height;
        line-height: $pull-buttom-text-height;
        font-size: $font-size-medium;
        color: $pull-buttom-text-color;
      }
    }
  }
</style>

<template>
  <div class="my-collection-body" id="myCollectionBody">
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
        <!--<div v-for="(item, index) in myCollectionMeeting" :key="index">-->
        <mt-cell-swipe v-for="(item, index) in myCollectionMeeting" :key="index"
                       :right="[
              {
                content: '取消收藏',
                style: { background: '#dd2637', color: '#fff', fontSize: '14px', padding: '0 30px',display: 'flex', alignItems: 'center' },
                handler: () => {_cancelCollection(item.id)}
              }
            ]">
          <list-view :item="item"></list-view>
        </mt-cell-swipe>
        <!--</div>-->
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
  import {getBookMarkedMeetingListUrl} from '../../../api/config'
  import {Meeting} from '../../../common/js/utils'
  import {bookmarkMeeting} from '../../../common/js/httpRequests'
  import api from '../../../api/fetchData'
  import ERR_CODE from '../../../api/errorCode'
  import ListView from '../../../base/listView/listView'
  import {SET_MY_COLLLECTION_LIST} from '../../../store/mutation-types'
  import { closeWebView } from '../../../api/native'
  import { MessageBox, CellSwipe, Loadmore } from 'mint-ui'

  export default {
    name: 'my-collection',
    components: {
      ListView,
      'mt-cell-swipe': CellSwipe,
      'mt-loadmore': Loadmore
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
        // TODO 分页大小，可配置？
        currentPage: 1,
        pageSize: 10,
        isPaging: true
      }
    },
    mounted() {
      this._getMyCollectionMeeting(1)
    },
    computed: {
      myCollectionMeeting() {
        return this.$store.getters.myCollectionMeetingList
      }
    },
    methods: {
      _cancelCollection(id) {
        MessageBox.confirm('确认取消此会议？', '提示').then(action => {
          this._bookMarkMeeting(id, true)
        })
      },
      //取消收藏
      _bookMarkMeeting(meetingId, bookMarked) {
        bookmarkMeeting(meetingId, bookMarked)
      },
      // 触发下拉刷新事件
      _loadTop() {
        this._getMyCollectionMeeting(1)
        console.log('aaaaa')
        this.$refs.loadmore.onTopLoaded()
      },
      // 触发上拉加载事件
      _loadBottom() {
        this._getMyCollectionMeeting(this.currentPage + 1)
        this.allLoaded = false
        this.$refs.loadmore.onBottomLoaded()
      },
      _getMyCollectionMeeting(currentPage) {
        this.currentPage = currentPage
        const url = getBookMarkedMeetingListUrl
        let params = {
          'currentPage': currentPage,
          'pageSize': this.pageSize,
          'isPaging': this.isPaging
        }
        return api.getData(url, 'post', params)
          .then((res) => {
            let meetingList = []
            for (let item of res.list) {
              let meeting = new Meeting(item)
              meetingList.push(meeting)
            }
            // 没有更多数据
            this.noMore = meetingList.length < this.pageSize
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.$store.commit(SET_MY_COLLLECTION_LIST, meetingList)
            } else {
              this.$store.commit(SET_MY_COLLLECTION_LIST, this.myCollectionMeeting.concat(meetingList))
            }
            // TODO mutation state
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
  $cell-swipe-margin: 6px;

  #myCollectionBody.my-collection-body {

    .scroll-list-wrapper {
      .mint-cell-swipe {
        margin-top: $cell-swipe-margin;
       /deep/ .mint-cell-wrapper {
          font-size: $font-size-small;
          .mint-cell-title {
           max-width: 0;
         }
        }
      }

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
  }
</style>

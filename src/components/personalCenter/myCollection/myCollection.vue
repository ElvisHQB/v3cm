<template>
  <div class="my-collection-body">
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
        <div v-for="(item, index) in myCollectionMeeting" :key="index">
          <mt-cell-swipe
            title = ''
            :right="[
              {
                content: '取消收藏',
                style: { background: 'red', color: '#fff' }
              }
            ]">
            <list-view :item="item"></list-view>
          </mt-cell-swipe>
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
  import ScrollList from '../../../base/scrollList/scrollList'
  import {getBookMarkedMeetingListUrl} from '../../../api/config'
  import {genMeetingListItem} from '../../../common/js/utils'
  import api from '../../../api/fetchData'
  import * as ERR_CODE from '../../../api/errorCode'
  import ListView from '../../../base/listView/listView'

  export default {
    name: 'my-collection',
    components: {
      ScrollList, ListView
    },
    mounted() {
      this._getMyCollectionMeeting(1)
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
        myCollectionMeeting: [],
        // TODO 分页大小，可配置？
        currentPage: 1,
        pageSize: 10,
        isPaging: true,
        noMoreData: false
      }
    },
    methods: {
      // 触发下拉刷新事件
      _loadTop() {
        this._getMyCollectionMeeting(1)
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
              let meeting = genMeetingListItem(item)
              meetingList.push(meeting)
            }
            // 没有更多数据
            if (meetingList.length < this.pageSize) {
              this.noMore = true
            } else {
              this.noMore = false
            }
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.myCollectionMeeting = meetingList
            } else {
              this.myCollectionMeeting = this.myCollectionMeeting.concat(meetingList)
            }
            // TODO mutation state
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

  .my-collection-body {

    .scroll-list-wrapper {
      .mint-loadmore {
        .mint-loadmore-content {
          .mint-cell-swipe {
            .mint-cell-wrapper {
              .mint-cell-title {
                max-width: 0;
              }
            }
          }
        }
      }
    }

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

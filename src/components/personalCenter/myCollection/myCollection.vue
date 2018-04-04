<template>
  <div class="my-collection-body" id="myCollectionBody">
    <div class="scroll-list-wrapper">
      <scroll :data="myCollectionMeeting" :pullDownRefresh="true" :pullUpLoad="true"
              @pullingDown="_getMyCollectionMeeting(1)"
              @pullingUp="_getMyCollectionMeeting(currentPage + 1)"
              :style="scrollStyle" ref="scroll">
        <div>
          <mt-cell-swipe v-for="(item, index) in myCollectionMeeting" :key="index"
                         :right="[
              {
                content: '取消收藏',
                style: { background: '#dd2637', color: '#fff', fontSize: '14px', padding: '0 30px',display: 'flex', alignItems: 'center' },
                handler: () => {_cancelCollection(item.id)}
              }
            ]">
            <list-view :item="item" @click.stop="_onClick(item.id, item.isRestricted)">
              <operation slot="operation" :item="item"></operation>
            </list-view>
          </mt-cell-swipe>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ListView from 'base/listView/listView'
  import Operation from 'base/listView/operation'
  import Scroll from 'base/scroll/scroll'
  import { getBookMarkedMeetingListUrl, HEADER_HEIGHT } from 'api/config'
  import { Meeting } from 'common/js/utils'
  import { bookmarkMeeting, detailAuthentication } from 'common/js/httpRequests'
  import api from 'api/fetchData'
  import ERR_CODE from 'api/errorCode'
  import {mapGetters, mapMutations} from 'vuex'
  import { closeWebView } from 'api/native'
  import { MessageBox, Toast, CellSwipe } from 'mint-ui'

  export default {
    name: 'my-collection',
    components: {
      ListView,
      Operation,
      Scroll,
      'mt-cell-swipe': CellSwipe
    },
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        isPaging: true,
        noMoreData: false
      }
    },
    mounted() {
      this._getMyCollectionMeeting(1)
    },
    computed: {
      ...mapGetters({
        myCollectionMeeting: 'myCollectionMeetingList',
        restrictedMeeting: 'restrictedMeetingList',
        appInfo: 'appInfo'
      }),
      scrollStyle() {
        const scrollHeight = this.appInfo.height - HEADER_HEIGHT
        return 'height:' + scrollHeight + 'px'
      }
    },
    methods: {
      _onClick(id, isRestricted) {
        let self = this
        detailAuthentication(id, isRestricted, {
          getRestrictedMeeting: function () {
            return self.restrictedMeeting
          },
          routeToDetail: function () {
            self.$router.push({name: 'meetingDetail', params: {meetingId: id}})
          },
          setRestrictedMeeting: function (meeting) {
            self.setRestrictedMeetingList(meeting)
          }
        })
      },
      _cancelCollection(id) {
        MessageBox.confirm('确认取消此会议？', '提示').then(action => {
          this._bookMarkMeeting(id, true)
        })
      },
      //取消收藏
      _bookMarkMeeting(meetingId, bookMarked) {
        let self = this
        bookmarkMeeting(meetingId, bookMarked).then((res) => {
          if (res < 1) {
            Toast('操作失败！')
            return
          }
          if (bookMarked) {
            Toast({
              message: '取消收藏成功！',
              position: 'bottom',
              duration: 800
            })
            self.bookOffMeeting(meetingId)
          }
        })
      },
      _getMyCollectionMeeting(currentPage) {
        if (this.noMoreData) {
          this.$refs.scroll.forceUpdate(false)
          return
        }
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
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.setMyCollection(meetingList)
            } else {
              this.setMyCollection(this.myCollectionMeeting.concat(meetingList))
            }
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
      ...mapMutations({
        setMyCollection: 'SET_MY_COLLLECTION_LIST',
        setRestrictedMeetingList: 'SET_RESTRICTED_MEETING_LIST',
        bookOffMeeting: 'BOOK_MARK_MY_COLLOCTION'
      })
    }
  }
</script>

<style scoped lang="scss">
  @import "../../../common/scss/variable";
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
    }
  }
</style>

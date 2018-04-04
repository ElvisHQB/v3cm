<template>
  <div class="published-meeting-body">
    <scroll :data="myMeeting" :pullDownRefresh="true" :pullUpLoad="true"
            @pullingDown="_getMyMeeting(1)"
            @pullingUp="_getMyMeeting(currentPage + 1)"
            :style="scrollStyle" ref="scroll">
      <div>
        <list-view :item="item" v-for="(item, index) in myMeeting" :key="index" @click="_onClick(item.id, item.isRestricted)">
          <operation slot="operation" :item="item"></operation>
        </list-view>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getMyMeetingListUrl, HEADER_HEIGHT } from 'api/config'
  import ListView from 'base/listView/listView'
  import Operation from 'base/listView/operation'
  import Scroll from 'base/scroll/scroll'
  import { Meeting } from 'common/js/utils'
  import api from 'api/fetchData'
  import ERR_CODE from 'api/errorCode'
  import { mapGetters, mapMutations } from 'vuex'
  import { closeWebView } from 'api/native'
  import { detailAuthentication } from 'common/js/httpRequests'
  import { MessageBox } from 'mint-ui'

  export default {
    name: 'published-meeting',
    components: {
      Scroll, ListView, Operation
    },
    mounted() {
      this._getMyMeeting(1)
    },
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        isPaging: true,
        noMoreData: false
      }
    },
    computed: {
      ...mapGetters({
        myMeeting: 'publishedMeetingList',
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
      _getMyMeeting(currentPage) {
        if (this.noMoreData) return
        this.currentPage = currentPage
        const url = getMyMeetingListUrl
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
            if (meetingList.length < this.pageSize) {
              this.noMoreData = true
            } else {
              this.noMoreData = false
            }
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.setPublishedMeeting(meetingList)
            } else {
              this.setPublishedMeeting(this.myMeeting.concat(meetingList))
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
      },
      ...mapMutations({
        setPublishedMeeting: 'SET_PUBLISHED_MEETING_LIST',
        setRestrictedMeetingList: 'SET_RESTRICTED_MEETING_LIST'
      })
    }
  }
</script>

<style scoped lang="scss">

</style>

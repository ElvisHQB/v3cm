<template>
  <div class="published-meeting-body">
    <scroll-list :listData="myMeeting" :noMore="noMoreData" v-on:loadTop="_getMyMeeting(1)"
                 v-on:loadBottom="_getMyMeeting(currentPage + 1)"></scroll-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import ScrollList from '../../../base/scrollList/scrollList'
  import {getMyMeetingListUrl} from '../../../api/config'
  import {genMeetingListItem} from '../../../common/js/utils'
  import api from '../../../api/fetchData'
  import * as ERR_CODE from '../../../api/errorCode'

  export default {
    name: 'published-meeting',
    components: {
      ScrollList
    },
    mounted() {
      this._getMyMeeting(1)
    },
    data() {
      return {
        myMeeting: [],
        // TODO 分页大小，可配置？
        currentPage: 1,
        pageSize: 10,
        isPaging: true,
        noMoreData: false
      }
    },
    methods: {
      _getMyMeeting(currentPage) {
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
              let meeting = genMeetingListItem(item)
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
              this.myMeeting = meetingList
            } else {
              this.myMeeting = this.myMeeting.concat(meetingList)
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
</style>

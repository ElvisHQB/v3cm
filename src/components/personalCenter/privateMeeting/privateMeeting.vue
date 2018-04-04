<template>
  <div class="private-meeting-body">
    <div class="scroll-list-wrapper">
      <scroll :data="privateMeeting" :pullDownRefresh="true" :pullUpLoad="true"
              @pullingDown="_getPrivateMeeing(1)"
              @pullingUp="_getPrivateMeeing(currentPage + 1)"
              :style="scrollStyle" ref="scroll">
        <div>
          <pri-meeting-list :item="item" v-for="(item, index) in privateMeeting" :key="index">
          </pri-meeting-list>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import PriMeetingList from './privateMeetingList'
  import Scroll from 'base/scroll/scroll'
  import { getMyPrivateMeetingUrl, HEADER_HEIGHT } from 'api/config'
  import { PrivateMeeting } from 'common/js/utils'
  import api from 'api/fetchData'
  import ERR_CODE from 'api/errorCode'
  import { closeWebView } from 'api/native'
  import { mapGetters, mapMutations } from 'vuex'
  import { MessageBox } from 'mint-ui'

  export default {
    name: 'private-meeting',
    components: {
      PriMeetingList,
      Scroll
    },
    mounted() {
      this._getPrivateMeeing(1)
    },
    data() {
      return {
        currentPage: 1,
        pageSize: 10,
        isPaging: true
      }
    },
    computed: {
      ...mapGetters({
        privateMeeting: 'privateMeetingList',
        appInfo: 'appInfo'
      }),
      scrollStyle() {
        const scrollHeight = this.appInfo.height - HEADER_HEIGHT
        return 'height:' + scrollHeight + 'px'
      }
    },
    methods: {
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
              let meetingItem = new PrivateMeeting(meeting)
              meetingList.push(meetingItem)
            }
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.setPrivateMeeting(meetingList)
            } else {
              this.setPrivateMeeting(this.privateMeeting.concat(meetingList))
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
      },
      ...mapMutations({
        setPrivateMeeting: 'SET_PRIVATE_MEETING_LIST'
      })
    }
  }
</script>

<style scoped lang="scss">

</style>

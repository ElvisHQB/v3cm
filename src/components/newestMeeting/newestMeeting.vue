<template>
  <div class="newest-meeting-wrapper">
    <scroll :data="newestMeeting" :pullDownRefresh="true" :pullUpLoad="true"
            @pullingDown="_getNewestMeeting(1)"
            @pullingUp="_getNewestMeeting(currentPage + 1)"
            :style="scrollStyle" ref="scroll">
      <div>
        <slide-wrapper @imageLoad="_loadImage"></slide-wrapper>
        <div class="list-wrapper">
          <list-view :item="item"
                     v-for="(item, index) in newestMeeting" :key="index"
                     @click="_onClick(item.id, item.isRestricted)">
            <status slot="status"
                    :meetingStatus="item.meetingStatus"
                    :signupStatus="item.signupStatus">
            </status>
            <recommend slot="recommend"
                       :recommend="item.recommend"
                       :broadcastType="item.broadcastType">
            </recommend>
          </list-view>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { MessageBox } from 'mint-ui'
  import { getLatestMeetingUrl, HEADER_HEIGHT, TAB_HEIGHT } from 'api/config'
  import api from 'api/fetchData'
  import ERR_CODE from 'api/errorCode'
  import { Meeting } from 'common/js/utils'
  import { closeWebView } from 'api/native'
  import Scroll from 'base/scroll/scroll'
  import ListView from 'base/listView/listView'
  import Operation from 'base/listView/operation'
  import Recommend from 'base/listView/recommend'
  import Status from 'base/listView/status'
  import SlideWrapper from './slideWrapper/slideWrapper'
  import { detailAuthentication } from 'common/js/httpRequests'
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'newestMeeting',
    components: {
      Scroll,
      ListView,
      Operation,
      Status,
      Recommend,
      SlideWrapper
    },
    created() {
      this.currentPage = 1
      this.noMoreData = false
    },
    mounted() {
      this._getNewestMeeting(1)
    },
    computed: {
      ...mapGetters({
        newestMeeting: 'newestMeetingList',
        restrictedMeeting: 'restrictedMeetingList',
        appInfo: 'appInfo'
      }),
      scrollStyle() {
        const scrollHeight = this.appInfo.height - HEADER_HEIGHT - TAB_HEIGHT
        return 'height:' + scrollHeight + 'px'
      }
    },
    methods: {
      ...mapMutations({
        setNewestMeeting: 'SET_NEWEST_MEETING_LIST',
        setRestrictedMeetingList: 'SET_RESTRICTED_MEETING_LIST'
      }),
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
      _getNewestMeeting(currentPage) {
        if (this.noMoreData) {
          this.$refs.scroll.forceUpdate(false)
          return
        }
        this.currentPage = currentPage
        const url = getLatestMeetingUrl
        let params = {
          criteria: {
            meetingStatus: ['PUBLISHED', 'STARTED']
          },
          isPaging: true,
          pageSize: 10,
          currentPage: currentPage
        }
        api.getData(url, 'post', params)
          .then((res) => {
            let meetingList = []
            for (let meeting of res.list) {
              meetingList.push(new Meeting(meeting))
            }
            // 没有更多数据
            this.noMoreData = meetingList.length < 10
            //对上拉下拉的处理
            if (currentPage === 1) {
              this.setNewestMeeting(meetingList)
            } else {
              this.setNewestMeeting(this.newestMeeting.concat(meetingList))
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
      _loadImage() {
        if (!this.checkLoaded) {
          this.$refs.scroll.refresh()
          this.checkLoaded = true
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

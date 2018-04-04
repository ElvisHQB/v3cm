<template>
  <div class="latest-play-body">
    <scroll :data="latestPlayMeeting" :pullDownRefresh="true" :pullUpLoad="true"
            @pullingDown="_getLatestPlayMeeting()"
            @pullingUp="_getLatestPlayMeeting()"
            :style="scrollStyle" ref="scroll">
      <div>
        <list-view :item="item" v-for="(item, index) in latestPlayMeeting" :key="index" @click="_onClick(item.id, item.isRestricted)">
          <operation slot="operation" :item="item"></operation>
        </list-view>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { mapGetters, mapMutations } from 'vuex'
  import ListView from 'base/listView/listView'
  import Operation from 'base/listView/operation'
  import Scroll from 'base/scroll/scroll'
  import { detailAuthentication } from 'common/js/httpRequests'
  import { HEADER_HEIGHT } from 'api/config'

  export default {
    name: 'latest-play',
    components: {
      ListView, Operation, Scroll
    },
    data() {
      return {
      }
    },
    mounted() {
      this._getLatestPlayMeeting()
    },
    computed: {
      ...mapGetters({
        latestPlayMeeting: 'latestPlayMeetingList',
        crmId: 'userCrmId',
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
      _getLatestPlayMeeting() {
        if (!localStorage.latestPlay) return
        let latestPlayJson = JSON.parse(localStorage.latestPlay)
        // 查找匹配记录
        for (let element of latestPlayJson) {
          console.log('crmId: ' + this.crmId)
          if (element.crmId === this.crmId) {
            this.setLatestPlay(element.latestPlayArray)
            break
          }
        }
        this.$refs.scroll.forceUpdate(false)
      },
      ...mapMutations({
        setLatestPlay: 'SET_LATESTPLAY_MEETING_LIST',
        setRestrictedMeetingList: 'SET_RESTRICTED_MEETING_LIST'
      })
    }
  }
</script>

<style scoped lang="scss">

</style>

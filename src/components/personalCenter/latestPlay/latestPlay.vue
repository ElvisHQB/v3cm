<template>
  <div class="published-meeting-body">
    <scroll-list :listData="latestPlayMeeting" :noMore="noMoreData" v-on:loadTop="_getLatestPlayMeeting()"
                 v-on:loadBottom="_getLatestPlayMeeting()"></scroll-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import ScrollList from '../../../base/scrollList/scrollList'
  import { SET_LATESTPLAY_MEETING_LIST } from '../../../store/mutation-types'

  export default {
    name: 'latest-play',
    components: {
      ScrollList
    },
    data() {
      return {
        noMoreData: true
      }
    },
    mounted() {
      this._getLatestPlayMeeting()
    },
    computed: {
      latestPlayMeeting() {
        return this.$store.getters.latestPlayMeetingList
      }
    },
    methods: {
      _getLatestPlayMeeting() {
        if (!localStorage.latestPlay) return
        let latestPlayJson = JSON.parse(localStorage.latestPlay)
        // 查找匹配记录
        for (let element of latestPlayJson) {
          console.log(this.$store.getters.userCrmId)
          if (element.crmId === this.$store.getters.userCrmId) {
            this.$store.commit(SET_LATESTPLAY_MEETING_LIST, element.latestPlayArray)
            break
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

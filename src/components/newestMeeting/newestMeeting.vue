<template>
  <!--最新会议-->
  <div class="newest-meeting-wrapper">
    <!--顶部轮播图-->
    <!--TODO 不设置swipe的height时，轮播图无法显示-->
    <mt-swipe ref="swipe" class="swipe" :auto="interval">
      <mt-swipe-item v-for="img in images" :key="img.id">
        <img :src="img.url" class="swipe-img">
      </mt-swipe-item>
    </mt-swipe>
    <!--最新会议列表-->
    <scroll-list :listData="newestMeeting" :noMore="noMoreData"
                 @loadTop="_getNewestMeeting(firstPage, pageSize)"
                 @loadBottom="_getNewestMeeting(currentPage + 1, pageSize)">
    </scroll-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getLatestMeetingUrl } from 'api/config'
  import api from 'api/fetchData'
  import * as ERR_CODE from '../../api/errorCode'
  import ScrollList from '../../base/scrollList/scrollList'
  import { genMeetingListItem } from '../../common/js/utils'
  import { SET_NEWEST_MEETING_LIST } from '../../store/mutation-types'

  export default {
    name: 'newestMeeting',
    components: {
      ScrollList
    },
    data() {
      return {
        firstPage: 1,
        currentPage: 1,
        pageSize: 10,
        noMoreData: false,
        // 轮播图数组
        images: [
          {
            id: 1,
            url: 'http://114.80.154.45/unitedweb/CMS/pictures/20180123/063320_0123M.jpg'
          },
          {
            id: 2,
            url: 'http://114.80.154.45/unitedweb/CMS/pictures/20180123/064417_mobbanner.jpg'
          }
        ],
        //轮播图刷新间隔
        interval: 2000
      }
    },
    mounted() {
       this._getNewestMeeting(this.firstPage, this.pageSize)
    },
    computed: {
      newestMeeting() {
        return this.$store.getters.newestMeetingList
      }
    },
    methods: {
      _getNewestMeeting(currentPage, pageSize) {
        if (this.noMoreData) return
        this.currentPage = currentPage
        const url = getLatestMeetingUrl
        let params = {
          'criteria': {
            'meetingStatus': ['PUBLISHED', 'STARTED']
          },
          'isPaging': true,
          'pageSize': pageSize,
          'currentPage': currentPage
        }
        api.getData(url, 'post', params)
          .then((res) => {
            let meetingList = []
            for (let meeting of res.list) {
              let meetingItem = genMeetingListItem(meeting)
              meetingList.push(meetingItem)
            }
            // 没有更多数据
            this.noMoreData = meetingList.length < pageSize
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.$store.commit(SET_NEWEST_MEETING_LIST, meetingList)
            } else {
              this.$store.commit(SET_NEWEST_MEETING_LIST, this.newestMeeting.concat(meetingList))
            }
        }).catch((e) => {
          console.log(e)
          console.log(ERR_CODE)
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/scss/variable.scss';
  .newest-meeting-wrapper {
    display: flex;
    flex-direction: column;
    .swipe {
      height: 150px;
      .swipe-img {
        width: 100%;
      }
    }
  }
</style>

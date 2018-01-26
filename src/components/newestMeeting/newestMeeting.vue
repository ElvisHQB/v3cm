<template>
  <!--最新会议-->
  <div class="newest-meeting-wrapper">
    <!--顶部轮播图-->
    <!--TODO 不设置swipe的height时，轮播图无法显示-->
    <mt-swipe ref="swipe" class="swipe" :auto="2000">
      <mt-swipe-item v-for="img in images" :key="img.id">
        <img :src="img.url" class="swipe-img">
      </mt-swipe-item>
    </mt-swipe>
    <!--最新会议列表-->
    <scroll-list :listData="newestMeeting" v-on:loadTop="_getNewestMeeting" v-on:loadBottom="_getNewestMeeting"></scroll-list>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getLatestMeetingUrl } from 'api/config'
  import api from 'api/fetchData'
  import * as ERR_CODE from '../../api/errorCode'
  import ScrollList from '../../base/scrollList/scrollList'

  export default {
    name: 'newestMeeting',
    components: {
      ScrollList
    },
    data() {
      return {
        newestMeeting: [],
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
        ]
      }
    },
    mounted() {
       this._getNewestMeeting()
    },
    methods: {
      _getNewestMeeting() {
        const url = getLatestMeetingUrl
        let params = {
          'criteria': {
            'meetingStatus': ['PUBLISHED', 'STARTED']
          },
          'isPaging': true,
          'pageSize': 10,
          'currentPage': 1
        }
        return api.getData(url, 'post', params)
          .then((res) => {
          this.newestMeeting = res.list
          // TODO mutation state
          console.log('____log______')
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

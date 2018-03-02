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
    <!--TODO 最新会议列表-->
    <!--<scroll-list :listData="newestMeeting" :noMore="noMoreData"-->
                 <!--@loadTop="_getNewestMeeting(firstPage, pageSize)"-->
                 <!--@loadBottom="_getNewestMeeting(currentPage + 1, pageSize)">-->
    <!--</scroll-list>-->
    <scroll :data="newestMeeting" :pullDownRefresh="true" :pullUpLoad="true"
            @pullingDown="_getNewestMeeting(firstPage, pageSize)"
            @pullingUp="_getNewestMeeting(currentPage + 1, pageSize)"
            class="scroll">
      <div>
        <list-view :item="item" v-for="(item, index) in newestMeeting" :key="index"></list-view>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Swipe, SwipeItem, MessageBox } from 'mint-ui'
  import { getLatestMeetingUrl } from 'api/config'
  import api from 'api/fetchData'
  import ERR_CODE from 'api/errorCode'
//  import ScrollList from 'base/scrollList/scrollList'
  import { Meeting } from 'common/js/utils'
  import { SET_NEWEST_MEETING_LIST } from '../../store/mutation-types'
  import { closeWebView } from 'api/native'
  import Scroll from 'base/scroll/scroll'
  import ListView from 'base/listview/listView'

  export default {
    name: 'newestMeeting',
    components: {
//      ScrollList,
      Scroll,
      ListView,
      'mt-swipe': Swipe,
      'mt-swipe-item': SwipeItem
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
              meetingList.push(new Meeting(meeting))
            }
            // 没有更多数据
            this.noMoreData = meetingList.length < pageSize
            //对上拉下拉的处理
            if (currentPage === 1) {
              this.$store.commit(SET_NEWEST_MEETING_LIST, meetingList)
            } else {
              this.$store.commit(SET_NEWEST_MEETING_LIST, this.newestMeeting.concat(meetingList))
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
    .scroll {
      height: 550px;
    }
  }
</style>

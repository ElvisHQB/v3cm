<template>
  <div class="meetingInfo-body">
    <div class="meetingInfo-selector">
      <selector :title="meetingInfoTitle" :subTitle="meetingInfoSubTitle" :selectorVal="meetingInfoVal"
                @searchVal="_searchValChange"></selector>
    </div>
    <div class="scroll-list-wrapper">
      <mt-loadmore :top-method="_loadTop"
                   :topPullText="topPullText"
                   :topDropText="topDropText"
                   :topLoadingText="topLoadingText"
                   :topDistance="distance"
                   :bottom-method="_loadBottom"
                   :bottomAllLoaded="allLoaded"
                   :autoFill="false"
                   :bottomLoadingText="bottomLoadingText"
                   :bottomDistance="distance"
                   ref="loadmore">
        <!--会议资讯列表-->
        <div v-for="(item, index) in meetingInfo" :key="index">
          <meeting-info-list :item="item"></meeting-info-list>
        </div>
      </mt-loadmore>
      <!--底部无更多数据-->
      <div v-show="noMore" class="pull-bottom-wrapper">
        <div class="pull-bottom">
          <span>没有更多数据了</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import selector from '../../base/selector/selector'
  import meetingInfoList from '../../base/meetingInfoList/meetingInfoList'
  import {genMeetingInfoListItem} from '../../common/js/utils'
  import {getOfflineMeetingListUrl} from '../../api/config'
  import api from '../../api/fetchData'
  import * as ERR_CODE from '../../api/errorCode'

  const meetingInfoCategory = ['类型', '地点', '时间']
  const meetingInfoDetail = [['全部', '宏观经济', '高峰论坛', '行业会议', '业绩发布会', '学术会议', '其他会议'],
    ['全部', '上海', '杭州', '北京', '深圳', '广州', '其他地区'], ['全部', '未来三天', '未来一周', '未来一月', '未来三月']]
  const meetingInfoValue = [['', '277001000', '277004000', '277002000', '277007000', '277003000', '277008000'], ['', '0301010100000000',
    '0301050200000000', '0303010100000000', '0304050700000000',
    '0304050100000000', '0301010100000000,0301050200000000,0303010100000000,0304050700000000,0304050100000000'], ['', '未来三天',
    '未来一周', '未来一月', '未来三月']]

  export default {
    name: 'meetingInfo',
    components: {
      selector, meetingInfoList
    },
    mounted() {
      let startTime = new Date()
      this.searchVal.startTime = startTime.format('yyyyMMdd')
      startTime.setFullYear(startTime.getFullYear() + 2)
      this.searchVal.endTime = startTime.format('yyyyMMdd')
      this._getMeetingInfo(1)
    },
    computed: {},
    data() {
      return {
        meetingInfoTitle: meetingInfoCategory,
        meetingInfoSubTitle: meetingInfoDetail,
        meetingInfoVal: meetingInfoValue,
        topPullText: '下拉可以刷新',
        topDropText: '释放立即刷新',
        topLoadingText: '正在刷新...',
        distance: 50,
        allLoaded: false,
        bottomLoadingText: '正在加载...',
        noMore: false,
        currentPage: 1,
        // TODO 分页大小，可配置？
        pageSize: 10,
        searchVal: {
          city: '',
          exceptCity: '',
          meetingCategory: '',
          startTime: '',
          endTime: ''
        },
        meetingInfo: []
      }
    },
    methods: {
      _searchValChange(index1, index2) {
        let val = meetingInfoValue[index1][index2]
        if (index1 === 0) {
          this.searchVal.meetingCategory = val
        } else if (index1 === 1) {
          if (index2 !== 6) {
            this.searchVal.city = val
            this.searchVal.exceptCity = ''
          } else {
            this.searchVal.exceptCity = val
            this.searchVal.city = ''
          }
        } else {
          let startTime = new Date()
          this.searchVal.startTime = startTime.format('yyyyMMdd')
          if (index2 === 0) {
            startTime.setFullYear(startTime.getFullYear() + 2)
            this.searchVal.endTime = startTime.format('yyyyMMdd')
          } else if (index2 === 1) {
            startTime.setDate(startTime.getDate() + 3)
            this.searchVal.endTime = startTime.format('yyyyMMdd')
          } else if (index2 === 2) {
            startTime.setDate(startTime.getDate() + 7)
            this.searchVal.endTime = startTime.format('yyyyMMdd')
          } else if (index2 === 3) {
            startTime.setMonth(startTime.getMonth() + 1)
            this.searchVal.endTime = startTime.format('yyyyMMdd')
          } else if (index2 === 4) {
            startTime.setMonth(startTime.getMonth() + 3)
            this.searchVal.endTime = startTime.format('yyyyMMdd')
          }
        }
        console.log(this.searchVal)
      },
      // 触发下拉刷新事件
      _loadTop() {
        this._getMeetingInfo(1)
        this.$refs.loadmore.onTopLoaded()
      },
      // 触发上拉加载事件
      _loadBottom() {
        this._getMeetingInfo(this.currentPage + 1)
        this.allLoaded = false
        this.$refs.loadmore.onBottomLoaded()
      },
      // 获取会议资讯列表
      _getMeetingInfo(currentPage) {
        this.currentPage = currentPage
        const url = getOfflineMeetingListUrl
        let params = {
          'criteria': {
            'city': this.searchVal.city,
            'exceptCity': this.searchVal.exceptCity,
            'meetingCategory': this.searchVal.meetingCategory
          },
          'isPaging': true,
          'pageSize': this.pageSize,
          'currentPage': currentPage,
          startTime: this.searchVal.startTime,
          endTime: this.searchVal.endTime
        }
        return api.getData(url, 'post', params)
          .then((res) => {
            let meetingList = []
            for (let meeting of res.list) {
              let meetingItem = genMeetingInfoListItem(meeting)
              meetingList.push(meetingItem)
            }
            // 没有更多数据
            if (meetingList.length < this.pageSize) {
              this.noMore = true
            } else {
              this.noMore = false
            }
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.meetingInfo = meetingList
              console.log(this.meetingInfo)
            } else {
              this.meetingInfo = this.meetingInfo.concat(meetingList)
            }
            // TODO mutation state
            console.log('____log______')
          }).catch((e) => {
            console.log(e)
            console.log(ERR_CODE)
          })
      }
    },
    watch: {
      searchVal: {
        handler(val, oldVal) {
          this._getMeetingInfo(1)
        },
        deep: true
      }
    }
  }

</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .meetingInfo-body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 40px;

    .meetingInfo-selector {
      position: fixed;
      width: 100%;
      top: 44px;
      z-index: 9999;
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

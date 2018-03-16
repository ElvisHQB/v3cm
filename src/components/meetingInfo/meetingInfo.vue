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
  import meetingInfoList from './meetingInfoList'
  import {MeetingInfo} from '../../common/js/utils'
  import {getOfflineMeetingListUrl} from '../../api/config'
  import api from '../../api/fetchData'
  import ERR_CODE from '../../api/errorCode'
  import {closeWebView} from '../../api/native'
  import {SET_MEETINGINFO_LIST} from '../../store/mutation-types'
  import {MessageBox, Loadmore} from 'mint-ui'

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
      selector,
      meetingInfoList,
      'mt-loadmore': Loadmore
    },
    mounted() {
      let startTime = new Date()
      this.searchVal.startTime = startTime.format('yyyyMMdd')
      startTime.setFullYear(startTime.getFullYear() + 2)
      this.searchVal.endTime = startTime.format('yyyyMMdd')
      this._getMeetingInfo(1)
    },
    computed: {
      meetingInfo() {
        return this.$store.getters.meetingInfoList
      }
    },
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
        }
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
              let meetingItem = new MeetingInfo(meeting)
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
              this.$store.commit(SET_MEETINGINFO_LIST, meetingList)
            } else {
              this.$store.commit(SET_MEETINGINFO_LIST, this.meetingInfo.concat(meetingList))
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
  $pull-buttom-height: 40px;
  $pull-buttom-text-height: 24px;
  $pull-buttom-text-color: #777;

  .meetingInfo-body {
    display: flex;
    flex-direction: column;
    padding-top: 40px;

    .meetingInfo-selector {
      position: fixed;
      width: 100%;
      top: 44px;
      z-index: 99;
    }

    .pull-bottom-wrapper {
      height: $pull-buttom-height;
      display: flex;
      justify-content: center;
      align-items: center;
      .pull-bottom {
        height: $pull-buttom-text-height;
        line-height: $pull-buttom-text-height;
        font-size: $font-size-medium;
        color: $pull-buttom-text-color;
      }
    }
  }
</style>

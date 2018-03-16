<template>
  <div class="history-meeting-body">
    <div class="history-meeting-selector">
      <selector :title="hisTitle" :subTitle="hisSubTitle" :selectorVal="hisMeetingVal"
                @searchVal="_searchValChange"></selector>
    </div>
    <scroll :data="historyMeeting" :pullDownRefresh="pullDownRefresh" :pullUpLoad="pullUpLoad" :bounce="true"
            @pullingDown="_getHistoryMeeting(1)"
            @pullingUp="_getHistoryMeeting(currentPage + 1)"
            class="scroll" ref="scroll">
      <div>
        <list-view :item="item" v-for="(item, index) in historyMeeting" :key="index"></list-view>
      </div>
    </scroll>
  </div>

</template>

<script type="text/ecmascript-6">
  import selector from '../../base/selector/selector'
  import ListView from '../../base/listView/listView'
  import Scroll from 'base/scroll/scroll'
  import { Meeting } from '../../common/js/utils'
  import {getHistoryMeetingUrl} from '../../api/config'
  import api from '../../api/fetchData'
  import ERR_CODE from '../../api/errorCode'
  import {SET_HISTORY_MEETING_LIST} from '../../store/mutation-types'
  import { closeWebView } from '../../api/native'
  import { MessageBox } from 'mint-ui'

  const hisCategory = ['类型', '领域']
  const hisDetail = [['全部', 'IR路演', '分析师路演', '产品项目路演', '论坛峰会', '金融培训', '策略会', '其他'], ['全部', '宏观经济', '策略研究', '固定收益', '非银金融', '房地产', '文化传播', '计算机', '医药生物', '通讯电子',
    '社会服务', '公用事业', '食品饮料', '批发零售', '汽车及零部件', '有色金属', '军工机械', '纺织服装', '农林牧渔', '交通运输', '建筑建材',
    '煤炭开采', '造纸印刷', '金融工程', '化工', '电力设备与新能源', '钢铁', '家电', '银行', '互联网', '其他']]
  const hisDetailValue = [['', 'IR_ROADSHOW', 'ANALYST_ROADSHOW', 'PRODUCT_ROADSHOW', 'FORUMSUMMIT', 'FINACIAL_TRNG', 'STRATEGY_MEETING', 'OTHERS'],
    ['', 'MACRO_ECONOMY', 'OPERATIONAL_RESEARCH', 'FIXEDINCOME', 'NONBANKFINANCE', 'REALESTATE', 'CULTURAL', 'COMPUTER', 'BIO_MEDICINE',
      'TELECOMMUNICATION_ELECTRONICS', 'SOCIALSERVICE', 'PUBLICUTILITIES', 'FOOD_BEVERAGE', 'TRADE_RETAIL', 'AUTO_PARTS', 'NONFERROUS_METAL',
      'MILITARYMACHINERY', 'TEXTILES_GARMENTS', 'AGRICULTURE_FORESTRY', 'TRANSPORTATION', 'CONSTRUCTION_MATERIALS', 'COALMINING', 'PAPER_PRINGING',
      'FINANCIAL_ENGINEERING', 'CHEMICAL_INDUSTRY', 'POWER_EQUIPMENT', 'STEEL', 'APPLIANCES', 'BANK', 'INTERNET', 'OTHERS']]

  export default {
    name: 'historyMeeting',
    components: {
      selector, Scroll, ListView
    },
    mounted() {
      this._getHistoryMeeting(1)
    },
    computed: {
      historyMeeting() {
        return this.$store.getters.historyMeetingList
      }
    },
    data() {
      return {
        pullDownRefresh: {
          threshold: 50,
          stop: 40
        },
        pullUpLoad: {
          threshold: 50
        },
        hisTitle: hisCategory,
        hisSubTitle: hisDetail,
        hisMeetingVal: hisDetailValue,
        searchVal: {
          category: hisDetailValue[0][0],
          field: hisDetailValue[1][0]
        },
        currentPage: 1,
        // TODO 分页大小，可配置？
        pageSize: 10,
        noMoreData: false
      }
    },
    methods: {
      _searchValChange(index1, index2) {
        let val = hisDetailValue[index1][index2]
        if (index1 === 0) {
          this.searchVal.category = val
        } else {
          this.searchVal.field = val
        }
      },
      _getHistoryMeeting(currentPage) {
        this.currentPage = currentPage
        const url = getHistoryMeetingUrl
        let params = {
          'criteria': {
            'meetingStatus': ['ENDED'],
            'category': [this.searchVal.category],
            'field': [this.searchVal.field]
          },
          'isPaging': true,
          'pageSize': this.pageSize,
          'currentPage': currentPage
        }
        return api.getData(url, 'post', params)
          .then((res) => {
            let meetingList = []
            for (let meeting of res.list) {
              // let meetingItem = genMeetingListItem(meeting)
              let meetingItem = new Meeting(meeting)
              meetingList.push(meetingItem)
            }
            // 没有更多数据
            this.noMoreData = meetingList.length < this.pageSize
            // 对上拉下拉的处理
            if (currentPage === 1) {
              this.$store.commit(SET_HISTORY_MEETING_LIST, meetingList)
            } else {
              this.$store.commit(SET_HISTORY_MEETING_LIST, this.historyMeeting.concat(meetingList))
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
          this._getHistoryMeeting(1)
        },
        deep: true
      }
    }
  }

</script>

<style scoped lang="scss">

  .history-meeting-body {
    display: flex;
    flex-direction: column;
    padding-top: 40px;

    .history-meeting-selector {
      position: fixed;
      width: 100%;
      top: 44px;
      z-index: 99;
    }

    .scroll {
      height: 620px;
    }
  }
</style>

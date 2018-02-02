<template>
  <div class="meeting-detail">
    <!--pdf-->
    <div class="pdf-div">
      <img src="../../assets/default_pdf.jpg" style="width: 100%">
    </div>
    <!--会议标题-->
    <div class="meeting-title">
      <p>这里是会议标题</p>
    </div>
    <!--播放器-->
    <div class="player">
      这里是播放器
    </div>
    <!--会议信息和互动-->
    <div class="meeting-main">
      <tab-select :tabList="tabList" :tabIndex="tabIndex" @changeTab="_changeTab">
        <keep-alive>
          <component :is="currentContent"
                     :meetingDetail="meetingDetail"
                     :commentList="commentList"
                     :meetingId="meetingId"
                     @commentComplete="_getCommentList">
          </component>
        </keep-alive>
      </tab-select>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TabSelect from '../../base/tabSelect/tabSelect.vue'
  import meetingIntro from './meetingIntroduction.vue'
  import meetingComment from './meetingComment.vue'
  import { getMeetingDetailUrl, getMeetingCommentsDetailUrl } from 'api/config'
//  import { getMeetingDetailUrl } from 'api/config'
  import api from 'api/fetchData'
  export default {
    components: {
      TabSelect,
      'meetingIntro': meetingIntro,
      'meetingComment': meetingComment
    },
    data() {
      return {
        tabIndex: 0,
        currentContent: 'meetingIntro',
        tabList: [
          {
            index: 0,
            name: '会议简介',
            component: 'meetingIntro'
          },
          {
            index: 1,
            name: '互动',
            component: 'meetingComment'
          }
        ],
        meetingId: 0,
        meetingDetail: {
//          'id': 52469,
//          'title': '【金牌分析师】对话策略研究第一名：荀玉根',
//          'startTime': '2018-01-31 20:00:00',
//          'endTime': '2018-01-31 20:40:00',
//          'description': '<p>第五届Wind“金牌分析师”榜单已公布，Wind3C会议将邀约32个领域第一名金牌分析师在线路演。给您一个与顶尖大咖对话的机会。</p><p>此次对话，我们特邀Ｗind金牌分析师策略研究第一名，海通证券荀玉根通过3C中国财经会议在线与您对话。</p><p>会议开放提问，您可以在最新互动区域中文字提问，会议助理将在会议互动环节帮您提问题，请准时收听。</p>',
//          'agenda': '<p>这里是会议议程</p><p>这个还是</p>',
//          'lecturers': [
//            {
//              'id': 2727,
//              'name': '谢亚轩',
//              'title': '宏观首席分析师',
//              'description': '南开大学博士，现任招商证券研究一部的总经理助理，招商证券研究发展中心分析师（执行董事），此前曾任职于中国人民银行和国家外汇管理局深圳分局。2013年获新财富宏观经济第六名和水晶球奖宏观经济入围奖；2014年获新财富宏观经济入围奖；2015年新财富宏观经济第六名、第一财经第五名、水晶球奖第五名；2016年新财富宏观经济第五名，中证报金牛、第一财经、水晶球最佳分析师宏观经济第四名。2017年新财富、水晶球宏观经济入围奖。'
//            },
//            {
//              'id': 1521,
//              'name': '荀玉根',
//              'title': '首席策略分析师',
//              'description': '海通证券首席策略分析师、执行所长，博士，注册国际投资分析师，连续五年荣获各项最佳分析师评选前三名，2017年包揽各项第一，其中新财富最佳分析师两连冠、证券市场周刊水晶球最佳分析师三连冠 、中国保险资管业最受欢迎分析师两连冠 、中国证券报金牛奖最佳分析师第一。'
//            }
//          ],
//          'sponsors': [
//            {
//              'id': 361,
//              'name': 'Wind'
//            }
////            {
////              'id': 362,
////              'name': '招商证券'
////            }
//          ]
        },
        commentList: [
//          {
//            'id': 5777,
//            'content': '这是一条评论',
//            'commentTime': '2018-01-20 13:33:12',
//            'author': {
//              'crmId': 1619091,
//              'id': 379371,
//              'name': '蔡笑'
//            }
//          },
//          {
//            'id': 3423,
//            'content': '今天',
//            'commentTime': '2018-01-30 13:33:12',
//            'author': {
//              'crmId': 1669091,
//              'id': 377371,
//              'name': '3C小秘书'
//            }
//          },
//          {
//            'id': 4536,
//            'content': '什么时候了会计师的路口附近受得了看风景送来的快解放了SD卡积分就打卡机房了空间的算了可减肥了开始就颠覆了空间',
//            'commentTime': '2018-01-30 17:10:12',
//            'author': {
//              'crmId': 1619341,
//              'id': 379341,
//              'name': '邱意'
//            }
//          },
//          {
//            'id': 4536,
//            'content': '什么时候了会计师的路口附近受得了看风景送来的快解放了SD卡积分就打卡机房了空间的算了可减肥了开始就颠覆了空间',
//            'commentTime': '2018-01-30 17:10:12',
//            'author': {
//              'crmId': 1619341,
//              'id': 379341,
//              'name': '邱意'
//            }
//          }
        ]
      }
    },
    methods: {
      init() {
        this.meetingId = parseInt(this.$route.params.meetingId)
        this._getMeetingDetail()
        this._getCommentList()
      },
      _changeTab(tab) {
        this.tabIndex = tab.index
        this.currentContent = tab.component
      },
      _getMeetingDetail() {
        const url = getMeetingDetailUrl
        let params = {
          meetingId: this.meetingId
        }
        api.getData(url, 'get', { params: params })
          .then((res) => {
            this.meetingDetail = res
          })
          .catch((e) => {
            console.log(e)
          })
      },
      _getCommentList() {
        const url = getMeetingCommentsDetailUrl
        let params = {
          criteria: {
            meetingId: this.meetingId
          },
          isPaging: false,
          currentPage: 1,
          pageSize: 10
        }
        api.getData(url, 'post', params)
          .then((res) => {
            console.log(res)
            this.commentList = res.list
          })
          .catch((e) => {
          console.log(e)
          })
      }
    },
    created() {
      this.init()
    },
    activated() {
      this.init()
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $meetingDetail-color: #dd2738;
  $background-color: #fff;
  $meeting-title-height: 50px;
  $player-height: 80px;
  .meeting-detail {
    .meeting-title {
      height: $meeting-title-height;
    }
    .player {
      height: $player-height;
      background-color: #999;
    }
    .meeting-main {
      //
    }
  }
</style>

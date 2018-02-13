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
    <!--TODO 点击播放，加入最近播放-->
    <div class="player">
      这里是播放器
    </div>
    <!--会议信息和互动-->
    <div class="meeting-main">
      <tab-select :tabList="tabList" :tabIndex="tabIndex" @changeTab="_changeTab">
        <keep-alive>
          <component :is="currentContent"
                     @commentComplete="_getCommentList">
          </component>
        </keep-alive>
      </tab-select>
    </div>
    <!--顶部更多Btn-->
    <div class="more-detail">
      <mt-popup v-model="moreDetailPopup"
                position="bottom">
        <div class="share-meeting">
          <div class="share-select">
            <div class="share-to-weChat" @click="clickOnShareToWeChat">
              <img src="../../assets/chat.png" />
              <div class="share-text"><span>微信好友</span></div>
            </div>
            <div class="share-to-moment" @click="clickOnShareToMoment">
              <img src="../../assets/circle_chat.png" />
              <div class="share-text"><span>微信朋友圈</span></div>
            </div>
          </div>
          <div class="share-cancel-btn" @click="clickOnShareCancel">
            <span>取消</span>
          </div>
        </div>
      </mt-popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import TabSelect from '../../base/tabSelect/tabSelect.vue'
  import meetingIntro from './meetingIntroduction.vue'
  import meetingComment from './meetingComment.vue'
  import { getMeetingDetailUrl, getMeetingCommentsDetailUrl } from 'api/config'
  import { SET_MORE_DETAIL_POPUP, SET_MEETING_DETAIL, SET_COMMENT_LIST } from '../../store/mutation-types'
  import { genMeetingDetailItem, genCommentItem } from '../../common/js/utils'
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
        //更多弹出框控制
        moreDetailPopup: false
      }
    },
    computed: {
      meetingDetail() {
        return this.$store.getters.meetingDetail
      }
    },
    methods: {
      init() {
        this.meetingId = parseInt(this.$route.params.meetingId)
        console.log(this.$route)
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
            let meeting = genMeetingDetailItem(res)
            this.$store.commit(SET_MEETING_DETAIL, meeting)
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
            let commentList = []
            for (let comment of res.list) {
              commentList.push(genCommentItem(comment))
            }
            this.$store.commit(SET_COMMENT_LIST, commentList)
          })
          .catch((e) => {
          console.log(e)
          })
      },
      clickOnShareCancel() {
        this.moreDetailPopup = false
      },
      clickOnShareToWeChat() {
        this.moreDetailPopup = false
        //TODO
        console.log('click on share to wechat...')
      },
      clickOnShareToMoment() {
        this.moreDetailPopup = false
        //TODO
        console.log('click on share to moment...')
      }
    },
    created() {
      this.init()
    },
    activated() {
      this.init()
    },
    watch: {
      '$store.getters.moreDetailPopup': function () {
        this.moreDetailPopup = this.$store.getters.moreDetailPopup
      },
      'moreDetailPopup': function () {
        this.$store.commit(SET_MORE_DETAIL_POPUP, this.moreDetailPopup)
      }
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
    .more-detail {
      .share-meeting {
        // TODO 不写固定宽度
        width: 375px;
        background-color: $background-color;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        .share-select {
          display: flex;
          flex-direction: row;
          padding: 20px 20px;
          border-bottom: 1px solid #ddd;
          .share-to-weChat, .share-to-moment {
            /*width: 60px;*/
            /*height: 60px;*/
            text-align: center;
            padding: 0 5px;
          }
          img {
            width: 42px;
            height: 42px;
            text-align: center;
          }
          .share-text {
            margin-top: 5px;
            text-align: center;
          }
        }
        .share-cancel-btn {
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
      }
    }
  }
</style>

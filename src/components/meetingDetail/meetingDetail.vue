<template>
  <!--TODO 存在兼容问题，safari & chrome-->
  <div class="detail-wrapper" ref="wrapper" @touchmove="onDetailTouchMove" @scroll="onDetailScroll">
    <div class="meeting-detail">

      <div class="fixed-title" v-show="titleIndex === 0 || titleIndex === 1">
        <div>
          <span :class="[{ 'active': titleIndex === 0 }]"
                @click="onClickNav(0)">详情</span>
        </div>
        <div>
          <span :class="[{ 'active': titleIndex === 1 }]"
                @click="onClickNav(1)">互动</span>
        </div>
      </div>

      <!--pdf title player-->
      <div class="meeting-native" ref="native">
        <!--pdf-->
        <div class="pdf">
          <img src="../../assets/default_pdf.jpg">
        </div>
        <!--会议标题-->
        <div class="title">
          <p>这里是会议标题</p>
        </div>
        <!--播放器-->
        <!--TODO 点击播放，加入最近播放-->
        <div class="player">
          这里是播放器
        </div>
      </div>

      <!--会议简介-->
      <div class="meeting-intro" ref="intro">
        <div class="basic-info">
          <div class="title">
            <span>基本信息</span>
          </div>
          <div class="content">
            <div class="meeting-time">{{ meetingDetail.meetingTime }}</div>
            <div class="speakers">
              <p v-for="(speaker, index) in meetingDetail.lecturers" :key="index">{{ speaker.intro }}</p>
            </div>
            <div class="sponsors">
              <p v-for="(sponsor, index) in meetingDetail.sponsors" :key="index">{{ sponsor.name }}</p>
            </div>
          </div>
        </div>
        <!--简介-->
        <!--TODO v-html 先转义 -->
        <div class="intro">
          <div class="title">
            <span>会议简介</span>
          </div>
          <div v-html="meetingDetail.description" class="content"></div>
        </div>
        <!--议程-->
        <div v-if="meetingDetail.agenda" class="meeting-agenda">
          <div class="title">
            <span>会议议程</span>
          </div>
          <div v-html="meetingDetail.agenda" class="content"></div>
        </div>
        <!--主讲人简介-->
        <div class="speaker-intro">
          <div class="title">
            <span>主讲人简介</span>
          </div>
          <div class="content">
            <p v-for="(speaker, index) in meetingDetail.lecturers" :key="index">
              <span class="speaker-name">{{ speaker.name }}</span>
              <span>&nbsp;</span>
              {{ speaker.description }}
        </p>
          </div>
        </div>
      </div>

      <!--评论-->
      <div class="meeting-comment">
        <div class="comment-title">
          <span>最新互动</span>
          <span>({{ commentList.length }})</span>
        </div>
        <div class="comment-list">
          <div v-for="(comment, index) in commentList" :key="index" class="item">
            <p class="title">
              <span class="name">{{ comment.authorName }}</span>
              <span class="time">{{ comment.commentTime }}</span>
            </p>
            <p class="content" :class="[{'admin': comment.authorName === '3C小秘书'}]">{{ comment.content }}</p>
          </div>
        </div>
        <!--底部评论框-->
        <div class="comment-bottom">
          <popup v-model="commentPopup">
            <div class="comment-popup">
              <div class="popup-title">
                <p class="">评论</p>
              </div>
              <analog-textarea :maxCount="140" :message="'评论最多140字'"
                               :placeholderText="'请输入评论，不超过140字'"
                               :class="'comment-textarea'"
                               :clearContent="clearContent"
                               @contentChange="_handleContentChange">
              </analog-textarea>
              <div class="popup-bottom">
                <span :class="[{ 'button-invalid': commentBtnInvalid }, 'send-comment-btn']" @click="_sendComment">发表评论</span>
              </div>
            </div>
          </popup>
          <div class="comment-button" @click="_togglePopUp">
            <span></span>
            <span>发言</span>
          </div>
        </div>
      </div>

      <!--分享-->
      <popup v-model="popup">
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
      </popup>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getMeetingDetailUrl, getMeetingCommentsDetailUrl, commentMeetingUrl } from 'api/config'
  import { MeetingDetail, genCommentItem } from 'common/js/utils'
  import api from 'api/fetchData'
  import Popup from 'base/popup/popup'
  import { mapGetters, mapMutations } from 'vuex'
  import AnalogTextarea from 'base/analogTextarea/analogTextarea'

  const FIXED_TITLE_HEIGHT = 40

  export default {
    components: {
      AnalogTextarea,
      Popup
    },
    data() {
      return {
        popup: false,
        commentPopup: false,
        commentContent: '',
        commentBtnInvalid: true,
        clearContent: false,
        titleIndex: -1,
        scrollTop: 0
      }
    },
    created() {
      this.nativeHeight = 373
      this.introHeight = 411
    },
// TODO pic load
//    mounted() {
//      this.nativeHeight = this.$refs.native.clientHeight
//      this.introHeight = this.$refs.intro.clientHeight
//    },
    computed: {
      ...mapGetters([
        'commentList',
        'meetingDetail',
        'headerMorePopup'
      ])
    },
    methods: {
      ...mapMutations({
        setHeaderMorePopup: 'SET_HEADER_MORE_POPUP',
        setMeetingDetail: 'SET_MEETING_DETAIL',
        setCommentList: 'SET_COMMENT_LIST'
      }),
      init() {
        this.meetingId = parseInt(this.$route.params.meetingId)
        console.log(this.$route)
        this._getMeetingDetail()
        this._getCommentList()
      },
      _getMeetingDetail() {
        const url = getMeetingDetailUrl
        let params = {
          meetingId: this.meetingId
        }
        api.getData(url, 'get', { params: params })
          .then((res) => {
            let meeting = new MeetingDetail(res)
            this.setMeetingDetail(meeting)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      clickOnShareCancel() {
        this.setHeaderMorePopup(false)
      },
      clickOnShareToWeChat() {
        this.setHeaderMorePopup(false)
        //TODO
        console.log('click on share to wechat...')
      },
      clickOnShareToMoment() {
        this.setHeaderMorePopup(false)
        //TODO
        console.log('click on share to moment...')
      },
      _togglePopUp() {
        this.commentPopup = true
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
            this.setCommentList(commentList)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      _sendComment() {
        // 字数超过，按钮无效
        if (this.commentBtnInvalid) return
        this.commentPopup = false
        const url = commentMeetingUrl
        let params = {
          // TODO
          commentDevice: '',
          content: this.commentContent,
          isAnonymous: false,
          parentCommentId: '',
          meeting: {
            id: this.meetingDetail.id
          }
        }
        console.log(this.commentContent)
        console.log(params)
        api.getData(url, 'post', params)
          .then((res) => {
            console.log(res)
            this.commentContent = ''
            this._getCommentList()
          })
          .catch((e) => {
            console.log(e)
          })
      },
      _handleContentChange(content) {
        this.commentContent = content
      },
      onDetailTouchMove() {
//        this.scrollTop = this.$refs.wrapper.scrollTop
      },
      onDetailScroll(e) {
        this.scrollTop = this.$refs.wrapper.scrollTop
      },
      onClickNav(index) {
        this.titleIndex = index
        if (index === 0) {
          this.$refs.wrapper.scrollTop = this.nativeHeight - FIXED_TITLE_HEIGHT
        } else if (index === 1) {
          this.$refs.wrapper.scrollTop = this.nativeHeight + this.introHeight - FIXED_TITLE_HEIGHT
        }
        console.log(this.$refs.wrapper.scrollTop)
      }
    },
    activated() {
      this.init()
    },
    watch: {
      headerMorePopup(newVal) {
        this.popup = newVal
      },
      popup(newVal) {
        this.setHeaderMorePopup(newVal)
      },
      commentContent() {
        this.commentBtnInvalid = !(this.commentContent.length > 0 && this.commentContent.length <= 140)
        this.clearContent = this.commentContent.length === 0
      },
      scrollTop(newVal) {
        if (!this.nativeHeight || !this.introHeight) {
          return
        }
        console.log('scrollTop: ' + newVal)
        const topHeight = this.nativeHeight - FIXED_TITLE_HEIGHT
        const bottomHeight = this.nativeHeight + this.introHeight - FIXED_TITLE_HEIGHT
        if (newVal < topHeight) {
          this.titleIndex = -1
        } else if (newVal >= topHeight && newVal < bottomHeight) {
          this.titleIndex = 0
        } else {
          this.titleIndex = 1
        }
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $meetingDetail-color: #dd2738;
  $background-color: #fff;
  $meeting-title-height: 50px;
  $player-height: 80px;
  $share-cancel-btn-height: 40px;
  $share-icon-size: 42px;
  $share-border-color: #ddd;
  .detail-wrapper {
    height: 622px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .meeting-detail {
    .meeting-native {
      .pdf {
        img {
          width: 375px;
        }
      }
      .title {
        height: $meeting-title-height;
      }
      .player {
        height: $player-height;
      }
    }
    .fixed-title {
      position: fixed;
      top: 45px;
      display: flex;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #eee;
      div {
        flex: 1;
        display: flex;
        justify-content: center;
        justify-items: center;
        span {
          padding: 0 30px;
        }
        .active {
          color: $meetingDetail-color;
          border-bottom: 2px solid $meetingDetail-color;
        }
      }
    }
    $title-border-color: #5470b5;
    $title-color: #000;
    $speaker-name-color: #000;
    $content-color: #8f8f94;
    $intro-border-color: #eee;
    .meeting-intro {
      /*padding-top: 40px;*/
      .basic-info {
        //
      }
      .speaker-intro {
        .speaker-name {
          color: $speaker-name-color;
          font-weight: 700;
        }
      }
      .title {
        padding: 10px 0;
        color: $title-color;
        font-size: $font-size-medium-x;
        background: $background-color;
        border-top: 1px solid $intro-border-color;
      }
      .title span {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-left: 5px solid $title-border-color;
        text-indent: 12px;
      }
      .content {
        padding: 10px 15px;
        color: $content-color;
        background-color: $background-color;
        font-size: $font-size-medium;
      }
    }
    $comment-name-color: #5470b5;
    $title-color: #000;
    $content-color: #8f8f94;
    $comment-button-height: 40px;
    .meeting-comment {
      .comment-title {
        padding: 10px 0;
        color: $title-color;
        font-size: $font-size-medium-x;
        background: $background-color;
        border-top: 1px solid $intro-border-color;
        span:nth-child(1) {
          width: 100%;
          height: 100%;
          padding-left: 12px;
          border-left: 5px solid $title-border-color;
        }
        span:nth-child(2) {
          color: #8f8f94;
          font-size: $font-size-medium;
        }
      }
      .comment-list {
        margin-bottom: 40px;
        .item {
          background-color: $background-color;
          padding: 10px 15px;
          font-size: $font-size-medium;
          /* TODO 更好的解决方案 */
          border-bottom: 2px solid #eee;
          .name {
            color: $comment-name-color;
          }
          .time {
            margin-left: 10px;
          }
          .content {
            font-size: $font-size-medium;
            margin-top: 6px;
          }
          .admin {
            color: red;
          }
        }
      }
      .comment-bottom {
        background-color: #eee;
        position: absolute;
        bottom: 0;
        width: 100%;
        /* TODO 更好的解决方案 */
        border-top: 1px solid rgba(207, 207, 207, 0.82);
        .comment-button {
          display: flex;
          height: $comment-button-height;
          line-height: $comment-button-height;
          span:nth-child(1) {
            flex: 4;
            margin: 5px 0 5px 20px;
            border-radius: 6px;
            background-color: #ddd;
          }
          span:nth-child(2) {
            flex: 1;
            text-align: center;
            font-size: $font-size-medium;
          }
        }
        .comment-popup {
          width: 375px;
          background-color: $background-color;
          font-size: $font-size-medium;
          border-top: 1px solid #ccc;
          .popup-title {
            text-align: center;
            height: 20px;
            line-height: 20px;
            color: #dd524d;
            padding: 5px 0;
          }
          .comment-textarea {
            padding: 10px 10px 0 10px;
            border-radius: 4px;
            margin: 0 15px;
            font-size: $font-size-medium;
            background-color: #eee;
            color: #8f8f94;
            min-height: 60px;
            max-height: 100px;
            overflow: scroll;
          }
          .popup-bottom {
            height: 40px;
            .send-comment-btn {
              background-color: #dd524d;
              border-radius: 2px;
              color: #fff;
              padding: 5px 10px;
              margin-top: 6px;
              position: absolute;
              right: 10px;
            }
            .button-invalid {
              background-color: rgba(198, 76, 71, 0.49);
            }
          }
        }
      }
    }
    .share-meeting {
      // TODO 不写固定宽度
      width: 375px;
      background-color: $background-color;
      font-size: $font-size-medium;
      border-top: 1px solid $share-border-color;
      display: flex;
      flex-direction: column;
      .share-select {
        display: flex;
        padding: 20px;
        border-bottom: 1px solid $share-border-color;
        .share-to-weChat, .share-to-moment {
          text-align: center;
          padding: 0 5px;
        }
        img {
          width: $share-icon-size;
          height: $share-icon-size;
          text-align: center;
        }
        .share-text {
          margin-top: 5px;
          text-align: center;
        }
      }
      .share-cancel-btn {
        height: $share-cancel-btn-height;
        line-height: $share-cancel-btn-height;
        text-align: center;
      }
    }
  }
</style>

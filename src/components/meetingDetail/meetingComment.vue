<template>
  <div class="meeting-comment">
    <!--评论列表-->
    <div class="comment-list">
      <div v-for="(comment, index) in commentList" :key="index" class="comment-item">
        <p class="comment-title">
          <span class="comment-name">{{ comment.authorName }}</span>
          <span class="comment-time">{{ comment.commentTime }}</span>
        </p>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
    <!--底部Btn-->
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
</template>

<script type="text/ecmascript-6">
  import { getMeetingCommentsDetailUrl, commentMeetingUrl } from 'api/config'
  import { genCommentItem } from 'common/js/utils'
  import api from 'api/fetchData'
  import AnalogTextarea from 'base/analogTextarea/analogTextarea'
  import Popup from 'base/popup/popup'
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    name: 'meetingComment',
    components: {
      AnalogTextarea,
      Popup
    },
    data() {
      return {
        commentPopup: false,
        commentContent: '',
        commentBtnInvalid: true,
        clearContent: false
      }
    },
    computed: {
      ...mapGetters([
        'commentList',
        'meetingDetail'
      ])
    },
    methods: {
      ...mapMutations({
        setCommentList: 'SET_COMMENT_LIST'
      }),
      _togglePopUp() {
        this.commentPopup = true
      },
      _getCommentList() {
        const url = getMeetingCommentsDetailUrl
        let params = {
          criteria: {
            meetingId: this.meetingDetail.id
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
      }
    },
    activated() {
      console.log('comment activated...')
      this._getCommentList()
    },
    watch: {
      commentContent() {
        this.commentBtnInvalid = !(this.commentContent.length > 0 && this.commentContent.length <= 140)
        this.clearContent = this.commentContent.length === 0
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $meetingDetail-color: #dd2738;
  $background-color: #fff;
  $comment-name-color: #5470b5;
  $title-color: #000;
  $content-color: #8f8f94;
  $comment-button-height: 40px;
  .meeting-comment {
    .comment-list {
      margin-bottom: 40px;
      .comment-item {
        background-color: $background-color;
        padding: 10px 15px;
        font-size: $font-size-medium;
        /* TODO 更好的解决方案 */
        border-bottom: 2px solid #eee;
        .comment-name {
          color: $comment-name-color;
        }
        .comment-time {
          margin-left: 10px;
        }
        .comment-content {
          font-size: $font-size-medium;
          margin-top: 6px;
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
</style>

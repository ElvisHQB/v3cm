<template>
  <div class="meeting-comment">
    <!--评论列表-->
    <div class="comment-list">
      <div v-for="(comment, index) in commentList" v-bind:key="index" class="comment-item">
        <p class="comment-title">
          <span class="comment-name">{{ comment.authorName }}</span>
          <span class="comment-time">{{ comment.commentTime }}</span>
        </p>
        <p class="comment-content">{{ comment.content }}</p>
      </div>
    </div>
    <!--底部Btn-->
    <div class="comment-bottom">
      <mt-popup v-model="commentPopup"
                position="bottom">
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
            <span v-bind:class="[{ 'button-invalid': commentBtnInvalid }, 'send-comment-btn']" @click="_sendComment">发表评论</span>
          </div>
        </div>
      </mt-popup>
      <div class="comment-button" @click="_togglePopUp">
        <span class="button-text">发言</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { commentMeetingUrl } from 'api/config'
  import api from 'api/fetchData'
  import AnalogTextarea from 'base/analogTextarea/analogTextarea'
  import { Popup } from 'mint-ui'

  export default {
    name: 'meetingComment',
    components: {
      AnalogTextarea,
      'mt-popup': Popup
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
      commentList() {
        return this.$store.getters.commentList
      },
      meetingDetail() {
        return this.$store.getters.meetingDetail
      }
    },
    methods: {
      _togglePopUp() {
        this.commentPopup = true
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
            this.$emit('commentComplete')
            this.commentContent = ''
          })
          .catch((e) => {
            console.log(e)
          })
      },
      _handleContentChange(content) {
        this.commentContent = content
      }
    },
    watch: {
      'commentContent': function () {
        this.commentBtnInvalid = !(this.commentContent.length > 0 && this.commentContent.length <= 140)
        this.clearContent = this.commentContent.length === 0
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $meetingDetail-color: #dd2738;
  $background-color: #fff;
  $comment-name-color: #5470b5;
  $title-color: #000;
  $content-color: #8f8f94;
  .meeting-comment {
    .comment-list {
      margin-bottom: 40px;
      .comment-item {
        background-color: $background-color;
        padding: 10px 15px;
        font-size: 14px;
        /* TODO 更好的解决方案 */
        border-bottom: 2px solid #eee;
        .comment-name {
          color: $comment-name-color;
        }
        .comment-time {
          margin-left: 10px;
        }
        .comment-content {
          font-size: 15px;
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
        height: 40px;
        line-height: 40px;
        width: 70%;
        margin: 0 auto;
        background-color: $comment-name-color;
        color: #fff;
        text-align: center;
        border-radius: 8px;
        .button-text {
          font-size: 16px;
        }
      }
      .comment-popup {
        width: 375px;
        background-color: $background-color;
        font-size: 14px;
        .popup-title {
          text-align: center;
          height: 20px;
          line-height: 20px;
          color: #dd524d;
          padding: 5px 0;
        }
        .comment-textarea {
          padding: 10px 10px 0px 10px;
          border-radius: 4px;
          margin: 0 15px;
          font-size: 14px;
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

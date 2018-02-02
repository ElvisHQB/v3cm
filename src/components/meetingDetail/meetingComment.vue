<template>
  <div class="meeting-comment">
    <!--评论列表-->
    <div class="comment-list">
      <div v-for="(comment, index) in commentList" v-bind:key="index" class="comment-item">
        <p class="comment-title">
          <span class="comment-name">{{ comment.author.name }}</span>
          <span class="comment-time">{{ _getCommentTime(comment.commentTime) }}</span>
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
          <div class="popup-content">
            <!--<div class="popup-textarea" contenteditable="true" placeholder="请输入评论，不超过140字"></div>-->
            <!--innerText & textContent-->
            <div v-on:input="_onInputChange($event.target.textContent)" contenteditable="true" class="popup-textarea"></div>
            <div v-bind:class="[{ 'count-exceed': countExceed }, 'comment-counter']">
              <span class="">{{ currentCount }}</span>
              <span>/</span>
              <span>{{ maxCount }}</span>
            </div>
            <!--<div class="comment-text-field"></div>-->
          </div>
          <div class="popup-bottom">
            <span v-bind:class="[{ 'button-invalid': countExceed }, 'send-comment-btn']" @click="_sendComment">发表评论</span>
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
  import { getTimeFormatText } from '../../common/js/utils'
  import { commentMeetingUrl } from '../../api/config'
  import { Toast } from 'mint-ui'
  import api from 'api/fetchData'
  export default {
    name: 'meetingComment',
    props: {
      meetingId: {
        type: Number,
        default: 0
      },
      commentList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        'commentPopup': false,
        'commentContent': '这是一条测试专用评论',
        'currentCount': 0,
        'maxCount': 140,
        'countExceed': false
      }
    },
    methods: {
      _onInputChange(content) {
        this.commentContent = content
        this.currentCount = content.length
        this.countExceed = this.currentCount > this.maxCount
        if (this.countExceed) {
          Toast({
            message: '评论最多140字',
            position: 'middle',
            duration: 3000
          })
        }
      },
      _getCommentTime(commentTime) {
        let date = new Date(commentTime)
        return getTimeFormatText(date)
      },
      _togglePopUp() {
        this.commentPopup = true
      },
      _sendComment() {
        // 字数超过，按钮无效
        if (this.countExceed) return
        this.commentPopup = false
        const url = commentMeetingUrl
        let params = {
          // TODO
          commentDevice: '',
          content: this.commentContent,
          isAnonymous: false,
          parentCommentId: '',
          meeting: {
            id: this.meetingId
          }
        }
        console.log(this.commentContent)
        console.log(params)
        api.getData(url, 'post', params)
          .then((res) => {
            console.log(res)
            this.$emit('commentComplete')
          })
          .catch((e) => {
            console.log(e)
          })
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
        /*display: flex;*/
        /*flex-direction: column;*/
        .popup-title {
          text-align: center;
          height: 20px;
          line-height: 20px;
          color: #dd524d;
          padding: 5px 0;
        }
        .popup-content {
          margin: 0 10px;
          border-radius: 4px;
          background-color: #eee;
          .popup-textarea {
            outline: none;
            border: none;
            padding: 10px 15px;
            font-size: 14px;
            color: #8f8f94;
            /*TODO*/
            min-height: 60px;
            max-height: 100px;
            overflow: scroll;
          }
          .comment-counter {
            text-align: right;
            padding-right: 5px;
            height: 20px;
            line-height: 20px;
          }
          .count-exceed {
            color: #dd524d;
          }
          /*TODO*/
          /*.popup-textarea:empty::before {*/
            /*color: lightgray;*/
            /*content: attr(placeholder);*/
          /*}*/
        }
        .popup-bottom {
          height: 40px;
          .send-comment-btn {
            background-color: #dd524d;
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

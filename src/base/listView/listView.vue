<template>
  <div class="list-wrapper" @click="turnToDetail(item.id, item.isRestricted)">
    <!--顶部列表内容-->
    <div class="list-top-item">
      <div class="list-left-content">
        <!--渲染会议状态和报名状态标识-->
        <div v-if="renderImgTile" class="list-img-title">
          <div v-if="renderSignupStatus" class="img-title">
            <img src="../../assets/bq2.png">
            <div class="img-title-text"><span>已报名</span></div>
          </div>
          <div v-if="renderMeetingStatus" class="img-title">
            <img src="../../assets/bq1.png">
            <div class="img-title-text"><span>直播中</span></div>
          </div>
        </div>
        <!--机构Logo-->
        <div class="left-img-wrapper">
          <img class="left-img" v-lazy="item.imgUrl">
        </div>
      </div>
      <div class="list-right-content">
        <!--会议标题时间及主讲人信息-->
        <div class="right-p-wrapper">
          <p>{{ item.title }}</p>
          <p><span>{{ item.lecturer }}</span><span>{{ item.sponsor }}</span></p>
          <p>{{ item.meetingTime }}</p>
        </div>
        <!--渲染推荐状态标识-->
        <div v-if="renderRecommend"  class="recommend-mark">
          <img src="../../assets/tj.png" style="width: 20px">
        </div>
      </div>
    </div>
    <!--底部会议下载，看速记，听录音-->
    <div v-if="renderBottomItem" class="list-bottom-item">
      <div v-if="renderRecord" class="item" @click.stop="clickRecord(item)">
        <div class="top-icon-item">
          <span><i class="icon-jianting"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>听录音</span>
        </div>
      </div>
      <div v-if="renderShortHand" class="item" @click.stop="clickShortHand(item.id, item.pdfId, item.title)">
        <div class="top-icon-item">
          <span><i class="icon-doc"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>看速记</span>
        </div>
      </div>
      <div v-if="renderDownload" class="item" @click.stop="clickDownload(item.id, item.audioId, item.title)">
        <div class="top-icon-item">
          <span><i class="icon-download"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>下载</span>
        </div>
      </div>
      <div v-if="renderVideo" class="item" @click.stop="clickVideo(item)">
        <div class="top-icon-item">
          <span><i class="icon-video"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>看视频</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { detailAuthentication, getAudioUrl, getDocument, getMeetingPlayback } from 'common/js/httpRequests'

  export default {
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    created () {
    },
    computed: {
      // TODO 只在最新会议页面渲染 or 所有页面
      renderImgTile() {
        return (this.item.meetingStatus === 'STARTED') || (this.item.signupStatus === true)
      },
      renderMeetingStatus() {
        return this.item.meetingStatus === 'STARTED'
      },
      renderSignupStatus() {
        return (this.item.signupStatus === true) && (this.item.meetingStatus !== 'STARTED')
      },
      renderRecommend() {
        return this.item.recommend && ((this.item.meetingStatus === 'PUBLISHED') || (this.item.meetingStatus === 'STARTED'))
      },
      renderBottomItem() {
        return (this.item.pdfId !== 0) || (this.item.audioId !== 0) || (this.item.broadcastType === 'WEBVIDEO')
      },
      renderDownload() {
        return this.item.audioId !== 0
      },
      renderRecord() {
        return this.item.audioId !== 0
      },
      renderShortHand() {
        return this.item.pdfId !== 0
      },
      renderVideo() {
        return this.item.broadcastType === 'WEBVIDEO'
      }
    },
    methods: {
      turnToDetail (id, isRestricted) {
        let self = this
        detailAuthentication(id, isRestricted, self)
      },
      clickRecord(item) {
        let self = this
        getAudioUrl(item.id, item.audioId, item.title, false, self, item)
      },
      clickShortHand(id, pdfId, title) {
        let self = this
        getDocument(id, pdfId, title, self)
      },
      clickDownload(id, audioId, title) {
        let self = this
        getAudioUrl(id, audioId, title, true, self)
      },
      clickVideo(item) {
        getMeetingPlayback(item)
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';

  $list-color: #fff;
  $list-line-height: 22px;
  $speaker-color: #3ba3df;
  $left-img-width: 60px;
  $left-img-height: 60px;
  $list-bottom-item-height: 45px;

  .list-wrapper {
    background-color: $list-color;
    position: relative;
    margin-top: 6px;
    padding: 11px 15px;
    .list-top-item {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      .list-left-content {
        .list-img-title {
          position: absolute;
          left: 5px;
          top: 0;
          width: 50px;
          .img-title {
            img {
              width: 50px;
              height: 21px;
            }
            .img-title-text {
              position: absolute;
              left: 7px;
              top: 0;
              font-size: 12px;
              color: white;
            }
          }
        }
        .left-img-wrapper {
          .left-img {
            width: $left-img-width;
            min-width: $left-img-width;
            height: $left-img-height;
            line-height: $left-img-height;
            margin-top: 3px;
            margin-right: 10px;
          }
        }
      }
      .list-right-content {
        .right-p-wrapper {
          /*padding-right: 20px;*/
          line-height: $list-line-height;
          p:nth-child(1) {
            font-size: $font-size-medium-x;
            padding-right: 30px;
            margin-bottom: 7px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            line-height: $list-line-height;
            max-height: $list-line-height * 2;
            //TODO 兼容性较差寻找更好的方式实现
            -webkit-line-clamp: 2;
          }
          p:nth-child(2) {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            height: $list-line-height;
            line-height: $list-line-height;
            max-height: $list-line-height;
            -webkit-line-clamp: 1;
            span:first-child {
              margin-right: 10px;
              color: $speaker-color;
            }
          }
          p:nth-child(3) {
            .days, .weeks, .hours {
              margin-right: 5px;
            }
          }
        }
        .recommend-mark {
          position: absolute;
          right: 20px;
          top: 20px;
          height: 20px;
          width: 20px;
        }
      }
    }
    .list-bottom-item {
      height: $list-bottom-item-height;
      margin-left: $left-img-height + 10px;
      display: flex;
      flex-direction: row-reverse;
      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        // TODO 排列方式及间隔
        max-width: 90px;
        .top-icon-item {
          flex: 1;
          color: $color-theme;
          text-align: center;
          .icon-download, .icon-video, .icon-jianting, .icon-doc {
            font-size: 20px;
          }
        }
        .bottom-text-item {
          flex: 1;
          color: #999;
          text-align: center;
          font-size: 14px;
        }
      }
    }
  }
</style>

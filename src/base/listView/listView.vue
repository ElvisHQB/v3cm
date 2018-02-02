<template>
  <div class="list-wrapper" @click="turnToDetail(item.id)">
    <div class="list-top-item">
      <div class="list-left-content">
        <div v-if="renderImgTile" class="list-img-title">
          <div v-if="renderMeetingStatus">
            <img src="../../assets/bq2.png" style="width: 50px">
          </div>
          <div v-if="renderSignupStatus">
            <img src="../../assets/bq1.png" style="width: 50px">
          </div>
        </div>
        <div class="left-img-wrapper">
          <img class="left-img" v-lazy="item.imgUrl">
        </div>
      </div>
      <div class="list-right-content">
        <div class="right-p-wrapper">
          <p class="right-p-title">{{ item.title }}</p>
          <p class="right-p-speaker-sponsor"><span class="speaker">{{ item.lecturer }}</span><span class="sponsor">{{ item.sponsor }}</span></p>
          <p class="right-p-time">{{ item.meetingTime }}</p>
        </div>
        <div v-if="renderRecommend">
          <img src="../../assets/tj.png" style="width: 20px">
        </div>
      </div>
    </div>
    <!---->
    <div v-if="renderBottomItem" class="list-bottom-item">
      <div v-if="renderRecord" class="item" @click.stop="clickRecord(item.id, item.audioId)">
        <div class="top-icon-item">
          <span><i class="icon-jianting"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>听录音</span>
        </div>
      </div>
      <div v-if="renderShortHand" class="item" @click.stop="clickShortHand(item.id, item.pdfId)">
        <div class="top-icon-item">
          <span><i class="icon-doc"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>看速记</span>
        </div>
      </div>
      <div v-if="renderDownload" class="item" @click.stop="clickDownload(item.id, item.audioId)">
        <div class="top-icon-item">
          <span><i class="icon-download"></i></span>
        </div>
        <div class="bottom-text-item">
          <span>下载</span>
        </div>
      </div>
      <div v-if="renderVideo" class="item" @click.stop="clickVideo(item.id, item.title)">
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
  import { getRecordUrl, getMeetingPlaybackUrl, getDocumentUrl } from 'api/config'
  import api from 'api/fetchData'
  import { openWebView } from 'api/native'
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
        return this.item.recommend
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
      turnToDetail (id) {
        this.$router.push({name: 'meetingDetail', params: {meetingId: id}})
      },
      clickRecord(id, audioId) {
        const url = getRecordUrl
        let params = {
          meetingId: id,
          audioId: audioId
        }
        return api.getData(url, 'get', { params: params })
          .then((res) => {
            const recordUrl = res
            console.log(recordUrl)
            // TODO
          })
          .catch((e) => {
            console.log(e)
          })
      },
      clickShortHand(id, pdfId) {
        const url = getDocumentUrl
        let params = {
          meetingId: id,
          documentId: pdfId,
          documentType: 'SHORTHAND'
        }
        return api.getData(url, 'get', { params: params })
          .then((res) => {
            const documentUrl = res
            console.log(documentUrl)
            // TODO
          })
          .catch((e) => {
            console.log(e)
          })
      },
      clickDownload(id, audioId) {
        const url = getRecordUrl
        let params = {
          meetingId: id,
          audioId: audioId
        }
        return api.getData(url, 'get', { params: params })
          .then((res) => {
            const downloadUrl = res
            console.log(downloadUrl)
            // TODO
          })
          .catch((e) => {
            console.log(e)
          })
      },
      clickVideo(id, title) {
        const url = getMeetingPlaybackUrl
        let params = {
          meetingId: id
        }
        return api.getData(url, 'get', { params: params })
          .then((res) => {
            const videoUrl = res
            console.log(videoUrl)
            // TODO url拼接
            //通过WebView在APP打开网页页面
            openWebView(true, title, videoUrl, true)
          })
          .catch((e) => {
            console.log(e)
          })
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
    display: flex;
    flex-direction: column;
    margin-top: 6px;
    padding: 11px 15px;
    .list-top-item {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      .list-left-content {
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
          .right-p-title {
            font-size: $font-size-medium-x;
            padding-right: 20px;
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
          .right-p-speaker-sponsor {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            height: $list-line-height;
            line-height: $list-line-height;
            max-height: $list-line-height;
            -webkit-line-clamp: 1;
            .speaker {
              margin-right: 10px;
              color: $speaker-color;
            }
          }
          .right-p-time {
            .days, .weeks, .hours {
              margin-right: 5px;
            }
          }
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

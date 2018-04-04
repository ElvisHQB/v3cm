<template>
  <div v-if="renderOperation" class="operation">
    <div v-if="renderRecord" class="item" @click.stop="_clickRecord(item)">
      <span class="top-icon"><i class="icon-jianting"></i></span>
      <span class="bottom-text">听录音</span>
    </div>
    <div v-if="renderShortHand" class="item" @click.stop="_clickShortHand(item.id, item.pdfId, item.title)">
      <span class="top-icon"><i class="icon-doc"></i></span>
      <span class="bottom-text">看速记</span>
    </div>
    <div v-if="renderDownload" class="item" @click.stop="_clickDownload(item.id, item.audioId, item.title)">
      <span class="top-icon"><i class="icon-download"></i></span>
      <span class="bottom-text">下载</span>
    </div>
    <div v-if="renderVideo" class="item" @click.stop="_clickVideo(item)">
      <span class="top-icon"><i class="icon-video"></i></span>
      <span class="bottom-text">看视频</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getDocument, getMeetingPlayback, registerMediaPlayerErrorCodeCallBack } from 'common/js/httpRequests'
  import { mapGetters, mapMutations } from 'vuex'
  import { HOST, VOD_ADDR, playMediaType } from 'api/config.js'
  import { pdfReader, stopMedia, openWebView, addDownloadItem, playMedia, registerMediaPlayerErrorCode } from 'api/native'
  import ERR_CODE from 'api/errorCode'
  import { getLatestPlayArray, addToLatestPlay } from 'common/js/utils'
  import { Toast, MessageBox } from 'mint-ui'

  const WEB_VIDEO_TYPE = 'WEBVIDEO'

  export default {
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    computed: {
      renderOperation() {
        return (this.item.pdfId !== 0) || (this.item.audioId !== 0) || (this.item.broadcastType === WEB_VIDEO_TYPE)
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
        return this.item.broadcastType === WEB_VIDEO_TYPE
      },
      ...mapGetters({
        serverInfo: 'serverInfo',
        userCrmId: 'userCrmId '
      })
    },
    methods: {
      _clickRecord(item) {
        console.log('click on record...')
        let self = this
        getDocument(item.audioId, 'AUDIO', item.id).then(res => {
          const audioUrl = res.trim()
          const detailPageUrl = ''
          console.log(audioUrl)
          if (audioUrl) {
            playMedia(item.title, audioUrl, self.serverInfo + detailPageUrl, playMediaType.float)
            //播放错误回调
            registerMediaPlayerErrorCode(registerMediaPlayerErrorCodeCallBack.name)
            self.setCurrentPlay(item)
            //添加到最近播放
            let latestPlayArray = getLatestPlayArray(self.userCrmId)
            latestPlayArray = addToLatestPlay(latestPlayArray, item, self.userCrmId)
            self.setLatestPlay(latestPlayArray)
            self.setLatestPlayNum({type: 'latestPlay', num: getLatestPlayArray().length})
          }
        }).catch(e => {
          this._errorHandler(e)
        })
      },
      _clickShortHand(id, pdfId, title) {
        console.log('click on short hand...')
        let self = this
        getDocument(pdfId, 'SHORTHAND', null).then(res => {
          if (res) {
            let url = self.serverInfo + HOST + res.trim()
            pdfReader(title, url)
          }
        }).catch(e => {
          self._errorHandler(e)
        })
      },
      _clickDownload(id, audioId, title) {
        console.log('click on download...')
        let self = this
        getDocument(audioId, 'AUDIO', id).then(res => {
          const audioUrl = res.trim()
          const detailPageUrl = ''
          console.log(audioUrl)
          if (audioUrl) {
            addDownloadItem(title, audioUrl, self.serverInfo + detailPageUrl)
          }
        }).catch(e => {
          self._errorHandler(e)
        })
      },
      _clickVideo(item) {
        console.log('click on video...')
        let self = this
        getMeetingPlayback(item.id).then(res => {
          let videoUrl = res
          console.log(videoUrl)
          if (videoUrl) {
            stopMedia()
            //通过WebView在APP打开网页页面
            let url = VOD_ADDR + videoUrl.trim()
            openWebView(true, item.title, url, true)
            //添加到最近播放
            let latestPlayArray = getLatestPlayArray(self.userCrmId)
            latestPlayArray = addToLatestPlay(latestPlayArray, item, self.userCrmId)
            self.setLatestPlay(latestPlayArray)
            self.setLatestPlayNum({type: 'latestPlay', num: getLatestPlayArray().length})
          } else {
            Toast({
              message: '回播码错误，请联系运营人员!',
              position: 'bottom',
              duration: 800
            })
          }
        }).catch(e => {
          self._errorHandler(e)
        })
      },
      _errorHandler(e) {
        console.log(e.response)
        let response = e.response.data ? e.response.data : false
        if (response && response.errorMsg) {
          if (response.errorCode === ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.CODE) {
            MessageBox.alert(ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.MSG)
          } else if (response.errorCode === ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.CODE) {
            MessageBox.alert(ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.MSG)
          }
        } else {
          Toast({
            message: ERR_CODE.SERVER_ERROR.MSG,
            position: 'bottom',
            duration: 800
          })
        }
      },
      ...mapMutations({
        setLatestPlay: 'SET_LATESTPLAY_MEETING_LIST',
        setLatestPlayNum: 'SET_PERSONAL_CENTER_COUNT',
        setCurrentPlay: 'SET_CURRENT_PLAY_MEETING'
      })
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';

  $operation-height: 45px;
  $bottom-text-color: #999;
  .operation {
    height: $operation-height;
    margin-left: 70px;
    display: flex;
    flex-direction: row-reverse;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      max-width: 90px;
      .top-icon {
        flex: 1;
        color: $color-theme;
        text-align: center;
        .icon-download, .icon-video, .icon-jianting, .icon-doc {
          font-size: 20px;
        }
      }
      .bottom-text {
        flex: 1;
        color: $bottom-text-color;
        text-align: center;
        font-size: $font-size-medium;
      }
    }
  }
</style>

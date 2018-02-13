// 取消收藏
import api from '../../api/fetchData'
import {bookMarkMeeting, isCrmRestrictedForMeeting, getRecordUrl, getDocumentUrl, HOST, addUserLogOfPlayFailed, getMeetingPlaybackUrl} from '../../api/config'
import {BOOK_MARK_MY_COLLOCTION, SET_CURRENT_PLAY_MEETINGID, SET_PERSONAL_CENTER_COUNT} from '../../store/mutation-types'
import ERR_CODE from '../../api/errorCode'
import store from '../../store'
import {Toast} from 'mint-ui'
import { addDownloadItem, pdfReader, playMedia, registerMediaPlayerErrorCode, stopMedia, openWebView } from '../../api/native'
import { getLatestPlayArray, addToLatestPlay } from './utils'

const playMediaType = {
  float: 1, //悬浮
  history: 2, //历史会议播放
  live: 3 //直播会议
}
// 原生播放器错误类型
const mediaPlayErrorCallback = {
  'Android': {
    'MEDIA_ERROR_UNKNOWN': 1,
    'MEDIA_ERROR_SERVER_DIED': 100,
    'MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK': 200,
    'MEDIA_ERROR_IO': -1004,
    'MEDIA_ERROR_MALFORMED': -1007,
    'MEDIA_ERROR_UNSUPPORTED': -1010,
    'MEDIA_ERROR_TIMED_OUT': -110,
    'MEDIA_ERROR_FILE_NOUPDATE': 101,
    'MEDIA_ERROR_PLAY_ABNORMAL': 102,
    'MEDIA_ERROR_NETWORK_UNREACHABLE': 103,
    'MEDIA_ERROR_FILE_ERROR': 104
  },
  'iOS': {
    'MEDIA_ERROR_NETWORK_UNREACHABLE': 1,
    'MEDIA_ERROR_FILE_NOTEXIST': 2,
    'MEDIA_ERROR_DOWNLOAD_HTML_FAIL': 3,
    'MEDIA_ERROR_PARSEHTML_FAIL': 4,
    'MEDIA_ERROR_CodeMediaServicesFailed': 1836282486,
    'MEDIA_ERROR_CodeIsBusy': 560030580,
    'MEDIA_ERROR_CodeIncompatibleCategory': 560161140,
    'MEDIA_ERROR_CodeCannotInterruptOthers': 560557684,
    'MEDIA_ERROR_CodeMissingEntitlement': 1701737535,
    'MEDIA_ERROR_CodeSiriIsRecording': 1936290409,
    'MEDIA_ERROR_CodeCannotStartPlaying': 561015905,
    'MEDIA_ERROR_CodeCannotStartRecording': 561145187,
    'MEDIA_ERROR_CodeBadParam': -50,
    'MEDIA_ERROR_InsufficientPriority': 561017449,
    'MEDIA_ERROR_CodeResourceNotAvailable': 561145203,
    'MEDIA_ERROR_CodeUnspecified': 2003329396
  }
}

// 视频点播地址
const VOD_ADDR = 'http://wind.gensee.com/webcast/site/vod/play-'

export const bookmarkMeeting = (meetingId, bookmarked) => {
  let url = bookMarkMeeting
  let params = {
    meetingId: meetingId,
    bookmarked: bookmarked
  }
  return api.getData(url, 'get', {params: params})
    .then((res) => {
      if (res < 1) {
        Toast('操作失败！')
        return
      }
      if (bookmarked) {
        Toast({
          message: '取消收藏成功！',
          position: 'bottom',
          duration: 800
        })
        store.commit(BOOK_MARK_MY_COLLOCTION, meetingId)
      }
      // TODO mutation state
    }).catch((e) => {
      console.log(e)
    })
}

//行业鉴权
export const detailAuthentication = (id, isRestricted, self) => {
  if (isRestricted === 'restricted') {
    let url = isCrmRestrictedForMeeting
    let params = {
      meetingId: id
    }
    return api.getData(url, 'get', {params: params})
      .then((res) => {
        if (res === 'INDUSTRY_RESTRICTED') {
          self.$messagebox.alert(ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.MSG)
        } else if (res === 'WHITE_LIST_RESTRICTED') {
          self.$messagebox.alert(ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.MSG)
        } else if (res === 'NON_RESTRICTED') {
          self.$router.push({name: 'meetingDetail', params: {meetingId: id}})
        }
        // TODO mutation state
      }).catch((e) => {
        console.log(e)
      })
  } else {
    self.$router.push({name: 'meetingDetail', params: {meetingId: id}})
  }
}

//下载录音，调用原生
export const getAudioUrl = (id, audioId, title, isDownLoad, self, item) => {
  const url = getRecordUrl
  let params = {
    meetingId: id,
    audioId: audioId
  }
  return api.getData(url, 'get', { params: params, responseType: 'text' })
    .then((res) => {
      const audioUrl = res.trim()
      //TODO
      const detailPageUrl = ''
      console.log(audioUrl)
      // TODO
      if (audioUrl) {
        if (isDownLoad) {
          addDownloadItem(title, audioUrl, self.$store.getters.serverInfo + detailPageUrl)
        } else {
          playMedia(title, audioUrl, self.$store.getters.serverInfo + detailPageUrl, playMediaType.float)
          //播放错误回调
          registerMediaPlayerErrorCode(registerMediaPlayerErrorCodeCallBack.name)
          store.commit(SET_CURRENT_PLAY_MEETINGID, id)
          //添加到最近播放
          let latestPlayArray = getLatestPlayArray()
          addToLatestPlay(latestPlayArray, item)
          store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'latestPlay', num: getLatestPlayArray().length + 1})
        }
      }
    })
    .catch((e) => {
      console.log(e.response)
      let response = e.response.data ? e.response.data : false
      if (response && response.errorMsg) {
        if (response.errorCode === ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.CODE) {
          self.$messagebox.alert(ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.MSG)
        } else if (response.errorCode === ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.CODE) {
          self.$messagebox.alert(ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.MSG)
        }
      } else {
        Toast({
          message: ERR_CODE.SERVER_ERROR.MSG,
          position: 'bottom',
          duration: 800
        })
      }
    })
}

// 直播错误回调
export const registerMediaPlayerErrorCodeCallBack = (content) => {
  console.log('errorCodeCallBack content =' + content)
  let errorCodeCallBack = JSON.parse(content)
  for (let deviceType in mediaPlayErrorCallback) {
    if (deviceType === errorCodeCallBack.deviceType) {
      for (let errorCode in mediaPlayErrorCallback[deviceType]) {
        if (mediaPlayErrorCallback[deviceType][errorCode] === errorCodeCallBack.errorCode) {
          errorCodeCallBack.errorCode = errorCode
        }
      }
    }
  }
  let meetingId = store.getters.currentPlayMeetingId
  let errorCode = errorCodeCallBack.errorCode
  addMediaPlayErrorToLog(meetingId, errorCode)
}

// 播放错误回调UserLog
export const addMediaPlayErrorToLog = (meetingId, errorCode) => {
  let log = {
    meetingId: meetingId,
    actionCode: 'PLAY_MEDIA_ERROR',
    actionContent: errorCode,
    actionTime: new Date().format('yyyy-MM-dd HH:mm'),
    actionDevice: navigator.userAgent || ''
  }
  let url = addUserLogOfPlayFailed
  return api.getData(url, 'post', JSON.stringify(log))
    .then((res) => {
      // TODO mutation state
      console.log(res)
    }).catch((e) => {
      console.log(e)
    })
}

//pdf
export const getDocument = (id, pdfId, title, self) => {
  const url = getDocumentUrl
  let params = {
    documentId: pdfId,
    documentType: 'SHORTHAND'
  }
  return api.getData(url, 'get', { params: params, responseType: 'text' })
    .then((res) => {
      const documentUrl = res
      console.log(documentUrl)
      // TODO
      if (documentUrl) {
        let url = self.$store.getters.serverInfo + HOST + documentUrl.trim()
        pdfReader(title, url)
      }
    })
    .catch((e) => {
      console.log(e.response)
      let response = e.response.data ? e.response.data : false
      if (response && response.errorMsg) {
        if (response.errorCode === ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.CODE) {
          self.$messagebox.alert(ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.MSG)
        } else if (response.errorCode === ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.CODE) {
          self.$messagebox.alert(ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.MSG)
        }
      } else {
        Toast({
          message: ERR_CODE.SERVER_ERROR.MSG,
          position: 'bottom',
          duration: 800
        })
      }
    })
}

//获取视频回放
export const getMeetingPlayback = (item, self) => {
  const url = getMeetingPlaybackUrl
  let params = {
    meetingId: item.id
  }
  return api.getData(url, 'get', { params: params })
    .then((res) => {
      const videoUrl = res
      console.log(videoUrl)
      if (videoUrl) {
        stopMedia()
        // TODO url拼接
        //通过WebView在APP打开网页页面
        let url = VOD_ADDR + videoUrl.trim()
        openWebView(true, item.title, url, true)
        //添加到最近播放
        let latestPlayArray = getLatestPlayArray()
        addToLatestPlay(latestPlayArray, item)
        store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'latestPlay', num: getLatestPlayArray().length + 1})
      } else {
        Toast({
          message: '回播码错误，请联系运营人员!',
          position: 'bottom',
          duration: 800
        })
      }
    })
    .catch((e) => {
      console.log(e.response)
      let response = e.response.data ? e.response.data : false
      if (response && response.errorMsg) {
        if (response.errorCode === ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.CODE) {
          self.$messagebox.alert(ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.MSG)
        } else if (response.errorCode === ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.CODE) {
          self.$messagebox.alert(ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.MSG)
        }
      } else {
        Toast({
          message: ERR_CODE.SERVER_ERROR.MSG,
          position: 'bottom',
          duration: 800
        })
      }
    })
}

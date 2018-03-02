// 取消收藏
import api from '../../api/fetchData'
import {bookMarkMeeting, isCrmRestrictedForMeeting, getRecordUrl, getDocumentUrl, HOST, addUserLogOfPlayFailed, getMeetingPlaybackUrl} from '../../api/config'
import {BOOK_MARK_MY_COLLOCTION, SET_CURRENT_PLAY_MEETING, SET_PERSONAL_CENTER_COUNT, SET_RESTRICTED_MEETING_LIST} from '../../store/mutation-types'
import ERR_CODE from '../../api/errorCode'
import store from '../../store'
import {Toast, MessageBox} from 'mint-ui'
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
  },
  'instruction': {
    'MEDIA_ERROR_UNKNOWN': '未知播放错误',
      'MEDIA_ERROR_SERVER_DIED': '媒体服务器未响应',
      'MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK': '播放器不支持该音频流连续播放',
      'MEDIA_ERROR_IO': '音频流文件错误',
      'MEDIA_ERROR_MALFORMED': '音频流不符合相关的编码标准或文件规范',
      'MEDIA_ERROR_UNSUPPORTED': '播放器不支持该音频流的相关编码标准或规范',
      'MEDIA_ERROR_TIMED_OUT': '播放器长时间未响应',
      'MEDIA_ERROR_FILE_NOUPDATE': '播放器超过8秒未读取到数据',
      'MEDIA_ERROR_PLAY_ABNORMAL': '播放器未知异常',
      'MEDIA_ERROR_NETWORK_UNREACHABLE': '移动设备网络不可用',
      'MEDIA_ERROR_FILE_ERROR': '播放器读取音频文件错误或文件已经损坏',
      'MEDIA_ERROR_FILE_NOTEXIST': '对应的音频文件URL地址为空',
      'MEDIA_ERROR_DOWNLOAD_HTML_FAIL': '下载音频文件出现错误',
      'MEDIA_ERROR_PARSEHTML_FAIL': '解析音频下载地址的HTML失败',
      'MEDIA_ERROR_CodeMediaServicesFailed': '媒体服务器未响应',
      'MEDIA_ERROR_CodeIsBusy': '媒体服务器忙',
      'MEDIA_ERROR_CodeIncompatibleCategory': '播放器不支持该音频流的相关编码标准或规范',
      'MEDIA_ERROR_CodeCannotInterruptOthers': '已经存在其他播放器正在播放,不能覆盖其他播放器',
      'MEDIA_ERROR_CodeMissingEntitlement': '播放器缺少授权，未能启动',
      'MEDIA_ERROR_CodeSiriIsRecording': 'siri正在录音，不能启动播放器',
      'MEDIA_ERROR_CodeCannotStartPlaying': '播放器不能开始播放',
      'MEDIA_ERROR_CodeCannotStartRecording': '播放器不能开始录音',
      'MEDIA_ERROR_CodeBadParam': '音频文件编码错误',
      'MEDIA_ERROR_InsufficientPriority': '播放器优先级不足',
      'MEDIA_ERROR_CodeResourceNotAvailable': '对应的音频文件URL地址为空',
      'MEDIA_ERROR_CodeUnspecified': '未指明的音频文件'
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
    let restrictedMeetingList = store.getters.restrictedMeetingList
    let isExist = false
    for (let meeting of restrictedMeetingList) {
      if (meeting.meetingId === id) {
        if (meeting.restrictedMsg === 'NON_RESTRICTED') {
          isExist = true
          self.$router.push({name: 'meetingDetail', params: {meetingId: id}})
          break
        } else {
          MessageBox.alert(meeting.restrictedMsg)
          isExist = true
          break
        }
      }
    }
    if (!isExist) {
      let restrictedMeeting = {}
      restrictedMeeting.meetingId = id
      let url = isCrmRestrictedForMeeting
      let params = {
        meetingId: id
      }
      return api.getData(url, 'get', {params: params})
        .then((res) => {
          restrictedMeeting.restrictedMsg = res
          store.commit(SET_RESTRICTED_MEETING_LIST, restrictedMeeting)
          if (res === 'INDUSTRY_RESTRICTED') {
            MessageBox.alert(ERR_CODE.SIGNUP_INDUSTRY_RESTRICTED.MSG)
          } else if (res === 'WHITE_LIST_RESTRICTED') {
            MessageBox.alert(ERR_CODE.SIGNUP_WHITE_LIST_RESTRICTED.MSG)
          } else if (res === 'NON_RESTRICTED') {
            self.$router.push({name: 'meetingDetail', params: {meetingId: id}})
          }
          // TODO mutation state
        }).catch((e) => {
          console.log(e)
        })
    }
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
          store.commit(SET_CURRENT_PLAY_MEETING, item)
          //添加到最近播放
          let latestPlayArray = getLatestPlayArray()
          addToLatestPlay(latestPlayArray, item)
          store.commit(SET_PERSONAL_CENTER_COUNT, {type: 'latestPlay', num: getLatestPlayArray().length})
        }
      }
    })
    .catch((e) => {
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
    })
}

// 直播错误回调
export const registerMediaPlayerErrorCodeCallBack = (content) => {
  console.log('errorCodeCallBack content =' + content)
  let errorCodeCallBack = JSON.parse(content)
  let playErrContent = {}
  for (let deviceType in mediaPlayErrorCallback) {
    if (deviceType === errorCodeCallBack.deviceType) {
      for (let errorCode in mediaPlayErrorCallback[deviceType]) {
        if (mediaPlayErrorCallback[deviceType][errorCode] === errorCodeCallBack.errorCode) {
          playErrContent.userErrorMessage = errorCode
          playErrContent.userErrorInstruction = mediaPlayErrorCallback.instruction[errorCode]
          break
        } else {
          playErrContent.userErrorMessage = 'MEDIA_ERROR_UNKNOWN'
          playErrContent.userErrorInstruction = mediaPlayErrorCallback.instruction.MEDIA_ERROR_UNKNOWN
        }
      }
    }
  }
  let currentPlayMeeting = store.getters.currentPlayMeeting
  playErrContent.meetingId = currentPlayMeeting.id
  playErrContent.userErrorType = currentPlayMeeting.meetingStatus === 'STARTED' ? 'PLAY_LIVE_AUDIO' : 'PLAY_HISTORY_AUDIO'
  playErrContent.userDeviceType = errorCodeCallBack.deviceType === 'iOS' ? 'IOS' : 'ANDROID'
  playErrContent.userErrorCode = errorCodeCallBack.errorCode
  addMediaPlayErrorToLog(playErrContent)
}

// 播放错误回调UserLog
export const addMediaPlayErrorToLog = (playErrContent) => {
  let log = {
    meetingId: playErrContent.meetingId,
    userDeviceType: playErrContent.userDeviceType,
    userDeviceInfo: navigator.userAgent || '',
    userErrorType: playErrContent.userErrorType,
    userErrorCode: playErrContent.userErrorCode,
    userErrorMessage: playErrContent.userErrorMessage,
    userErrorInstruction: playErrContent.userErrorInstruction
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
    })
}

//获取视频回放
export const getMeetingPlayback = (item) => {
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
    })
}

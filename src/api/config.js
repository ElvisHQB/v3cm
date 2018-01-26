// TODO 需要从原生获取sessionid,然后存入vuex
const sessionid = ''
const debug = process.env.NODE_ENV !== 'production'
export const HOST = debug ? '//114.80.154.45/3CWeb' : '/3CWeb'
export const sid = debug ? '7bda8871df214805b5f9b20e99a0d9c6' : sessionid
export const defaultLogo = '/assets/logo.png'
export const defaultType = 'PHONEWEB'
export const defaultTime = '时间待定'
export const defaultLecture = '主讲人待定'
export const defaultSponsor = '主办方待定'
//登录
export const loginUrl = HOST + '/login.json'
//最新会议
export const getLatestMeetingUrl = HOST + '/getLatestMeeting.json'
//历史会议
export const getHistoryMeetingUrl = HOST + '/getHistoryMeeting.json'
//会议资讯
export const getOfflineMeetingListUrl = HOST + '/getOfflineMeetingList.json'
//个人中心 身份信息
export const getUserInfoUrl = HOST + '/getUserInfo.json'
//头像
export const getUserHeadPortraitByCRMIdUrl = HOST + '/getUserHeadPortraitByCRMId.json'
//个人中心 公开会议
export const getMyMeetingListUrl = HOST + '/getMyMeetingList.json'
//个人中心 私人会议
export const getMyPrivateMeetingUrl = HOST + '/getMyPrivateMeeting.json'
//个人中心 我的收藏
export const getBookMarkedMeetingListUrl = HOST + '/getBookMarkedMeetingList.json'
//创建会议
export const createNewMeetingUrl = HOST + '/createNewMeeting.json'
//搜索会议
export const searchMeetingUrl = HOST + '/searchMeeting.json'
//会议详情
export const getMeetingDetailUrl = HOST + '/getMeetingDetail.json'
//评论
export const getMeetingCommentsDetailUrl = HOST + '/getMeetingCommentsDetail.json'

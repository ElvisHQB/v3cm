import Mock from 'mockjs'

import Login from './login'
import NewestMeeting from './newestMeetingData'
import HistoryMeetingData from './historyMeetingData'
import MeetingInfoData from './meetingInfoData'
import UserImg from './userImg'
import Search from './search'
import MeetingDetail from './meetingDetail'
import Comments from './meetingComments'
import PersonalData from './personalCenter'
// 设置响应时间
Mock.setup({ timeout: '500-2000' })

Mock.mock(/login.json/, 'get', Login)
Mock.mock(/getLatestMeeting.json/, 'post', NewestMeeting)
Mock.mock(/getHistoryMeeting.json/, 'post', HistoryMeetingData)
Mock.mock(/getOfflineMeetingList.json/, 'post', MeetingInfoData)
Mock.mock(/getUserHeadPortraitByCRMId.json/, 'get', UserImg)
Mock.mock(/getUserInfo.json/, 'get', PersonalData.userInfoData)
Mock.mock(/getMyMeetingList.json/, 'get', PersonalData.getMyMeetingListData)
Mock.mock(/getMyPrivateMeeting.json/, 'get', PersonalData.priviteMeetingData)
Mock.mock(/getBookMarkedMeetingList.json/, 'get', PersonalData.bookMarkedMeetingData)
Mock.mock(/searchMeeting.json/, 'get', Search)
Mock.mock(/getMeetingDetail.json/, 'get', MeetingDetail)
Mock.mock(/getMeetingCommentsDetail.json/, 'get', Comments)

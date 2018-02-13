import Vue from 'vue'
import Router from 'vue-router'
import NewestMeeting from 'components/newestMeeting/newestMeeting'
import HistoryMeeting from 'components/historyMeeting/historyMeeting'
import MeetingInfo from 'components/meetingInfo/meetingInfo'
import PersonalCenter from 'components/personalCenter/personalCenter'
import Search from 'components/search/search'
import CreateMeeting from 'components/createMeeting/createMeeting'
import PublishedMeeting from 'components/personalCenter/publishedMeeting/publishedMeeting'
import PrivateMeeting from 'components/personalCenter/privateMeeting/privateMeeting'
import MyCollection from 'components/personalCenter/myCollection/myCollection'
import LatestPlay from 'components/personalCenter/latestPlay/latestPlay'
import MeetingDetail from 'components/meetingDetail/meetingDetail'
import SelectAttendance from 'components/selectAttendance/selectAttendance'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/newestMeeting'
    },
    {
      path: '/newestMeeting',
      component: NewestMeeting
    },
    {
      path: '/historyMeeting',
      component: HistoryMeeting
    },
    {
      path: '/meetingDetail/:meetingId',
      name: 'meetingDetail',
      component: MeetingDetail
    },
    {
      path: '/meetingInfo',
      component: MeetingInfo
    },
    {
      path: '/personalCenter',
      component: PersonalCenter
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/createMeeting',
      component: CreateMeeting
    },
    {
      path: '/selectAttendance',
      component: SelectAttendance
    },
    {
      path: '/personalCenter/publishedMeeting',
      component: PublishedMeeting
    },
    {
      path: '/personalCenter/privateMeeting',
      component: PrivateMeeting
    },
    {
      path: '/personalCenter/myCollection',
      component: MyCollection
    },
    {
      path: '/personalCenter/latestPlay',
      component: LatestPlay
    }
  ]
})

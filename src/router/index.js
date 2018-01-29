import Vue from 'vue'
import Router from 'vue-router'
import NewestMeeting from 'components/newestMeeting/newestMeeting'
import HistoryMeeting from 'components/historyMeeting/historyMeeting'
import MeetingInfo from 'components/meetingInfo/meetingInfo'
import PersonalCenter from 'components/personalCenter/personalCenter'
import Search from 'components/search/search'
import CreateMeeting from 'components/createMeeting/createMeeting'
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
      path: '/meetingInfo',
      component: MeetingInfo
    },
    {
      path: '/personalCenter',
      component: PersonalCenter
      // children: [
      //   {
      //     path: ':id',
      //     component: other
      //   }
      // ]
    },
    {
      path: '/selectAttendance',
      component: SelectAttendance
    },
    {
      path: '/search',
      component: Search
    },
    {
      path: '/createMeeting',
      component: CreateMeeting
    }
  ]
})

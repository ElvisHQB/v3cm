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
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/newestMeeting'
    },
    {
      path: '/newestMeeting',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: NewestMeeting
    },
    {
      path: '/historyMeeting',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: HistoryMeeting
    },
    {
      path: '/meetingDetail/:meetingId',
      name: 'meetingDetail',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: MeetingDetail
    },
    {
      path: '/meetingInfo',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: MeetingInfo
    },
    {
      path: '/personalCenter',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: PersonalCenter
    },
    {
      path: '/search',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: Search
    },
    {
      path: '/createMeeting',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: CreateMeeting
    },
    {
      path: '/selectAttendance',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: SelectAttendance
    },
    {
      path: '/personalCenter/publishedMeeting',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: PublishedMeeting
    },
    {
      path: '/personalCenter/privateMeeting',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: PrivateMeeting
    },
    {
      path: '/personalCenter/myCollection',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: MyCollection
    },
    {
      path: '/personalCenter/latestPlay',
      meta: {
        requireAuth: true // 添加该字段，表示进入这个路由是需要登录的
      },
      component: LatestPlay
    }
  ]
})

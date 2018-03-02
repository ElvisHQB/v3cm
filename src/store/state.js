export default {
  userLoginStatus: '',
  sessionid: '',
  serverInfo: '',
  userInfo: {},
  userImage: [],
  currentPage: 'newestMeeting',
  meetingInfo: {},
  partnersInfo: {},
  //最新会议列表
  newestMeetingList: [],
  //搜索会议结果
  searchMeetingList: [],
  //搜索会议搜索字符串
  searchStr: '',
  //搜索会议对象
  // searchMeeting: {}
  //我的收藏会议列表
  myCollectionMeetingList: [],
  //历史会议列表
  historyMeetingList: [],
  //历史会议列表
  publishedMeetingList: [],
  //历史会议列表
  latestPlayMeetingList: [],
  //详情页更多
  moreDetailPopup: false,
  //详情页meetingId
  meetingId: 0,
  //会议详情页对象
  meetingDetail: {},
  //会议评论列表
  commentList: [],
  //所选参会人
  attendanceList: [],
  //iWand联系人列表
  iWandContactList: [],
  //手机联系人列表
  phoneContactList: [],
  //会议资讯列表
  meetingInfoList: [],
  //私人会议列表
  privateMeetingList: [],
  //正在播放会议的Id
  currentPlayMeeting: '',
  //个人中心数目
  personalCenterNum: {
    publishedMeetingCount: 0,
    privateMeetingCount: 0,
    myCollectionCount: 0,
    latestPlayCount: 0,
    downloadCount: 0
  },
  //限制会议
  restrictedMeetingList: []
}

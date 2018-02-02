import {
  defaultLogo,
  defaultTime,
  defaultType,
  defaultLecture,
  defaultSponsor,
  defaultTitle,
  HOST,
  defaultCity
} from '../../api/config'
// 会议对象创建
export const genMeetingListItem = item => {
  let listItem = {}
  // 会议Id
  listItem.id = item.id
  // 会议Logo
  if (!item.logoUrl) {
    listItem.imgUrl = defaultLogo
  } else {
    listItem.imgUrl = HOST + '/' + item.logoUrl
    // TODO
  }
  // 会议标题
  if (!item.title) {
    listItem.title = defaultTitle
  } else {
    listItem.title = item.title
  }
  // 会议广播类型：电话、音频、视频
  if (!item.broadcastType) {
    listItem.broadcastType = defaultType
  } else {
    listItem.broadcastType = item.broadcastType
  }
  // 会议时间
  listItem.meetingTime = genMeetingTime(item.startTime, item.endTime)

  // 会议主讲人
  if (item.lecturers.length < 1 || !item.lecturers[0].name) {
    listItem.lecturer = defaultLecture
  } else {
    listItem.lecturer = item.lecturers[0].name + (item.lecturers[0].title ? '(' + item.lecturers[0].title + ')' : '')
  }
  // 会议主办方
  if (item.sponsors.length < 1 || !item.sponsors[0].name) {
    listItem.sponsor = defaultSponsor
  } else {
    listItem.sponsor = item.sponsors[0].name
  }
  // 推荐会议
  listItem.recommend = item.recommend
  // 会议资料
  listItem.pdfId = item.pdfId
  listItem.audioId = item.audioId
  // 会议状态
  listItem.meetingStatus = item.meetingStatus
  // 已报名
  listItem.signupStatus = item.signupStatus
  // 是否限制会议
  if (item.isRestricted) {
    listItem.isRestricted = 'restricted'
  } else {
    listItem.isRestricted = 'notRestricted'
  }
  return listItem
}

// 会议资讯对象
export const genMeetingInfoListItem = item => {
  let listItem = {}
  // 会议资讯 标题
  if (!item.title) {
    listItem.title = defaultTitle
  } else {
    listItem.title = item.title
  }
  // 会议资讯 城市
  if (!item.city) {
    listItem.city = defaultCity
  } else {
    listItem.city = item.city
  }
  // 会议资讯 日期
  if (!item.date) {
    listItem.date = defaultTime
  } else {
    listItem.date = item.date
  }
  // 会议资讯 主办方
  if (!item.sponsor) {
    listItem.infoSponsor = defaultSponsor
  } else {
    listItem.infoSponsor = item.sponsor
  }
  // 会议资讯 链接url
  listItem.url = item.url
  return listItem
}

// 私人会议对象
export const genPrivateMeetingList = (item) => {
  let listItem = {}
  // 会议ID
  listItem.id = item.id
  // 会议室密码
  if (!item.meetingCode) {
    listItem.meetingCode = '会议室密码待定'
  } else {
    listItem.meetingCode = item.meetingCode
  }
// 会议标题
  if (!item.title) {
    listItem.title = defaultTitle
  } else {
    listItem.title = item.title
  }
// 会议创建人
  if (!item.createName) {
    listItem.createName = 'null'
  } else {
    listItem.createName = item.createName
  }
// 会议时间
  if (!item.startTime) {
    listItem.startTime = defaultTime
  } else {
    let startDate = new Date(item.startTime)
    let meetingYeay = startDate.getYear()
    let thisYear = new Date().getYear()
    if (meetingYeay === thisYear) {
      listItem.startTime = startDate.format('MM-dd EE HH:mm')
      let meetingStartDay = startDate.format('yyyyMMdd')
      let todayStr = new Date().format('yyyyMMdd')
      let dayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      let todayWeekDay = '今天'
      if (meetingStartDay === todayStr) {
        listItem.startTime = listItem.startTime.replace(dayArr[startDate.getDay()], todayWeekDay)
      }
    } else {
      listItem.startTime = startDate.format('yyyy-MM-dd HH:mm')
    }

    if (item.endTime) {
      var endDate = new Date(item.endTime)
      listItem.startTime += '-' + endDate.format('HH:mm')
    }
  }
// 会议室编号
  if (!JSON.parse(item.meetingRoom).roomNo) {
    listItem.roomNo = 'null'
  } else {
    listItem.roomNo = JSON.parse(item.meetingRoom).roomNo
  }
  return listItem
}

//会议时间过滤
export const genMeetingTime = (startTime, endTime) => {
  let meetingTime = null
  if (!startTime) {
    meetingTime = defaultTime
  } else {
    let startDate = new Date(startTime)
    meetingTime = startDate.format('yyyy-MM-dd EE HH:mm')
    let meetingStartDay = startDate.format('yyyyMMdd')
    let todayStr = new Date().format('yyyyMMdd')
    let dayArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let todayWeekDay = '今天'
    if (meetingStartDay === todayStr) {
      meetingTime = meetingTime.replace(dayArr[startDate.getDay()], todayWeekDay)
    }
    if (endTime) {
      let endDate = new Date(endTime)
      meetingTime += '-' + endDate.format('HH:mm')
    }
  }
  return meetingTime
}

Date.prototype.format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, //小时
    'H+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds() //毫秒
  }
  let week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[this.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

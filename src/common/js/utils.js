import { defaultLogo, defaultTime, defaultType, defaultLecture, defaultSponsor } from '../../api/config'
// 会议对象创建
genMeetingListItem = (item)=> {
  let listItem = new Object()
  // 会议Id
  listItem.id = item.id
  // 会议Logo
  if (!item.logoUrl) {
    listItem.imgUrl = defaultLogo
  } else {
    listItem.imgUrl = defaultLogo
    // TODO
  }
  // 会议广播类型：电话、音频、视频
  if(!item.broadcastType) {
    listItem.broadcastType = defaultType
  } else {
    listItem.broadcastType = item.broadcastType
  }
  // 会议时间
  if(!item.startTime) {
    listItem.startTime = defaultTime
  } else {
    let startDate = new MyDate(item.startTime)
    listItem.startTime = startDate.format('yyyy-MM-dd EE HH:mm')
    let meetingStartDay = startDate.format('yyyyMMdd')
    let todayStr = new MyDate().format('yyyyMMdd')
    let dayArr = new Array("周日", "周一", "周二", "周三", "周四", "周五", "周六")
    let todayWeekDay = '今天'
    if(meetingStartDay == todayStr) {
      listItem.startTime = listItem.startTime.replace(dayArr[startDate.getDay()],todayWeekDay)
    }
    if(item.endTime) {
      let endDate = new MyDate(item.endTime)
      listItem.startTime += '-' + endDate.format('HH:mm')
    }
  }
  // 会议主讲人
  if(item.lecturers.length < 1 || !item.lecturers[0].name) {
    listItem.lecturer = defaultLecture
  } else {
    listItem.lecturer = item.lecturers[0].name + (item.lecturers[0].title ? '(' + item.lecturers[0].title + ')' : '')
  }
  // 会议主办方
  if(item.sponsors.length < 1 || !item.sponsors[0].name) {
    listItem.sponsor = defaultSponsor
  } else {
    listItem.sponsor = item.sponsors[0].name
  }
  // 推荐会议
  listItem.recommend = item.recommend
  // 会议状态
  listItem.meetingStatus = item.item.meetingStatus
  // 已报名
  listItem.signupStatus = item.signupStatus
  // 是否限制会议
  if(item.isRestricted){
    listItem.isRestricted = 'restricted'
  } else {
    listItem.isRestricted = 'notrestricted'
  }
  return listItem
}

// 继承Date，添加format函数，处理时间样式
class MyDate extends Date {
  constructor(date) {
    super(date)
  }

  format(fmt) {
    let o = {
      'M+': this.getMonth() + 1, //月份
      'd+': this.getDate(), //日
      'h+': this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
      'H+': this.getHours(), //小时
      'm+': this.getMinutes(), //分
      's+': this.getSeconds(), //秒
      'q+': Math.floor((this.getMonth() + 3) / 3), //季度
      'S': this.getMilliseconds() //毫秒
    }
    var week = {
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
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt
  }
}

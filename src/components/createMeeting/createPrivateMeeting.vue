<template>
  <div class="private-meeting">
    <!--会议主题-->
    <div class="meeting-title">
      <span>主题</span>
      <span><input placeholder="请输入会议主题，不超过30字" v-model="meeting.title"></span>
      <span @click="meeting.title = ''"><i class="icon-clear" v-show="meeting.title"></i></span>
    </div>
    <!--参会人-->
    <div class="meeting-attendance" @click="_selectAttendance">
      <span>参会人</span>
      <span>{{ attendanceText }}</span>
      <span><i class="icon-add-o"></i></span>
    </div>
    <!--开始时间-->
    <div class="meeting-start-time" @click="_openStartPicker">
      <span>开始时间</span>
      <span>{{ startTime }}</span>
      <span><i class="icon-xiangyou"></i></span>
    </div>
    <!--结束时间-->
    <div class="meeting-end-time" @click="_openEndPicker">
      <span>结束时间</span>
      <span>{{ endTime }}</span>
      <span><i class="icon-xiangyou"></i></span>
    </div>
    <!--桌面共享-->
    <div class="meeting-desktop-share">
      <span>桌面共享</span>
      <span>(仅限12人)</span>
      <span @click="_showInstruction"><i class="icon-shuoming"></i></span>
      <span><mt-switch v-model="meeting.desktopShare"></mt-switch></span>
    </div>
    <!--会议简介-->
    <div class="meeting-description">
      <analog-textarea :maxCount="1000" :message="'会议简介最多1000字'" :placeholderText="'请输入会议简介，不超过1000字'"
                       :class="'meeting-textarea'" :clearContent="clearContent" @contentChange="_handleContentChange">
      </analog-textarea>
    </div>

    <datetime-picker @select="startTimeConfirm" :defaultTime="defaultStartTime" ref="startPicker"></datetime-picker>
    <datetime-picker @select="endTimeConfirm" :defaultTime="defaultEndTime" ref="endPicker"></datetime-picker>

    <div class="meeting-submit-btn" @click="_clickOnSubmit">
      <span>提交</span>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import AnalogTextarea from 'base/analogTextarea/analogTextarea'
  import api from 'api/fetchData'
  import DatetimePicker from 'base/datetimePicker/datetimePicker'
  import { MessageBox, Toast, Switch } from 'mint-ui'
  import { desktopSharePrompt } from 'api/prompt'
  import { CLEAR_ATTENDANCE_LIST } from '../../store/mutation-types'
  import { createPrivateMeetingUrl } from 'api/config'

  const MEETING_ADVANCE_MINUTES = 15 + 1
  const MEETING_ADVANCE_MILLISECOND = 15 * 60 * 1000
  const MEETING_TITLE_LENGTH = 30
  const COMPONENT_NAME = 'createPrivateMeeting'

  export default {
    name: COMPONENT_NAME,
    components: {
      AnalogTextarea,
      DatetimePicker,
      'mt-switch': Switch
    },
    data() {
      return {
        meeting: {
          title: '',
          user: [],
          startTime: '',
          endTime: '',
          desktopShare: true,
          description: ''
        },
        attendanceText: '请选择参会人',
        switchValue: true,
        clearContent: false
      }
    },
    created() {
      this.startTimeStamp = null
      this.endTimeStamp = null
    },
    computed: {
      attendanceList() {
        return this.$store.getters.attendanceList
      },
      startTime() {
        return this.meeting.startTime || '请选择会议开始时间'
      },
      endTime() {
        return this.meeting.endTime || '请选择会议结束时间'
      },
      defaultStartTime() {
        let date = new Date()
        date.setMinutes(date.getMinutes() + MEETING_ADVANCE_MINUTES)
        return date.getTime()
      },
      defaultEndTime() {
        let date = new Date()
        date.setHours(date.getHours() + 1)
        date.setMinutes(date.getMinutes() + MEETING_ADVANCE_MINUTES)
        return date.getTime()
      }
    },
    methods: {
      _openStartPicker() {
        this.$refs.startPicker.show()
      },
      _openEndPicker() {
        this.$refs.endPicker.show()
      },
      startTimeConfirm(value) {
        this.startTimeStamp = value
        this.meeting.startTime = new Date(value).format('yyyy-MM-dd HH:mm:ss')
      },
      endTimeConfirm(value) {
        this.endTimeStamp = value
        this.meeting.endTime = new Date(value).format('yyyy-MM-dd HH:mm:ss')
      },
      _handleContentChange(content) {
        this.meeting.description = content
      },
      _showInstruction() {
        MessageBox({
          title: '提示',
          message: desktopSharePrompt
        })
      },
      _selectAttendance() {
        this.$router.push({ path: '/selectAttendance' })
      },
      _clickOnSubmit() {
        const url = createPrivateMeetingUrl
        let msg = this._validateMeeting(this.meeting)
        if (msg) {
          Toast({
            message: msg,
            position: 'bottom',
            duration: 1500
          })
          return
        }
        api.getData(url, 'post', this.meeting)
          .then((res) => {
            Toast({
              message: '创建会议成功',
              position: 'bottom',
              duration: 1500
            })
            this.meeting.title = ''
            this.meeting.startTime = ''
            this.meeting.endTime = ''
            this.meeting.description = ''
            this.meeting.user = []
            this.meeting.desktopShare = true
            this.$store.commit(CLEAR_ATTENDANCE_LIST)
            this.$router.push({ path: '/newestMeeting' })
          })
          .catch((e) => {
            //TODO error handle
            console.log(e)
          })
      },
      _validateMeeting(meeting) {
        // TODO
        if (!meeting.startTime) {
          return '请选择会议开始时间'
        }
        if (!meeting.endTime) {
          return '请选择会议结束时间'
        }
        if (meeting.startTime && meeting.endTime) {
          if (this.startTimeStamp - new Date().getTime() < MEETING_ADVANCE_MILLISECOND) {
            return '发起公开会议需要至少提前15分钟'
          }
          if (this.startTimeStamp > this.endTimeStamp) {
            return '会议开始时间不能大于结束时间'
          }
        }
        if (!meeting.title) {
          return '请输入会议主题'
        }
        if (meeting.title && (meeting.title.length > MEETING_TITLE_LENGTH)) {
          return '会议主题不超过30字'
        }
        if (!meeting.description) {
          return '请输入会议简介'
        }
        return ''
      }
    },
    watch: {
      'meeting.title': function () {
        if (this.meeting.title.length > MEETING_TITLE_LENGTH) {
          Toast({
            message: '会议主题不超过30字',
            position: 'middle',
            duration: 1500
          })
        }
      },
      'meeting.description': function () {
        this.clearContent = this.meeting.description.length === 0
      }
    },
    activated() {
      //TODO
      let len = this.attendanceList.length
      if (len === 0) {
        this.attendanceText = '请选择参会人'
      } else {
        this.attendanceText = ''
        for (let u of this.attendanceList) {
          this.attendanceText += u.name + ','
        }
      }
      console.log('back to createMeeting...')
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';

  $main-color: #fff;
  $item-icon-color: #bbb;
  $item-right-color: #999;
  $theme-color: #dd2738;
  $meeting-item-height: 40px;
  $submit-btn-height: 38px;

  .private-meeting {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    @mixin ellipsis {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    @mixin meeting-item {
      display: flex;
      background-color: $main-color;
      line-height: $meeting-item-height;
      height: $meeting-item-height;
      span:nth-child(1) {
        flex: 4;
        padding: 11px 10px;
        line-height: 1.1;
        font-size: $font-size-medium-x;
        color: #000;
        text-indent: 10px;
      }
      span:nth-child(2) {
        flex: 6;
        @include ellipsis;
      }
      span:nth-child(3) {
        flex: 2;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $item-icon-color;
        .icon-xiangyou, .icon-clear, .icon-add-o {
          font-size: $icon-size-small;
        }
      }
    }
    .meeting-title {
      flex: 1;
      margin: 10px 0;
      @include meeting-item;
      input {
        outline: none;
        width: 100%;
        color: $item-right-color;
        @include ellipsis;
      }
    }
    .meeting-attendance {
      flex: 1;
      margin: 10px 0;
      @include meeting-item;
    }
    .meeting-start-time {
      flex: 1;
      display: flex;
      @include meeting-item;
    }
    .meeting-end-time {
      flex: 1;
      margin-top: 1px;
      @include meeting-item;
    }
    .meeting-desktop-share {
      margin-top: 16px;
      margin-bottom: 10px;
      line-height: 40px;
      font-size: $font-size-medium-x;
      display: flex;
      flex-direction: row;
      span:nth-child(1) {
        padding-left: 20px;
        color: #000;
      }
      span:nth-child(2) {
        color: $theme-color;
      }
      span:nth-child(3) {
        color: #bbb;
        padding-left: 5px;
        display: flex;
        align-items: center;
        .icon-shuoming {
          font-size: 20px;
        }
      }
      span:nth-child(4) {
        position: absolute;
        right: 15px;
        padding: 4px 0;
        .mint-switch {
          /deep/ .mint-switch-input:checked + .mint-switch-core {
            border-color: $theme-color;
            background-color: $theme-color;
          }
        }
      }
    }
    .meeting-description {
      flex: 1;
      background-color: $main-color;
      display: flex;
      .meeting-textarea {
        flex: 1;
        padding: 10px 15px 5px 15px;
        font-size: $font-size-medium;
        font-weight: 400;
        line-height: 21px;
        height: 200px;
        overflow: scroll;
      }
    }
    .meeting-submit-btn {
      width: 100%;
      position: fixed;
      bottom: 0;
      text-align: center;
      background-color: $theme-color;
      color: $main-color;
      font-size: $font-size-medium-x;
      height: $submit-btn-height;
      line-height: $submit-btn-height;
    }
  }
</style>

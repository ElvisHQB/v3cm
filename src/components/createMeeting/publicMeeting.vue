<template>
  <div class="public-meeting">
    <!--TODO 时间选择器，找更好的-->
    <!--开始时间-->
    <div class="public-start-time meeting-item-style" @click="_openStartPicker">
      <div class="list-left-div">
        <label>开始时间</label>
      </div>
      <div class="list-right-div">
        <span class="time-select">{{ startTime }}</span>
        <span class="icon-select"><i class="icon-xiangyou"></i></span>
      </div>
    </div>
    <!--结束时间-->
    <div class="public-end-time meeting-item-style" @click="_openEndPicker">
      <div class="list-left-div">
        <label>结束时间</label>
      </div>
      <div class="list-right-div">
        <span class="time-select">{{ endTime }}</span>
        <span class="icon-select"><i class="icon-xiangyou"></i></span>
      </div>
    </div>
    <!--会议主题-->
    <div class="public-meeting-title meeting-item-style">
      <div class="list-left-div">
        <label>会议主题</label>
      </div>
      <div class="list-right-div">
        <input placeholder="请输入会议主题，不超过30字" v-model="meeting.title">
        <span class="icon-select" @click="meeting.title = ''">
          <i class="icon-clear" v-show="meeting.title"></i>
        </span>
      </div>
    </div>
    <!--会议简介-->
    <div class="meeting-description">
      <analog-textarea :maxCount="1000" :message="'会议简介最多1000字'"
                       :placeholderText="'请输入会议简介，不超过1000字'"
                       :class="'public-meeting-textarea'"
                       :clearContent="clearContent"
                       @contentChange="_handleContentChange">
      </analog-textarea>
    </div>

    <mt-datetime-picker
      ref="startPicker" type="datetime"
      v-model="startPickerValue" @confirm="_handleStartConfirm">
    </mt-datetime-picker>
    <mt-datetime-picker
      ref="endPicker" type="datetime"
      v-model="endPickerValue" @confirm="_handleEndConfirm">
    </mt-datetime-picker>

    <div class="meeting-submit-btn" @click="_clickOnSubmit">
      <span>提交</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnalogTextarea from 'base/analogTextarea/analogTextarea'
  import { createPublicMeetingUrl } from 'api/config'
  import api from 'api/fetchData'
  import { DatetimePicker, Toast } from 'mint-ui'

  export default {
    name: 'publicMeeting',
    components: {
      AnalogTextarea,
      'mt-datetime-picker': DatetimePicker
    },
    data() {
      return {
        startPickerValue: '',
        endPickerValue: '',
        meeting: {
          title: '',
//          meetingType: 'PUBLIC',
          startTime: '2018-02-28 15:18:00',
          endTime: '2018-02-28 16:14:00',
          description: ''
        },
        selectStartTime: false,
        selectEndTime: false,
        clearContent: false
      }
    },
    computed: {
      startTime() {
        return this.selectStartTime ? this.meeting.startTime : '请选择会议开始时间'
      },
      endTime() {
        return this.selectEndTime ? this.meeting.endTime : '请选择会议结束时间'
      }
    },
    methods: {
      _openStartPicker() {
        this.selectStartTime = true
        this.$refs.startPicker.open()
      },
      _openEndPicker() {
        this.selectEndTime = true
        this.$refs.endPicker.open()
      },
      _handleStartConfirm(value) {
        this.meeting.startTime = new Date(value)
        console.log(this.meeting.startTime)
        this.$refs.startPicker.close()
      },
      _handleEndConfirm(value) {
        this.meeting.endTime = new Date(value)
        console.log(this.meeting.endTime)
        this.$refs.endPicker.close()
      },
      _handleContentChange(content) {
        this.meeting.description = content
      },
      _clickOnSubmit() {
        const url = createPublicMeetingUrl
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
            this.$router.push({ path: '/newestMeeting' })
          })
          .catch((e) => {
            //TODO error handle
            console.log(e)
          })
      },
      _validateMeeting(meeting) {
        if (!meeting.startTime) {
          return '请选择会议开始时间'
        }
        if (!meeting.endTime) {
          return '请选择会议结束时间'
        }
        if (meeting.startTime && meeting.endTime) {
          // 1.结束时间大于开始时间
          // 2.开始时间大于当前时间15 mins
//          return '发起公开会议需要至少提前15分钟'
        }
        if (!meeting.title) {
          return '请输入会议主题'
        }
        if (!meeting.description) {
          return '请输入会议简介'
        }
        return ''
      }
    },
    watch: {
      'meeting.title': function () {
        if (this.meeting.title.length > 30) {
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
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $background-color: #fff;
  $theme-color: #dd2738;
  .public-meeting {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .public-start-time {
      flex: 1;
    }
    .public-end-time {
      flex: 1;
      margin-top: 1px;
    }
    .public-meeting-title {
      flex: 1;
      margin: 10px 0;
    }
  }
  // 公用样式
  .list-left-div {
    padding: 11px 15px;
    flex: 3;
    line-height: 1.1;
    font-size: 17px;
    color: #000;
  }
  .list-right-div {
    position: relative;
    flex: 7;
    font-size: 14px;
    color: #999;
    .icon-select {
      display: inline-block;
      position: absolute;
      top: 0;
      right: 5px;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-decoration: none;
      color: #bbb;
      text-align: center;
    }
    .icon-xiangyou, .icon-clear {
      font-size: 20px;
    }
  }
  input {
    outline: none;
    width: 85%;
    font-size: 14px;
    color: #999;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .meeting-item-style {
    background-color: #fff;
    line-height: 40px;
    height: 40px;
    display: flex;
  }
  .meeting-description {
    flex: 1;
    background-color: $background-color;
    display: flex;
    .public-meeting-textarea {
      flex: 1;
      padding: 10px 15px 5px 15px;
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      height: 200px;
      overflow: scroll;
    }
  }
  .meeting-submit-btn {
    /*flex: 1;*/
    width: 100%;
    position: fixed;
    bottom: 0;
    background-color: #dd2738;
    color: #fff;
    font-size: 18px;
    text-align: center;
    height: 38px;
    line-height: 38px;
  }
</style>

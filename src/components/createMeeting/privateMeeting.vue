<template>
  <div class="private-meeting">
    <!--会议主题-->
    <div class="private-meeting-title meeting-item-style">
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
    <!--参会人-->
    <div class="private-meeting-attendance meeting-item-style" @click="_selectAttendance">
      <div class="list-left-div">
        <label>参会人</label>
      </div>
      <div class="list-right-div">
        <!--TODO ...-->
        <span class="attendances">{{ attendanceText }}</span>
        <span class="icon-select"><i class="icon-add-o"></i></span>
      </div>
    </div>
    <!--开始时间-->
    <div class="private-start-time meeting-item-style">
      <div class="list-left-div">
        <label>开始时间</label>
      </div>
      <div class="list-right-div">
        <span class="time-select">请选择会议开始时间</span>
        <span class="icon-select"><i class="icon-xiangyou"></i></span>
      </div>
    </div>
    <!--结束时间-->
    <div class="private-end-time meeting-item-style">
      <div class="list-left-div">
        <label>结束时间</label>
      </div>
      <div class="list-right-div">
        <span class="time-select">请选择会议结束时间</span>
        <span class="icon-select"><i class="icon-xiangyou"></i></span>
      </div>
    </div>
    <!--桌面共享-->
    <div class="private-desktop-share meeting-item-style">
      <!--<div class="desktop-share">-->
        <!--TODO yangshi-->
        <!--<span>桌面共享</span>-->
        <!--<span>(仅限12人)</span>-->
        <!--<span class="icon-select-instruction" @click="_showInstruction"><i class="icon-shuoming"></i></span>-->
      <!--</div>-->
      <!--<div class="list-right-div">-->
        <!--<span class="desktop-share-switch"><mt-switch v-model="meeting.desktopShare"></mt-switch></span>-->
      <!--</div>-->
      <span class="desktop-share">桌面共享</span>
      <span class="desktop-share-alert">(仅限12人)</span>
      <span class="icon-select-instruction" @click="_showInstruction"><i class="icon-shuoming"></i></span>
      <span class="desktop-share-switch"><mt-switch v-model="meeting.desktopShare"></mt-switch></span>
    </div>
    <!--会议简介-->
    <div class="meeting-description">
      <analog-textarea :maxCount="1000" :message="'会议简介最多1000字'"
                       :placeholderText="'请输入会议简介，不超过1000字'"
                       :class="'public-meeting-textarea'">
      </analog-textarea>
    </div>

    <div class="meeting-submit-btn" @click="_clickOnSubmit">
      <span>提交</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import AnalogTextarea from 'base/analogTextarea/analogTextarea'
  import { MessageBox, Toast, Switch } from 'mint-ui'
  import { desktopSharePrompt } from 'api/prompt'
  import { CLEAR_ATTENDANCE_LIST } from '../../store/mutation-types'
  import { createPrivateMeetingUrl } from 'api/config'
  import api from 'api/fetchData'

  export default {
    name: 'privateMeeting',
    components: {
      AnalogTextarea,
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
        switchValue: true
      }
    },
    computed: {
      attendanceList() {
        return this.$store.getters.attendanceList
      }
    },
    methods: {
      _selectAttendance() {
        this.$router.push({ path: '/selectAttendance' })
      },
      _openPicker() {
        this.$refs.picker.open()
      },
      _showInstruction() {
        MessageBox({
          title: '提示',
          message: desktopSharePrompt
        })
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
        //
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
  $background-color: #fff;
  $theme-color: #dd2738;
  .private-meeting {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    .private-meeting-title {
      flex: 1;
    }
    .private-meeting-attendance {
      margin: 10px 0;
      .attendances {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        margin-right: 40px;
      }
    }
    .private-start-time {
      flex: 1;
    }
    .private-end-time {
      flex: 1;
      margin-top: 1px;
    }
    .private-desktop-share {
      margin-top: 16px;
      margin-bottom: 10px;
      line-height: 40px;
      font-size: 17px;
      .desktop-share {
        padding-left: 15px;
        color: #000;
      }
      .desktop-share-alert {
        color: #dd2738;
      }
      .icon-select-instruction {
        color: #bbb;
        line-height: 40px;
        padding-left: 5px;
        .icon-shuoming {
          font-size: 20px;
        }
      }
      .desktop-share-switch {
        padding: 4px 0;
        position: absolute;
        right: 10px;
        .mint-switch {
          /deep/ .mint-switch-input:checked + .mint-switch-core {
            border-color: #dd2738;
            background-color: #dd2738;
          }
        }
      }
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
  }
  input {
    outline: none;
    width: 90%;
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

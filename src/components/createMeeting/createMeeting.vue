<template>
  <div class="create-meeting">
    <!--Tab选项-->
    <div class="tab-select">
      <div class="meeting-select" @click="_toggleToPublic" v-bind:class="{ active: selectedPublic }">公开会议</div>
      <div class="meeting-select" @click="_toggleToPrivate" v-bind:class="{ active: selectedPrivate }">私人会议</div>
    </div>
    <!--会议内容-->
    <div class="meeting-content">
      <!--公开会议-->
      <div v-if="selectedPublic" class="public-meeting-item">
        <!--TODO 时间选择器，找更好的-->
        <div class="public-start-time meeting-item-style" @click="_openPicker">
          <div class="list-left-div">
            <label>开始时间</label>
          </div>
          <div class="list-right-div">
            <span class="time-select">请选择会议开始时间</span>
            <span class="icon-select"><i class="icon-xiangyou"></i></span>
            <!--<mt-datetime-picker-->
              <!--ref="picker"-->
              <!--type="datetime"-->
              <!--v-model="pickerValue">-->
            <!--</mt-datetime-picker>-->
          </div>
        </div>
        <div class="public-end-time meeting-item-style">
          <div class="list-left-div">
            <label>结束时间</label>
          </div>
          <div class="list-right-div">
            <span class="time-select">请选择会议结束时间</span>
            <span class="icon-select"><i class="icon-xiangyou"></i></span>
          </div>
        </div>
        <div class="public-meeting-title meeting-item-style">
          <div class="list-left-div">
            <label>会议主题</label>
          </div>
          <div class="list-right-div">
            <input placeholder="请输入会议主题，不超过30字">
          </div>
        </div>
        <div class="meeting-description">
          <textarea rows="10" cols maxlength="1000" placeholder="请输入会议简介，不超过1000字"></textarea>
        </div>
        <div class="meeting-submit-btn">
          提交
        </div>
      </div>
      <!--私人会议-->
      <div v-if="selectedPrivate" class="private-meeting-item">
        <div class="private-meeting-title meeting-item-style">
          <div class="list-left-div">
            <label>会议主题</label>
          </div>
          <div class="list-right-div">
            <input placeholder="请输入会议主题，不超过30字">
          </div>
        </div>
        <div class="private-meeting-attendance meeting-item-style" @click="_selectAttendance">
          <div class="list-left-div">
            <label>参会人</label>
          </div>
          <div class="list-right-div">
            <span class="">请选择参会人</span>
            <span class="icon-select"><i class="icon-add-o"></i></span>
          </div>
        </div>
        <div class="private-start-time meeting-item-style">
          <div class="list-left-div">
            <label>开始时间</label>
          </div>
          <div class="list-right-div">
            <span class="time-select">请选择会议开始时间</span>
            <span class="icon-select"><i class="icon-xiangyou"></i></span>
          </div>
        </div>
        <div class="private-end-time meeting-item-style">
          <div class="list-left-div">
            <label>结束时间</label>
          </div>
          <div class="list-right-div">
            <span class="time-select">请选择会议结束时间</span>
            <span class="icon-select"><i class="icon-xiangyou"></i></span>
          </div>
        </div>
        <div class="private-desktop-share meeting-item-style">
          <div class="list-left-div">
            <label>桌面共享</label>
            <span class="icon-select-instruction" @click="_showInstruction"><i class="icon-shuoming"></i></span>
          </div>
          <div class="list-right-div">
            <!--TODO swich样式 -->
            <span class="desktop-share-switch"><mt-switch v-model="switchValue"></mt-switch></span>
          </div>
        </div>
        <div class="meeting-description">
          <textarea rows="10" cols maxlength="1000" placeholder="请输入会议简介，不超过1000字"></textarea>
        </div>
        <div class="meeting-submit-btn">
          提交
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { MessageBox } from 'mint-ui'
  import { desktopSharePrompt } from '../../api/prompt'
  export default {
    name: 'createMeeting',
    data() {
      return {
        selectedPublic: true,
        selectedPrivate: false,
        pickerValue: null,
        switchValue: true
      }
    },
    computed: {
    },
    methods: {
      _toggleToPublic() {
        this.selectedPublic = true
        this.selectedPrivate = false
      },
      _toggleToPrivate() {
        this.selectedPublic = false
        this.selectedPrivate = true
      },
      _selectAttendance() {
        this.$router.push({ path: '/selectAttendance' })
      },
      _openPicker() {
//        this.$refs.picker.open()
      },
      _showInstruction() {
        MessageBox({
          title: '提示',
          message: desktopSharePrompt
        })
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $background-color: #fff;
  $theme-color: #dd2738;
  .create-meeting {
    .tab-select {
      display: flex;
      .meeting-select  {
        flex: 1;
        text-align: center;
        line-height: 38px;
        height: 38px;
        color: #999;
        border-bottom: 3px solid $background-color;
        font-size: 16px;
        background-color: $background-color;
      }
      .active {
        color: #666;
        border-bottom: 3px solid $theme-color;
      }
    }
    .meeting-content {
      .public-meeting-item {
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
      .private-meeting-item {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .private-meeting-title {
          flex: 1;
        }
        .private-meeting-attendance {
          margin: 10px 0;
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
          .icon-select-instruction {
            /*display: inline-block;*/
            color: #bbb;
          }
          .desktop-share-switch {
            position: absolute;
            right: 10px;
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
        flex: 7;
        font-size: 14px;
        color: #999;
        .icon-select {
          display: inline-block;
          position: absolute;
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
        textarea {
          flex: 1;
          outline: none;
          border: none;
          line-height: 21px;
          font-size: 14px;
          padding: 10px 15px;
          overflow: auto;
          font-weight: 400;
          color: #8f8f94;
          resize: none;
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
    }
  }

</style>

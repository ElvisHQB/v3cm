<template>
  <div class="create-meeting">
    <!--Tab选项-->
    <div class="tab-select">
      <div class="meeting-select" @click="_toggleToPublic" v-bind:class="{ 'active-select': selectedPublic }">公开会议</div>
      <div class="meeting-select" @click="_toggleToPrivate" v-bind:class="{ 'active-select': selectedPrivate }">私人会议</div>
    </div>
    <!--会议内容-->
    <div class="meeting-content">
      <!--公开会议-->
      <div v-if="selectedPublic" class="public-meeting-item">
        <div class="start-time meeting-item-style">
          <label>开始时间</label>
          <span>时间选择器</span>
        </div>
        <div class="end-time meeting-item-style">
          <label>结束时间</label>
          <span>时间选择器</span>
        </div>
        <div class="meeting-title meeting-item-style">
          <label>会议主题</label>
          <!--<span><input placeholder="请输入会议主题，不超过30字"></span>-->
          <input placeholder="请输入会议主题，不超过30字">
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
        <div class="meeting-title meeting-item-style">
          <label>会议主题</label>
          <!--<span><input placeholder="请输入会议主题，不超过30字"></span>-->
          <input placeholder="请输入会议主题，不超过30字">
        </div>
        <div class="meeting-attendance meeting-item-style" @click="_selectAttendance">
          <label>参会人</label>
          <span>请选择参会人</span>
        </div>
        <div class="start-time meeting-item-style">
          <label>开始时间</label>
          <span>时间选择器</span>
        </div>
        <div class="end-time meeting-item-style">
          <label>结束时间</label>
          <span>时间选择器</span>
        </div>
        <div class="meeting-attendance meeting-item-style">
          <label>桌面共享</label>
          <span></span>
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
  export default {
    name: 'createMeeting',
    data() {
      return {
//        meetingType: 'public',
        selectedPublic: true,
        selectedPrivate: false
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
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .create-meeting {
    .tab-select {
      display: flex;
      .meeting-select  {
        flex: 1;
        text-align: center;
        line-height: 38px;
        height: 38px;
        color: #999;
        border-bottom: 3px solid #fff;
        font-size: 16px;
        background-color: #fff;
      }
      .active-select {
        color: #666;
        border-bottom: 3px solid #dd2738;
      }
    }
    .meeting-content {
      .public-meeting-item {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .start-time {
          flex: 1;
        }
        .end-time {
          flex: 1;
          margin-top: 1px;
        }
        .meeting-title {
          flex: 1;
          margin-top: 10px;
          input {
            flex: 6.5;
            outline: none;
            font-size: 14px;
          }
        }
      }
      .private-meeting-item {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .start-time {
          flex: 1;
        }
        .end-time {
          flex: 1;
          margin-top: 1px;
        }
        .meeting-title {
          flex: 1;
          margin-top: 10px;
          input {
            flex: 6.5;
            outline: none;
            font-size: 14px;
          }
        }
      }
      /*.meeting-submit-btn {*/
      /*position: fixed;*/
      /*bottom: 0;*/
      /*background-color: #dd2738;*/
      /*color: #fff;*/
      /*height: 38px;*/
      /*line-height: 38px;*/
      /*}*/
    }
    .meeting-description {
      flex: 1;
      margin-top: 10px;
      background-color: #fff;
      display: flex;
      textarea {
        flex: 1;
        outline: none;
        line-height: 21px;
        font-size: 14px;
        padding: 10px 15px;
        overflow: auto;
        font-weight: 400;
        color: #8f8f94;
        resize: none;
      }
    }
    .meeting-item-style {
      background-color: #fff;
      line-height: 40px;
      height: 40px;
      display: flex;
    }
  }
  .meeting-content label {
    padding: 11px 15px;
    flex: 3.5;
    line-height: 1.1;
    font-size: 17px;
    color: #000;
  }
  .meeting-content span {
    flex: 6.5;
    font-size: 14px;
  }

</style>

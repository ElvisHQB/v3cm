<template>
  <div class="pri-meeting-list">
    <div class="pri-meeting-list-line">会议时间：{{item.startTime}}</div>
    <div class="pri-meeting-list-line">主题：{{item.title}}</div>
    <div class="pri-meeting-list-line">创建人：{{item.createName}}</div>
    <div class="pri-meeting-list-line">
      <span class="line-code">会议室：{{item.roomNo}}</span>
      <span class="line-code">密码：{{item.meetingCode}}</span>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    name: 'private-meeting-list',
    props: {
      item: ''
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .pri-meeting-list {
    margin-top: 6px;
    padding: 11px 15px;
    font-family: $font-family;
    background-color: #ffffff;

    .pri-meeting-list-line {
      padding: 3px 0;
      line-height: 21px;
      color: #000;
      font-size: 17px;
      display: flex;

      .line-code {
        flex-grow: 1;
      }
    }
  }

</style>

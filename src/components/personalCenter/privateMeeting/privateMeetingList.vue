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
  @import "../../../common/scss/variable";
  $pri-font-size: 21px;
  $pri-font-color: #000000;

  .pri-meeting-list {
    margin-top: 6px;
    padding: 11px 15px;
    font-family: $font-family;
    background-color: $tab-background;

    .pri-meeting-list-line {
      padding: 3px 0;
      line-height: $pri-font-size;
      color: $pri-font-color;
      font-size: $font-size-medium-x;
      display: flex;

      .line-code {
        flex-grow: 1;
      }
    }
  }

</style>

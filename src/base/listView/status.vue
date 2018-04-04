<template>
  <div v-if="meetingStatus === 'STARTED'" class="status">
    <img src="../../assets/bq1.png">
    <span class="status-text">直播中</span>
  </div>
  <div v-else-if="signupStatus" class="status">
    <img src="../../assets/bq2.png">
    <span class="status-text">已报名</span>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      signupStatus: {
        type: Boolean,
        default: false
      },
      meetingStatus: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';
  $status-text-color: #fff;
  .status {
    position: absolute;
    left: 5px;
    top: 0;
    img {
      width: 50px;
      height: 21px;
    }
    .status-text {
      position: absolute;
      left: 7px;
      top: 0;
      font-size: $font-size-small;
      color: $status-text-color;
    }
  }
</style>

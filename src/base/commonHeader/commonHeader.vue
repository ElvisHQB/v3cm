<template>
  <div class="common-header">
    <div class="icon-back-btn">
      <span class="icon-select"><i class="icon-fanhui"></i></span>
    </div>
    <div class="search">
      <input type="search" placeholder="请输入要搜索的内容">
    </div>
    <div class="create-meeting-btn">
      <div class="icon-select"><i class="icon-add-o"></i></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'commonHeader'
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $header-height: 45px;
  $touch-icon-width: 45px;
  .common-header {
    display: flex;
    height: $header-height;
    line-height: $header-height;
    color: $color-text-ll;
    background-color: $color-theme;
    .icon-back-btn {
      flex: 1;
    }
    .search {
      flex: 6;
      display: inline-block;
      vertical-align: top;
      width: 70%;
      height: 45px;
      line-height: 45px;
      input {
        display: inline-block;
        width: 100%;
        height: $header-height / 2;
        line-height: $header-height / 2;
      }
    }
    .create-meeting-btn {
      flex: 1;
      display: inline-block;
      vertical-align: top;
      height: 45px;
      line-height: 45px;
    }
  }
  .icon-select {
    display: inline-block;
    width: $touch-icon-width;
    height: $header-height;
    line-height: $header-height;
    text-align: center;
  }
</style>

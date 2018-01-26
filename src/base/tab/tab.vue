<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/newestMeeting">
      <span class="tab-link">
        <i class="icon-huiyi"></i>
        <span>最新会议</span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/historyMeeting">
      <span class="tab-link">
        <i class="icon-lishijilu"></i>
        <span>历史会议</span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/meetingInfo">
      <span class="tab-link">
        <i class="icon-bendizixun"></i>
        <span>会议资讯</span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/personalCenter">
      <span class="tab-link">
        <i class="icon-gerenzhongxin"></i>
        <span>个人中心</span>
      </span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Tab',
    components: {
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";

  .tab {
    display: flex;
    height: 50px;
    line-height: 50px;
    background-color: $tab-background;

    .tab-item {
      flex: 1;
      text-align: center;

      .tab-link {
        display: flex;
        height: 100%;
        line-height: 1.5;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: $color-text-ll;
      }

      &.router-link-active {
        .tab-link {
          color: $color-theme;
        }
      }
    }
  }
</style>

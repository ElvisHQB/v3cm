<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/newestMeeting">
      <span class="tab-link">
        <i class="icon-huiyi"></i>
        <span class="tab-name">最新会议</span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/historyMeeting">
      <span class="tab-link">
        <i class="icon-lishijilu"></i>
        <span class="tab-name">历史会议</span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" :to="{name:'meetingDetail',params:{meetingId: this.meetingIdData}}">
      <span class="tab-link">
        <i class="icon-font icon-bofang"></i>
        <span class="circle-outer"></span>
        <span class="circle-inner"></span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/meetingInfo">
      <span class="tab-link">
        <i class="icon-bendizixun"></i>
        <span class="tab-name">会议资讯</span>
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/personalCenter">
      <span class="tab-link">
        <i class="icon-gerenzhongxin"></i>
        <span class="tab-name">个人中心</span>
      </span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'Tab',
    data () {
      return {
        //TODO 从VueX中取出meetingId
        meetingIdData: 0
      }
    },
    components: {}
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $tab-height: 40px;

  .tab {
    display: flex;
    position: relative;
    height: $tab-height;
    line-height: $tab-height;
    background-color: $tab-background;
    box-shadow: 0px 2px 12px #c5c5c5;

    .tab-item {
      flex: 1;
      text-align: center;

      .tab-link {
        display: flex;
        height: 100%;
        line-height: 1;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-weight: lighter;
        .tab-name {
          transform: scale(0.8);
        }
        i {
          transform: scale(0.7);
        }
        .icon-font {
          position: absolute;
          top: 3px;
          left: 50.3%;
          transform: translateX(-50%);
          z-index: 9;
          color: #dd2637c9;
          font-size: $font-size-large-x;
        }
        .circle-outer {
          border-top: 1px solid #e8e6e6;
          display: inline-block;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          position: absolute;
          top: -15px;
          background: $tab-background;
          box-shadow: 0px -5px 5px #f7f7f794;
        }
        .circle-inner {
          border-top: 1px solid #fff;
          display: inline-block;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          position: absolute;
          top: -10px;
          box-shadow: 0 1px 3px #e2dfdf inset;
        }
      }

      &.router-link-active {
        .tab-link {
          color: $color-theme;
        }
      }
    }
  }
</style>

<template>
  <div class="common-header">
    <!--左侧返回Btn-->
    <div class="header-left">
      <div class="icon-back-btn" @click="_goBack">
        <span class="icon-select"><i class="icon-fanhui"></i></span>
      </div>
    </div>
    <!--中间搜索框或title-->
    <div class="header-center">
      <div v-if="renderHeader.center === 1" class="search" @click="_clickOnSearch">
        <!--TODO 监听这个form提交，获取searchStr-->
        <form action="">
          <input v-model="searchStr" type="search" placeholder="">
        </form>
        <!--<span class="icon-select"><i class="icon-fangdajing"></i></span>-->
      </div>
      <div v-if="renderHeader.center === 2" class="title">
        <span>{{ renderHeader.titleValue }}</span>
      </div>
    </div>
    <!--右侧搜索Btn或发起会议Btn或详情页更多Btn-->
    <div class="header-right">
      <!--发起会议-->
      <div v-if="renderHeader.right === 1" class="create-meeting-btn" @click="_createMeeting">
        <span class="icon-select"><i class="icon-add-o"></i></span>
      </div>
      <!--搜索会议-->
      <div v-if="renderHeader.right === 2" class="search-meeting-btn" @click="_searchMeeting">
        <span class="icon-select"><i class="icon-fangdajing"></i></span>
      </div>
      <!--更多详情-->
      <div v-if="renderHeader.right === 3" class="more-info" @click="clickOnMoreDetail">
        <span class="icon-select"><i class="icon-gengduo"></i></span>
      </div>
      <!--选择参会人完成-->
      <div v-if="renderHeader.right === 4" class="select-attendance-complete" @click="clickOnCompleteBtn">
        <span :class="[{ active: hasSelectedAttendance }, 'complete-btn']">{{ renderHeader.rightValue }}</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { SET_HEADER_SEARCH_STR, TOGGLE_HEADER_MORE_POPUP } from 'store/mutation-types'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'commonHeader',
    data() {
      return {
        renderHeader: {
          // 0:none;1:search;2:title
          center: 1,
          // 0:none;1:create-meeting-btn;2:search-meeting-btn;3:more-info
          right: 1,
          titleValue: '',
          rightValue: '完成'
        },
        searchStr: '',
        hasSelectedAttendance: false
      }
    },
    computed: {
      ...mapGetters([
        'headerSearchStr',
        'attendanceList'
      ])
    },
    methods: {
      ...mapMutations({
        setHeaderSearchStr: SET_HEADER_SEARCH_STR,
        toggleHeaderMorePopup: TOGGLE_HEADER_MORE_POPUP
      }),
      _goBack() {
        this.$router.back()
      },
      _clickOnSearch() {
        this.$router.push({ path: '/search' })
      },
      _searchMeeting() {
        //将搜索字符串存入Vuex
        this.setHeaderSearchStr(this.searchStr)
      },
      _createMeeting() {
        this.$router.push({ path: '/createMeeting' })
      },
      clickOnMoreDetail() {
        this.toggleHeaderMorePopup()
      },
      clickOnCompleteBtn() {
        if (!this.hasSelectedAttendance) return
        this.$router.back()
      }
    },
    // Vue实例调用$watch方法，创建watcher
    // handler的属性: deep, immediate, sync, lazy
    // deep:true, 递归watch
    // immediate:true, 创建watcher时就执行一次handler方法
    // sync:true, 同步
    // lazy:true,
    watch: {
      //watch路由变化，根据路由渲染common header
      $route: {
        handler: function () {
          //路由变化，清空搜索框
          this.searchStr = ''
          // TODO 可配置
          const regex1 = /^(\/newestMeeting)|(\/historyMeeting)|(\/meetingInfo)$/
          const regex2 = /^(\/personalCenter)$/
          const regex3 = /^(\/search)$/
          const createMeeting = /^(\/createMeeting)$/
          const selectAttendance = /^(\/selectAttendance)$/
          const regex6 = /^(\/personalCenter\/publishedMeeting)$/
          const regex7 = /^(\/personalCenter\/privateMeeting)$/
          const regex8 = /^(\/personalCenter\/myCollection)$/
          const regex9 = /^(\/personalCenter\/latestPlay)$/
          const meetingDetail = /^\/meetingDetail\/((?:[^/]+?))(?:\/(?=$))?$/i
          if (regex1.test(this.$route.path)) {
            this.renderHeader.center = 1
            this.renderHeader.right = 1
          }
          if (regex2.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '个人中心'
          }
          if (regex3.test(this.$route.path)) {
            this.renderHeader.center = 1
            this.renderHeader.right = 2
          }
          if (createMeeting.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '发起会议'
          }
          if (selectAttendance.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 4
            this.renderHeader.titleValue = '选择参会人'
          }
          if (regex6.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '公开会议'
          }
          if (regex7.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '私人会议'
          }
          if (regex8.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '我的收藏'
          }
          if (regex9.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '最近播放'
          }
          if (meetingDetail.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 3
            this.renderHeader.titleValue = '详情'
          }
        },
        // 创建watcher是就执行一次handler方法
        immediate: true
      },
      attendanceList: {
        handler: function () {
          let len = this.attendanceList.length
          if (len > 0) {
            this.hasSelectedAttendance = true
            this.renderHeader.rightValue = '完成(' + len + ')'
          } else {
            this.hasSelectedAttendance = false
            this.renderHeader.rightValue = '完成'
          }
        },
        deep: true
      },
      headerSearchStr(newVal) {
        this.searchStr = newVal
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $header-height: 45px;
  $input-height: 30px;
  $touch-icon-width: 45px;
  $main-text-color: #fff;
  $input-background-color: rgba(0,0,0,.1);
  .common-header {
    display: flex;
    flex-direction: row;
    height: $header-height;
    line-height: $header-height;
    color: $color-text-ll;
    background-color: $color-theme;
    z-index: 999;
    .header-left {
      flex: 1.5;
    }
    .header-center {
      flex: 7;
      display: flex;
      justify-content: center;
      justify-items: center;
      .search {
        width: 100%;
        form {
          height: $header-height;
        }
        input {
          display: inline-block;
          width: 100%;
          margin: 7.5px 0;
          height: $input-height;
          line-height: $input-height;
          border-radius: 4px;
          text-indent: 10px;
          outline: none;
          color: $main-text-color;
          font-size: $font-size-medium-x;
          background-color: $input-background-color;
        }
        input[type="search"]::-webkit-search-cancel-button {
          display: none;
        }
      }
      .title {
        font-size: $font-size-medium-x;
        color: $main-text-color;
      }
    }
    .header-right {
      flex: 1.5;
      display: inline-block;
      height: $header-height;
      line-height: $header-height;
      .more-info {
        color: $main-text-color;
      }
      .select-attendance-complete {
        font-size: $font-size-medium;
        .complete-btn {
          display: inline-block;
          height: $header-height;
          width: 100%;
          text-align: center;
        }
        .active {
          color: $main-text-color;
        }
      }
    }
    .icon-select {
      display: inline-block;
      width: 100%;
      height: $header-height;
      line-height: $header-height;
      text-align: center;
    }
  }
</style>

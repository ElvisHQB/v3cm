<template>
  <!--TODO 根据路由和头部渲染对象，条件渲染头部-->
  <div class="common-header">
    <!--左侧返回Btn-->
    <div class="header-left">
      <div class="icon-back-btn">
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
        <div class="icon-select"><i class="icon-add-o"></i></div>
      </div>
      <!--搜索会议-->
      <div v-if="renderHeader.right === 2" class="search-meeting-btn" @click="_searchMeeting">
        <span class="icon-select"><i class="icon-fangdajing"></i></span>
      </div>
      <!--更多详情-->
      <div v-if="renderHeader.right === 3" class="more-info">
        <div class="icon-select"><i class="icon-gengduo"></i></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { SET_SEARCH_STR } from '../../store/mutation-types'
  export default {
    name: 'commonHeader',
    data() {
      return {
        renderHeader: {
//          'left': 0,
          // 0:none;1:search;2:title
          'center': 1,
          // 0:none;1:create-meeting-btn;2:search-meeting-btn;3:more-info
          'right': 1,
          'titleValue': ''
        },
        searchStr: ''
      }
    },
    methods: {
      _clickOnSearch() {
        this.$router.push({ path: '/search' })
      },
      _searchMeeting() {
        //将搜索字符串存入Vuex
        this.$emit('searchMeeting')
        this.$store.commit(SET_SEARCH_STR, this.searchStr)
      },
      _createMeeting() {
        //
        this.$router.push({ path: '/createMeeting' })
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
      '$route': {
        handler: function () {
          const regex1 = /^(\/newestMeeting)|(\/historyMeeting)|(\/meetingInfo)$/
          const regex2 = /^(\/personalCenter)$/
          const regex3 = /^(\/search)$/
          const regex4 = /^(\/createMeeting)$/
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
          if (regex4.test(this.$route.path)) {
            this.renderHeader.center = 2
            this.renderHeader.right = 0
            this.renderHeader.titleValue = '发起会议'
          }
        },
        // 创建watcher是就执行一次handler方法
        immediate: true
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $header-height: 45px;
  $touch-icon-width: 45px;
  //$dd:rgba(0,0,0,.1);
  .common-header {
    display: flex;
    flex-direction: row;
    height: $header-height;
    line-height: $header-height;
    color: $color-text-ll;
    background-color: $color-theme;
    .header-left {
      flex: 1;
      .icon-back-btn {

      }
    }
    .header-center {
      flex: 8;
      display: flex;
      justify-content: center;
      justify-items: center;
      .search {
        width: 100%;
        input {
          display: inline-block;
          width: 100%;
          height: 30px;
          line-height: 30px;
          border-radius: 4px;
          text-indent: 10px;
          outline: none;
          color: #fff;
          font-size: 16px;
          background-color: rgba(0,0,0,.1);
          /*-webkit-appearance: none;*/
        }
        input[type="search"]::-webkit-search-cancel-button {
          display: none;
        }
      }
      .title {
        font-size: 17px;
        color: #fff;
      }
    }
    .header-right {
      flex: 1;
      display: inline-block;
      height: 45px;
      line-height: 45px;
      .search-meeting-btn {
        //
      }
      .create-meeting-btn {
        //
      }
      .more-info {
        //
      }
    }
    .icon-select {
      display: inline-block;
      width: $touch-icon-width;
      height: $header-height;
      line-height: $header-height;
      text-align: center;
    }
  }
  /*
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
  */
</style>

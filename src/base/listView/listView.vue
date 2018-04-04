<template>
  <div class="list-view" @click="onClick">
    <div class="main">
      <div class="left-item">
        <img v-lazy="item.imgUrl">
      </div>
      <div class="right-item">
        <!--会议标题时间及主讲人信息-->
        <div class="meeting-info">
          <p>{{ item.title }}</p>
          <p><span>{{ item.lecturer }}</span><span>{{ item.sponsor }}</span></p>
          <p>{{ item.meetingTime }}</p>
        </div>
      </div>
    </div>
    <!--会议状态和报名状态标识-->
    <slot name="status"></slot>
    <!--推荐和视频标识-->
    <slot name="recommend"></slot>
    <!--底部会议下载，看速记，听录音-->
    <slot name="operation"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    methods: {
      onClick() {
        console.log('click on list...')
        this.$emit('click')
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';

  $list-color: #fff;
  $list-line-height: 22px;
  $speaker-color: #3ba3df;
  $logo-size: 60px;

  .list-view {
    background-color: $list-color;
    position: relative;
    margin-top: 6px;
    padding: 11px 15px;
    .main {
      display: flex;
      margin-top: 10px;
      .left-item {
        img {
          width: $logo-size;
          height: $logo-size;
          margin-top: 3px;
          margin-right: 10px;
        }
      }
      .right-item {
        .meeting-info {
          line-height: $list-line-height;
          @mixin ellipsis {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
          p:nth-child(1) {
            font-size: $font-size-medium-x;
            padding-right: 30px;
            margin-bottom: 7px;
            line-height: $list-line-height;
            max-height: $list-line-height * 2;
            //TODO 兼容性较差寻找更好的方式实现
            @include ellipsis;
            -webkit-line-clamp: 2;
          }
          p:nth-child(2) {
            height: $list-line-height;
            line-height: $list-line-height;
            @include ellipsis;
            -webkit-line-clamp: 1;
            span:first-child {
              margin-right: 10px;
              color: $speaker-color;
            }
          }
        }
      }
    }
  }
</style>

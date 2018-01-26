<template>
  <div class="list-wrapper">
    <div class="list-top-item">
      <div class="list-left-content">
        <!--<div></div>-->
        <div class="left-img-wrapper">
          <img class="left-img" v-lazy="item.logoUrl">
        </div>
      </div>
      <div class="list-right-content">
        <div class="right-p-wrapper">
          <p class="right-p-title">{{ item.title }}</p>
          <p class="right-p-speaker-sponsor"><span class="speaker">苟玉根(首席策略分析师两个)</span><span class="sponsor">光大证券、海通证券、Wind</span></p>
          <p class="right-p-time"><span class="days">2018-01-31</span><span class="weeks">今天</span><span class="hours">20:00-21:00</span></p>
        </div>
        <!--<div></div>-->
      </div>
    </div>
    <div class="list-bottom-item"></div>
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
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';
  $list-color: #fff;
  $list-line-height: 22px;
  $speaker-color: #3ba3df;
  $left-img-width: 60px;
  $left-img-height: 60px;

  .list-wrapper {
    background-color: $list-color;
    display: flex;
    flex-direction: column;
    margin-top: 6px;
    .list-top-item {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      padding: 11px 15px;
      .list-left-content {
        .left-img-wrapper {
          .left-img {
            width: $left-img-width;
            min-width: $left-img-width;
            height: $left-img-height;
            line-height: $left-img-height;
            margin-top: 3px;
            margin-right: 10px;
          }
        }
      }
      .list-right-content {
        .right-p-wrapper {
          /*padding-right: 20px;*/
          line-height: $list-line-height;
          .right-p-title {
            font-size: $font-size-medium-x;
            padding-right: 20px;
            margin-bottom: 7px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            line-height: $list-line-height;
            max-height: $list-line-height * 2;
            //TODO 兼容性较差寻找更好的方式实现
            -webkit-line-clamp: 2;
          }
          .right-p-speaker-sponsor {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            height: $list-line-height;
            line-height: $list-line-height;
            max-height: $list-line-height;
            -webkit-line-clamp: 1;
            .speaker {
              margin-right: 10px;
              color: $speaker-color;
            }
          }
          .right-p-time {
            .days,.weeks, .hours {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
</style>

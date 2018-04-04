<template>
  <div class="per-head">
    <div class="per-head-img">
      <img class="per-head-img-detail" :src="imgUrl"/>
    </div>
    <div class="per-head-detail">
      <p class="per-head-detail-name">{{userName}}</p>
      <p class="per-head-detail-inst">{{inst}}</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'personal-center-head',
    props: {
      imgUrl: {
        type: String,
        default: ''
      },
      userName: {
        type: String,
        default: ''
      },
      inst: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  $head-min-height: 75px;
  $border-color: #d3d3d3;
  $per-head-height: 60px;
  $per-head-width: 60px;
  $per-head-border-radius: 29px;

  .per-head {
    font-family: $font-family;
    min-height: $head-min-height;
    background: $tab-background;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;

    .per-head-img {
      margin: 0 15px;

      .per-head-img-detail {
        height: $per-head-width;
        width: $per-head-width;
        border-radius: $per-head-border-radius;
        min-width: $per-head-width;
        max-width: $per-head-width;
        min-height: $per-head-width;
        max-height: $per-head-width;
      }
    }

    .per-head-detail {
      padding: 15px 0px;

      .per-head-detail-name {
        height: 24px;
        line-height: 24px;
        font-size: $font-size-medium-x;
        color: #333;
      }

      .per-head-detail-inst {
        width: 70vw;
        line-height: 21px;
        font-size: $font-size-medium;
        color: #666;
      }
    }
  }

</style>

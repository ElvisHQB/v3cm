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
      imgUrl: '',
      userName: '',
      inst: ''
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  .per-head {
    font-family: $font-family;
    min-height: 75px;
    background: #fff;
    border-bottom: 1px solid lightgray;
    display: flex;
    align-items: center;

    .per-head-img {
      margin: 0 15px;

      .per-head-img-detail {
        height: 60px;
        width: 60px;
        border-radius: 29px;
        min-width: 60px;
        max-width: 60px;
        min-height: 60px;
        max-height: 60px;
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

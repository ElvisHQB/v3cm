<template>
  <div v-if="recommend" class="recommend">
    <img src="../../assets/tj.png">
  </div>
  <div v-else-if="broadcastType === 'WEBVIDEO'" class="recommend">
    <img src="../../assets/video.svg">
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      recommend: {
        type: Boolean,
        default: false
      },
      broadcastType: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $recommend-img-size: 20px;
  .recommend {
    position: absolute;
    right: 15px;
    top: 20px;
    img {
      width: $recommend-img-size;
      height: $recommend-img-size;
    }
  }
</style>

<template>
  <div class="slide-wrapper">
    <slide :interval="interval" ref="slide">
      <div v-for="(item, index) in images" :key="index">
        <a :href="item.linkUrl">
          <img :src="item.url" @load="_loadImage">
        </a>
      </div>
    </slide>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slide from 'base/slide/slide'

  const COMPONENT_NAME = 'slideWrapper'
  const LOAD_EVENT = 'imageLoad'

  export default {
    name: COMPONENT_NAME,
    components: {
      Slide
    },
    data() {
      return {
        images: [
          {
            id: 1,
            url: 'http://114.80.154.45/unitedweb/CMS/pictures/20180123/063320_0123M.jpg'
          },
          {
            id: 2,
            url: 'http://114.80.154.45/unitedweb/CMS/pictures/20180123/064417_mobbanner.jpg'
          }
        ]
      }
    },
    created() {
      this.interval = 3000
    },
    methods: {
      _loadImage() {
        this.$emit(LOAD_EVENT)
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .slide-wrapper {
    position: relative;
    width: 100%;
  }
</style>

<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      //滚动超过边缘的回弹动画
      bounce: {
        type: Boolean,
        default: false
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      },
      pullUpload: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        isPullingDown: false,
        isPullUpLoad: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
//      this.$nextTick(this._initScroll())
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          bounce: this.bounce,
//          pullDownRefresh: this.pullDownRefresh,
//          pullUpload: this.pullUpload
          pullDownRefresh: {
            threshold: 50,
            stop: 20
          },
          pullUpLoad: {
            threshold: 50
          }
        })
        console.log(this.scroll)
        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }
        if (this.pullUpLoad) {
          this._initPullUpload()
        }
      },
      enable() {
        this.scroll && this.scroll.enable()
      },
      disable() {
        this.scroll() && this.scroll.disable()
      },
      refresh() {
        this.scroll && this.scroll.refresh()
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.$emit('pullingDown')
        })
      },
      _initPullUpload() {
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
//        this.$nextTick(this.refresh())
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>

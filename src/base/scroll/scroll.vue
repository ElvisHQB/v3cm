<template>
  <div ref="wrapper">
    <div>
      <div>
        <slot></slot>
      </div>
      <slot name="pullup"
            :pullUpLoad="pullUpLoad"
            :isPullUpLoad="isPullUpLoad"
      >
        <div class="pullup-wrapper" v-if="pullUpLoad">
          <div class="after-trigger" v-if="isPullUpLoad">
            <loading></loading>
            <span>正在加载...</span>
          </div>
          <div class="before-trigger" v-else>
            <span>{{ pullUpTxt }}</span>
          </div>
        </div>
      </slot>
    </div>
    <slot name="pulldown"
          :pullDownRefresh="pullDownRefresh"
          :beforePullDown="beforePullDown"
          :isPullingDown="isPullingDown"
          :pullDownStyle="pullDownStyle"
    >
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <span>{{ refreshTxt }}</span>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
            <span>正在刷新...</span>
          </div>
          <div v-else><span>加载完成...</span></div>
        </div>
      </div>
    </slot>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Loading from 'base/loading/loading'

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
        type: null,
        default: false
      },
      pullUpLoad: {
        type: null,
        default: false
      },
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    components: {
      Loading
    },
    data() {
      return {
        beforePullDown: true,
        isRebounding: false,
        isPullingDown: false,
        isPullUpLoad: false,
        scrollStart: false,
        pullUpDirty: true,
        pullDownStyle: ''
      }
    },
    computed: {
      pullUpTxt() {
        return this.pullUpDirty ? '' : '没有更多数据了'
      },
      refreshTxt() {
        return this.scrollStart ? '释放立即刷新...' : ''
      }
    },
    created() {
      this.pullDownInitTop = -55
      this.pullDownThreshold = 20
    },
    mounted() {
      this.$nextTick(this._initScroll())
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        let options = {
          probeType: this.probeType,
          click: this.click,
          bounce: this.bounce,
          pullDownRefresh: this.pullDownRefresh,
          pullUpLoad: this.pullUpLoad
        }
        this.scroll = new BScroll(this.$refs.wrapper, options)
        console.log(this.scroll)
        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad()
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
      forceUpdate(dirty) {
        if (this.pullDownRefresh && this.isPullingDown) {
          this.isPullingDown = false
          this._reboundPullDown().then(() => {
            this._afterPullDown()
          })
        } else if (this.pullUpLoad && this.isPullUpLoad) {
          this.isPullUpLoad = false
          this.scroll.finishPullUp()
          this.pullUpDirty = dirty
          this.refresh()
        } else {
          this.refresh()
        }
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          console.log('pull down refresh...')
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
        this.scroll.on('scroll', (pos) => {
          if (this.beforePullDown) {
            let val = pos.y > this.pullDownThreshold ? -this.pullDownInitTop : this.pullDownInitTop
            this.pullDownStyle = `top:${val}px`
          }
          if (this.isRebounding) {
            this.pullDownStyle = `top:${this.pullDownInitTop}px`
          }
        })
        this.scroll.on('scrollStart', () => {
          this.scrollStart = true
        })
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          console.log('pull upload...')
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown() {
        const {stopTime = 600} = this.pullDownRefresh
        return new Promise((resolve) => {
          setTimeout(() => {
            this.isRebounding = true
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown() {
        setTimeout(() => {
          this.pullDownStyle = `top:${this.pullDownInitTop}px`
          this.beforePullDown = true
          this.isRebounding = false
          this.refresh()
        }, this.scroll.options.bounceTime)
      }
    },
    watch: {
      data() {
        this.$nextTick(this.forceUpdate(true))
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .pullup-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0;
    .after-trigger {
      display: flex;
      flex-direction: row;
    }
  }
  .pulldown-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all;
    .after-trigger {
      .loading {
        display: flex;
        flex-direction: row;
      }
    }
  }
</style>

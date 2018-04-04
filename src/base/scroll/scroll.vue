<template>
  <div ref="wrapper" class="scroll-wrapper">
    <div class="scroll-content">
      <!--下拉刷新-->
      <div ref="pulldown" class="pulldown-wrapper" v-if="pullDownRefresh">
        <div class="before-trigger" v-if="beforePullDown">
          <span>{{ pullingDownText }}</span>
        </div>
        <div class="after-trigger" v-else>
          <div v-if="isPullingDown" class="loading">
            <loading></loading>
            <span>{{ puingDownLoadingText }}</span>
          </div>
          <div v-else><span>{{ loadingCompleteText }}</span></div>
        </div>
      </div>
      <!--滚动内容-->
      <slot></slot>
      <!--上拉加载-->
      <div class="pullup-wrapper" v-if="pullUpLoad">
        <div class="after-trigger" v-if="isPullUpLoad">
          <loading></loading>
          <span>{{ pullupLoadingText }}</span>
        </div>
        <div class="before-trigger" v-else>
          <span>{{ pullingUpText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Loading from 'base/loading/loading'

  const COMPONENT_NAME = 'scroll'
  const NO_MORE_DATA_TEXT = '没有更多数据了'
  const PULLING_DOWN_TEXT = '释放立即刷新...'
  const PULL_UP_LOADING_TEXT = '正在加载...'
  const PULL_DOWN_LOADING_TEXT = '正在刷新...'
  const LOADING_COMPLETE_TEXT = '加载完成...'

  export default {
    name: COMPONENT_NAME,
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      },
      bounce: {
        type: Boolean,
        default: true
      },
      pullDownRefresh: {
        type: Boolean,
        default: false
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      },
      listenScroll: {
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
    components: {
      Loading
    },
    data() {
      return {
        beforePullDown: true,
        isPullingDown: false,
        isPullUpLoad: false,
        scrollStart: false,
        pullUpDirty: true
      }
    },
    created() {
      this.pullupLoadingText = PULL_UP_LOADING_TEXT
      this.puingDownLoadingText = PULL_DOWN_LOADING_TEXT
      this.loadingCompleteText = LOADING_COMPLETE_TEXT
      this.pullDownThreshold = {
        threshold: 50,
        stop: 40
      }
      this.pullUpThreshold = {
        threshold: 50
      }
    },
    mounted() {
      this.$nextTick(this._initScroll())
    },
    computed: {
      pullingUpText() {
        return this.pullUpDirty ? '' : NO_MORE_DATA_TEXT
      },
      pullingDownText() {
        return this.scrollStart ? PULLING_DOWN_TEXT : ''
      }
    },
    methods: {
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
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        let options = {
          probeType: this.probeType,
          click: this.click,
          bounce: this.bounce,
          pullDownRefresh: this.pullDownRefresh ? this.pullDownThreshold : false,
          pullUpLoad: this.pullUpLoad ? this.pullUpThreshold : false
        }
        this.scroll = new BScroll(this.$refs.wrapper, options)
        console.log(this.scroll)
        if (this.pullDownRefresh) {
          this._initPullDownRefresh()
        }
        if (this.pullUpLoad) {
          this._initPullUpLoad()
        }
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      _initPullDownRefresh() {
        this.scroll.on('pullingDown', () => {
          this.beforePullDown = false
          this.isPullingDown = true
          this.$emit('pullingDown')
        })
        this.scroll.on('scrollStart', () => {
          this.scrollStart = true
        })
        this.scroll.on('scrollEnd', () => {
          this.scrollStart = false
        })
      },
      _initPullUpLoad() {
        this.scroll.on('pullingUp', () => {
          this.isPullUpLoad = true
          this.$emit('pullingUp')
        })
      },
      _reboundPullDown() {
        const stopTime = 600
        return new Promise((resolve) => {
          setTimeout(() => {
            this.scroll.finishPullDown()
            resolve()
          }, stopTime)
        })
      },
      _afterPullDown() {
        setTimeout(() => {
          this.beforePullDown = true
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
  .scroll-wrapper {
    .scroll-content {
      position: relative;
      .pulldown-wrapper {
        position: absolute;
        width: 100%;
        top: -30px;
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
      .pullup-wrapper {
        width: 100%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 16px 0;
        .after-trigger {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
</style>

<template>
  <!--scrollList组件，将列表组件和loadmore封装成一个组件-->
  <!--父组件通过props告诉子组件到vuex的特定getters去取数据-->
    <div class="scroll-list-wrapper">
      <mt-loadmore :top-method="_loadTop"
                   :topPullText="topPullText"
                   :topDropText="topDropText"
                   :topLoadingText="topLoadingText"
                   :topDistance="distance"
                   :bottom-method="_loadBottom"
                   :bottomAllLoaded="allLoaded"
                   :autoFill="false"
                   :bottomLoadingText="bottomLoadingText"
                   :bottomDistance="distance"
                   ref="loadmore">
        <!--会议列表-->
        <div v-for="(item, index) in listData" :key="index">
          <list-view :item="item"></list-view>
        </div>
      </mt-loadmore>
      <!--底部无更多数据-->
      <div v-show="noMore" class="pull-bottom-wrapper">
        <div class="pull-bottom">
          <span>没有更多数据了</span>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import ListView from '../../base/listView/listView'

  export default {
    name: 'scrollList',
    components: {
      ListView
    },
    props: {
      // list数据数组
      listData: {
        type: Array,
        default: function () {
          return {}
        }
      },
      // 是否还有更多数据
      noMore: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        topPullText: '下拉可以刷新',
        topDropText: '释放立即刷新',
        topLoadingText: '正在刷新...',
        distance: 50,
        allLoaded: false,
        bottomLoadingText: '正在加载...'
      }
    },
    methods: {
      // 触发下拉刷新事件
      _loadTop() {
        this.$emit('loadTop')
        this.$refs.loadmore.onTopLoaded()
      },
      // 触发上拉加载事件
      _loadBottom() {
        this.$emit('loadBottom')
        this.allLoaded = false
        this.$refs.loadmore.onBottomLoaded()
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';
  .scroll-list-wrapper {
    .pull-bottom-wrapper {
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      .pull-bottom {
        height: 24px;
        line-height: 24px;
        font-size: $font-size-medium;
        color: #777;
      }
    }
  }
</style>

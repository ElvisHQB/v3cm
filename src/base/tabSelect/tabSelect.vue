<template>
  <div class="tab-select">
    <div class="tab-bar">
      <div class="tab-item" v-for="(tab, index) in tabList" :key="index"
           :class="[tabIndex === tab.index ? 'active' : '']"
           @click="changeTab(tab)">{{ tab.name }}</div>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'tabSelect'
  const CHANGE_TAB_EVENT = 'changeTab'

  export default {
    name: COMPONENT_NAME,
    props: {
      tabList: {
        type: Array,
        default: function () {
          return []
        }
      },
      tabIndex: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {}
    },
    methods: {
      changeTab: function (tab) {
        this.$emit(CHANGE_TAB_EVENT, tab)
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $tab-item-height: 38px;
  $background-color: #fff;
  $tab-item-border-color: #dd2738;
  $tab-item-default-color: #999;
  $tab-item-active-color: #666;
  .tab-select {
    flex-direction: column;
    .tab-bar {
      display: flex;
      .tab-item  {
        flex: 1;
        text-align: center;
        line-height: $tab-item-height;
        height: $tab-item-height;
        color: $tab-item-default-color;
        border-bottom: 2px solid $background-color;
        font-size: $font-size-medium-x;
        background-color: $background-color;
      }
      .active {
        color: $tab-item-active-color;
        border-bottom: 2px solid $tab-item-border-color;
      }
    }
  }
</style>

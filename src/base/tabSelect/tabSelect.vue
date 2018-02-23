<template>
  <div class="tab-select">
    <div class="tab-bar">
      <div class="tab-bar-nav">
        <div class="tab-item" v-for="(tab, index) in tabList" :class="[tabIndex === tab.index ? 'active' : '']"
          v-bind:key="index" @click="changeTab(tab)">{{ tab.name }}</div>
      </div>
    </div>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'tabSelect',
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
        this.$emit('changeTab', tab)
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $meetingDetail-color: #dd2738;
  $background-color: #fff;
  .tab-select {
    flex-direction: column;
    .tab-bar {
      .tab-bar-nav {
        display: flex;
        .tab-item  {
          flex: 1;
          text-align: center;
          line-height: 38px;
          height: 38px;
          color: #999;
          border-bottom: 3px solid $background-color;
          font-size: 16px;
          background-color: $background-color;
        }
        .active {
          color: #666;
          border-bottom: 3px solid $meetingDetail-color;
        }
      }
    }
  }
</style>

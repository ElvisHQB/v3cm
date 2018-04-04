<template>
  <div class="popup-wrapper" v-show="show">
    <slot></slot>
    <div class="popup-shadow" v-show="show" @click="onClick"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      show() {
        return this.value
      }
    },
    methods: {
      onClick() {
        this.$emit('input', false)
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable.scss";
  .popup-wrapper {
    position: fixed;
    bottom: 0;
    z-index: $z-index-level-9;
    .popup-shadow {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: $z-index-level-0;
      opacity: 0.2;
      position: fixed;
      bottom: 0;
    }
  }
</style>

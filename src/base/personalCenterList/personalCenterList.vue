<template>
  <div class="per-center-list" @click="_userAction()">
    <i class="list-icon-type" :class="iconTypeClass"></i>
    <span class="list-name">{{listName}}</span>
    <div class="list-num">
      <span>{{listNum}}</span>
    </div>
    <i class="list-icon-more" :class="moreClass"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'personal-center-list',
    props: {
      iconTypeClass: '',
      listName: '',
      listNum: '',
      moreClass: ''
    },
    data() {
      return {
      }
    },
    methods: {
      _userAction() {
        // TODO 功能点
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";

  $color: #5470b5;
  $line-height: 24px;

  .per-center-list {
    height: 24px;
    padding: 11px 15px;
    display: flex;
    border-bottom: 1px solid lightgrey;
    background-color: white;
    font-size: 17px;
    color: $color;
    font-family: $font-family;

    .list-icon-type {
      line-height: $line-height;
      flex-grow: 0.05;
    }

    .list-name {
      line-height: $line-height;
      color: #000;
      flex-grow: 1.5;
    }

    .list-num {
      margin-top: 2px;
      line-height: 18px;
      height: 18px;
      min-width: 10px;
      padding: 0 5px;
      border: 1px solid $color;
      border-radius: 10px;
      background-color: $color;
      font-size: $font-size-small;
      color: white;
      text-align: center;
    }

    .list-icon-more {
      line-height: 24px;
      color: #bbb;
    }
  }

</style>

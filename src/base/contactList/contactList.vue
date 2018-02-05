<template>
  <scroll :data="data" class="contact-list" ref="contactList">
    <ul>
      <li v-for="(group, index) in data" class="list-group" v-bind:key="index" ref="listGroup">
        <div class="list-group-key">{{ group.key }}</div>
        <ul>
          <li v-for="(item, index) in group.userList" class="list-group-item" v-bind:key="index" @click="onClickItem" :data-index="index">
            <div class="list-item-checkbox">
              <label><input type="checkbox" :checked="checked" /><span></span></label>
            </div>
            <div class="list-item-img-wrapper">
              <!--懒加载-->
              <img src="../../assets/default_head.png" />
            </div>
            <div>
              <!--TODO -->
              <p>{{ item.userName }}</p>
              <p>{{ item.company }}</p>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut-list" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList"
            v-bind:key="index"
            class="shortcut-item"
            :data-index="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'

  const ANCHOR_HEIGHT = 18
  export default {
    components: {
      Scroll
    },
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
//        checked: false
      }
    },
    created() {
      //不需要观测，直接加到这里
      this.touch = {}
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.key
        })
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = e.target.getAttribute('data-index')
        console.log(anchorIndex)
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
      },
      _scrollTo(index) {
        this.$refs.contactList.scrollToElement(this.$refs.listGroup[index], 0)
      },
      onClickItem(e) {
        // TODO
//        let anchorIndex = e.target.getAttribute('data-index')
        console.log('click on item')
        this.checked = !this.checked
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";

  .contact-list {
    background-color: #efeff4;
    width: 100%;
    height: 100%;
    .list-group {
      background-color: #f7f7f7;
      .list-group-key {
        padding: 3px 20px;
        font-weight: 500;
        font-size: 16px;
      }
      .list-group-item {
        display: flex;
        flex-direction: row;
        padding: 11px 20px;
        margin-top: 6px;
        background-color: #fff;
        /* span 模拟 CheckBox */
        .list-item-checkbox {
          position: relative;
          padding:0 10px 0 25px;
          cursor: pointer;
          input {
            display: none;
          }
          span {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 24px;
            height: 24px;
            margin: auto;
            border: 1px solid #bbb;
            border-radius: 100%;
          }
          span:after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 6px;
            height: 6px;
            margin: auto;
            border-radius: 100%;
            background: #fff;
            -webkit-transform: scale(0);
            transform: scale(0);
            -webkit-transition: all .3s;
            transition: all .3s;
          }
          input:checked + span {
            border-color: $color-theme;
            background: $color-theme;
          }
          input:checked + span:after {
            -webkit-transform: scale(1);
            transform: scale(1);
          }
        }
        .list-item-img-wrapper {
          margin-right: 10px;
          img {
            border: 2px solid #e5edff;
            border-radius: 50%;
            width: 42px;
            height: 42px;
          }
        }
      }
    }
    .shortcut-list {
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      width: 23px;
      background-color: lightgrey;
      text-align: center;
      .shortcut-item {
        padding: 3px;
      }
    }
  }
</style>

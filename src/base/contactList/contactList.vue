<template>
  <div class="contact-list-wrapper">
    <scroll :data="contactList" class="contact-list" ref="contactList">
      <ul>
        <li v-for="(group, index) in contactList" class="list-group" v-bind:key="index" ref="listGroup">
          <div class="list-group-key">{{ group.key }}</div>
          <ul>
            <li v-for="(item, index) in group.userList" class="list-group-item"
                v-bind:key="index" @click.prevent="onClickItem($event.currentTarget)" :data-key="group.key"
                :data-index="index" :data-item="JSON.stringify(item)">
              <div class="list-item-checkbox">
                  <input type="checkbox" :checked="false" />
                  <span class="span-checkbox">
                    <span class="icon-wrapper"><i class="icon-xuanzhong"></i></span>
                  </span>
              </div>
              <div class="list-item-img-wrapper">
                <!--懒加载-->
                <img :src="'data:image/png;base64,' + item.avatar" v-if="item.avatar"/>
                <img src="../../assets/default_head.png" v-else/>
              </div>
              <div class="list-item-detail-info">
                <!--TODO 有公司渲染公司，无公司渲染电话-->
                <p class="name">{{ item.name }}</p>
                <p class="company" v-if="item.company">{{ item.company }}</p>
                <p class="phoneNum" v-else>{{ item.phoneNum }}</p>
              </div>
            </li>
          </ul>
        </li>
      </ul>
      <!--TODO v-bind:style="{ top: '40%' }"-->
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
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from '../../base/scroll/scroll'
  import { ADD_ATTENDANCE_TO_LIST, REMOVE_ATTENDANCE_FROM_LIST } from '../../store/mutation-types'
  import { CONTACT_TYPE } from '../../api/config'

  const ANCHOR_HEIGHT = 18
  export default {
    components: {
      Scroll
    },
    props: {
      //列表类型 'iWand', 'phone'
      contactType: {
        type: String,
        default: function () {
          return ''
        }
      }
    },
    data() {
      return {
      }
    },
    created() {
      //不需要观测，直接加到这里
      this.touch = {}
    },
    computed: {
      contactList() {
        if (this.contactType === CONTACT_TYPE.iWand) {
          return this.$store.getters.iWandContactList
        } else if (this.contactType === CONTACT_TYPE.phone) {
          return this.$store.getters.phoneContactList
        } else {
          return []
        }
      },
      shortcutList() {
        return this.contactList.map((group) => {
          return group.key
        })
      },
      attendanceList() {
        if (this.contactType === CONTACT_TYPE.iWand) {
          return this.$store.getters.attendanceList.iWandList
        } else if (this.contactType === CONTACT_TYPE.phone) {
          return this.$store.getters.attendanceList.phoneList
        } else {
          return []
        }
      }
//      itemChecked: {
//        get() {
//          console.log(this.attendanceList)
//          for (let attendance of this.attendanceList) {
//            console.log(attendance)
//            if (this.item.phoneNum === attendance.phoneNum) {
//              return true
//            }
//          }
//          return false
//        },
//        set(item) {
//          this.item = item
//        }
//      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = e.target.getAttribute('data-index')
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
      onClickItem(el) {
        // TODO
        let checkbox = el.childNodes[0].childNodes[0]
        let attendance = JSON.parse(el.getAttribute('data-item'))
        let payload = {
          attendance: attendance,
          contactType: this.contactType
        }
        if (checkbox.checked) {
          //取消选中
          this.$store.commit(REMOVE_ATTENDANCE_FROM_LIST, payload)
        } else {
          //选中
          this.$store.commit(ADD_ATTENDANCE_TO_LIST, payload)
        }
        //更改checkbox的状态
        checkbox.checked = !checkbox.checked
        console.log(this.$store.getters.attendanceList.iWandList)
      }
//      itemChecked(item) {
//        for (let contact of this.contactList) {
//          if (item.phoneNum === contact.phoneNum) {
//            return true
//          }
//        }
//        return false
//      }
    },
    watch: {
//      '$'
    },
    activated() {
      // TODO 进入渲染显示已选。先从Vuex中取attendanceList，再渲染选中
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../common/scss/variable";
  $fixed-wrapper-height: 550px;
  @mixin item-more-info {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 21px;
    line-height: 21px;
    width: 100%;
  }
  .contact-list-wrapper {
    .contact-list {
      background-color: #efeff4;
      width: 100%;
      //TODO 固定高度？
      height: $fixed-wrapper-height;
      overflow: hidden;
      .list-group {
        background-color: #eee;
        .list-group-key {
          padding: 3px 20px 0 20px;
          font-size: 16px;
          background-color: #eee;
        }
        .list-group-item {
          display: flex;
          flex-direction: row;
          padding: 8px 40px 8px 20px;
          margin-top: 3px;
          background-color: #fff;
          /* span 模拟 CheckBox */
          .list-item-checkbox {
            position: relative;
            padding: 0 10px 0 25px;
            cursor: pointer;
            .span-checkbox {
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 22px;
              height: 22px;
              margin: auto;
              border: 1px solid #bbb;
              border-radius: 100%;
              text-align: center;
              .icon-wrapper {
                display: none;
              }
            }
            input {
              display: none;
            }
            input:checked + .span-checkbox {
              border: none;
              .icon-wrapper {
                display: inline;
                color: #dd2738;
                font-size: 24px;
              }
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
          .list-item-detail-info {
            width: 220px;
            /*width: 100%;*/
            .name {
              @include item-more-info;
              font-size: 16px;
              color: #000;
            }
            .company {
              @include item-more-info;
              font-size: 14px;
              color: #999;
            }
            .phoneNum {
              @include item-more-info;
              font-size: 14px;
              color: #999;
            }
          }
        }
      }
      .shortcut-list {
        position: absolute;
        z-index: 30;
        right: 0;
        //TODO 动态定位
        top: 40%;
        width: 24px;
        background-color: lightgrey;
        text-align: center;
        .shortcut-item {
          padding: 0 3px;
          height: 20px;
        }
      }
    }
  }
</style>

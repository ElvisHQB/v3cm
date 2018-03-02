<template>
  <div class="contact-list-wrapper">
    <!--搜索-->
    <div class="search-contact">
      <div class="search-input" v-show="searchInput">
            <span class="search-input-icon">
              <i class="icon-fangdajing"></i>
            </span>
        <!--TODO form标签包裹？-->
        <!--通过@input, :value模拟v-model实现数据双向绑定-->
        <input type="search" @input="searchStr = $event.target.value" :value="searchStr" placeholder="搜索" />
        <span class="search-input-clear" @click="searchStr = ''">
          <i class="icon-clear" v-show="searchStr"></i>
        </span>
      </div>
      <div class="search-span" @click="searchInput = true" v-show="!searchInput">
        <span><i class="icon-fangdajing"></i></span>
        <span>搜索</span>
      </div>
    </div>
    <!--滚动列表-->
    <scroll :data="searchedContactList" class="contact-list" ref="contactList">
      <div class="search-no-data" v-if="noData">
        <span>没有数据</span>
      </div>
      <ul v-else>
        <li v-for="(group, index) in searchedContactList" class="list-group" v-bind:key="index" ref="listGroup">
          <div class="list-group-key">{{ group.key }}</div>
          <ul>
            <li v-for="(item, index) in group.userList" class="list-group-item"
                v-bind:key="index" @click.prevent="onClickItem($event.currentTarget)" :data-key="group.key"
                :data-index="index" :data-item="JSON.stringify(filterItem(item))">
              <div class="list-item-checkbox">
                  <!--<input type="checkbox" :checked="false" />-->
                <input type="checkbox" :checked="itemChecked(item)" />
                  <span class="span-checkbox">
                    <span class="icon-wrapper"><i class="icon-xuanzhong"></i></span>
                  </span>
              </div>
              <div class="list-item-img-wrapper">
                <!--懒加载-->
                <img :src="'data:image/png;base64,' + item.avatar" v-if="item.avatar"/>
                <img src="../../../assets/default_head.png" v-else/>
              </div>
              <div class="list-item-detail-info">
                <!--有公司渲染公司，无公司渲染电话-->
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
  import Scroll from 'base/scroll/scroll'
  import { ADD_ATTENDANCE_TO_LIST, REMOVE_ATTENDANCE_FROM_LIST } from '../../../store/mutation-types'
  import { CONTACT_TYPE } from 'api/config'
  import pinyin from 'common/js/pin-yin'
  import { isStartWithChinese, isStartWithEnglish } from 'common/js/utils'

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
        searchedContactList: [],
        //渲染搜索Input框
        searchInput: false,
        //搜索字符串
        searchStr: '',
        noData: false
      }
    },
    created() {
      //不需要观测，直接加到这里
      this.touch = {}
      this.searchedContactList = this.contactList
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
        return this.$store.getters.attendanceList
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = e.target.getAttribute('data-index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      //TODO 滑动
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
//        checkbox.checked = !checkbox.checked
      },
      itemChecked(item) {
        for (let attendance of this.attendanceList) {
          //区分iWand联系人与临时联系人
          if (item.phoneNum === attendance.phoneNum && item.imId === attendance.imId) {
            return true
          }
        }
        return false
      },
      filterItem(item) {
        let i = {}
        i.imId = item.imId
        i.name = item.name
        i.company = item.company
        i.phoneNum = item.phoneNum
        return i
      }
    },
    watch: {
      'searchStr': function () {
        let searchStr = this.searchStr
        if (searchStr === '') {
          this.searchedContactList = this.contactList
          this.noData = false
          return
        }
        //遍历列表，判断每个联系人的name与搜索字符串是否匹配，
        // 若匹配则将对应的userGroup push到contactList
        let contactList = []
        for (let group of this.contactList) {
          let userGroup = {}
          userGroup.key = group.key
          userGroup.userList = []
          for (let u of group.userList) {
            let name = ''
            if (isStartWithChinese(searchStr)) {
              //中文
              name = u.name
            } else if (isStartWithEnglish(searchStr)) {
              //英文，拼音，都以小写处理
              name = pinyin.getFullChars(u.name).toLowerCase()
              searchStr = searchStr.toLowerCase()
            }
            if (name.includes(searchStr)) {
              userGroup.userList.push(u)
            }
          }
          if (userGroup.userList.length !== 0) {
            contactList.push(userGroup)
          }
        }
        this.noData = contactList.length === 0
        this.searchedContactList = contactList
      },
      'contactList': function () {
        this.searchedContactList = this.contactList
      }
    },
    activated() {
      this.searchInput = false
      this.searchedContactList = this.contactList
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import "../../../common/scss/variable";
  $fixed-wrapper-height: 550px;
  $search-contact-height: 34px;
  $background-color: #fff;
  $border-color: #e3e3e3;
  $icon-font-size: 20px;
  $icon-font-color: #999;
  $search-no-data-color: #bbb;
  $list-group-background-color: #eee;
  $list-background-color: #fff;
  $list-item-img-size: 42px;
  @mixin item-more-info {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    height: 21px;
    line-height: 21px;
    width: 100%;
  }
  @mixin vertical-center {
    height: $search-contact-height;
    line-height: $search-contact-height;
  }
  .contact-list-wrapper {
    .search-contact {
      height: $search-contact-height;
      background-color: $background-color;
      border-top: solid 1px $border-color;
      border-bottom: solid 1px $border-color;
      .search-input {
        @include vertical-center;
        width: 100%;
        display: flex;
        .search-input-icon, .search-input-clear {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        input {
          flex: 8;
          outline: none;
          font-size: $font-size-medium-x;
          -webkit-appearance: none;
        }
        input[type="search"]::-webkit-search-cancel-button{
          display: none;
        }
        .icon-fangdajing, .icon-clear {
          font-size: $icon-font-size;
          color: $icon-font-color;
        }
      }
      .search-span {
        @include vertical-center;
        text-align: center;
        font-size: $font-size-medium-x;
        .icon-fangdajing {
          font-size: $icon-font-size;
        }
      }
    }
    .contact-list {
      /*background-color: #efeff4;*/
      width: 100%;
      //TODO 固定高度？
      height: $fixed-wrapper-height;
      overflow: hidden;
      .search-no-data {
        padding: 30px 15px;
        text-align: center;
        font-size: $font-size-medium;
        color: $search-no-data-color;
      }
      .list-group {
        background-color: $list-group-background-color;
        .list-group-key {
          padding: 3px 20px 0 20px;
          font-size: $font-size-medium-x;
          background-color: $list-group-background-color;
        }
        .list-group-item {
          display: flex;
          flex-direction: row;
          padding: 8px 40px 8px 20px;
          margin-top: 3px;
          background-color: $list-background-color;
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
                color: $color-theme;
                font-size: $icon-size-large;
              }
            }
          }
          .list-item-img-wrapper {
            margin-right: 10px;
            img {
              border: 2px solid $list-background-color;
              border-radius: 50%;
              width: $list-item-img-size;
              height: $list-item-img-size;
            }
          }
          .list-item-detail-info {
            width: 220px;
            .name {
              @include item-more-info;
              font-size: $font-size-medium-x;
              color: #000;
            }
            .company {
              @include item-more-info;
              font-size: $font-size-medium;
              color: #999;
            }
            .phoneNum {
              @include item-more-info;
              font-size: $font-size-medium;
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

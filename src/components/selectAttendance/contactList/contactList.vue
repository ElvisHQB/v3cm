<template>
  <div class="contact-list-wrapper">
    <!--搜索-->
    <div class="search-contact">
      <div class="search-input"
           v-show="searchInput">
            <span class="search-input-icon">
              <i class="icon-fangdajing"></i>
            </span>
        <!--TODO form标签包裹？-->
        <!--通过@input, :value模拟v-model实现数据双向绑定-->
        <input type="search"
               @input="searchStr = $event.target.value"
               :value="searchStr"
               placeholder="搜索" />
        <span class="search-input-clear" @click="searchStr = ''">
          <i class="icon-clear" v-show="searchStr"></i>
        </span>
      </div>
      <div class="search-span"
           @click="searchInput = true"
           v-show="!searchInput">
        <span><i class="icon-fangdajing"></i></span>
        <span>搜索</span>
      </div>
    </div>
    <!--滚动列表-->
    <div class="contact-list" :style="scrollStyle">
      <scroll :data="contactList"
              :probeType="probeType"
              :listenScroll="listenScroll"
              @scroll="scroll"
              class="scroll-list"
              ref="scrollList">
        <div class="search-no-data" v-if="noData">
          <span>没有数据</span>
        </div>
        <ul v-else>
          <li v-for="(group, index) in contactList"
              :key="index"
              class="list-group"
              ref="listGroup">
            <div class="list-group-key">{{ group.key }}</div>
            <ul>
              <li v-for="(item, index) in group.userList"
                  class="list-group-item"
                  :key="index"
                  :data-key="group.key"
                  :data-index="index"
                  :data-item="JSON.stringify(_filterItem(item))"
                  @click.prevent="onClickItem($event.currentTarget)">
                <div class="list-item-checkbox">
                  <input type="checkbox" :checked="_itemChecked(item)" />
                  <span class="span-checkbox">
                    <span class="icon-wrapper"><i class="icon-xuanzhong"></i></span>
                  </span>
                </div>
                <div class="list-item-img-wrapper">
                  <img :src="'data:image/png;base64,' + (item.avatar ? item.avatar : defaultAvatar)" v-if="item.imId"/>
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
      </scroll>
      <div class="shortcut-list"
           @touchstart="onShortcutTouchStart"
           @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
          <li v-for="(item, index) in shortcutList"
              :key="index"
              :data-index="index"
              :class="[{'current': currentIndex === index}, 'item']">
            {{ item }}
          </li>
        </ul>
      </div>
      <div class="list-fixed" ref="fixed" v-show="fixedTitle">
        <h1 class="fixed-title">{{ fixedTitle }}</h1>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import { ADD_ATTENDANCE_TO_LIST, REMOVE_ATTENDANCE_FROM_LIST } from 'store/mutation-types'
  import pinyin from 'common/lib/js/pin-yin'
  import { isStartWithChinese, isStartWithEnglish } from 'common/js/utils'
  import { defaultHead, HEADER_HEIGHT } from 'api/config'
  import { mapGetters } from 'vuex'

  const TAB_SELECT_HEIGHT = 40
  const SEARCH_CONTACT_HEIGHT = 36
  const SHORTCUT_ITEM_HEIGHT = 20
  const TITLE_HEIGHT = 21

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
        currentIndex: 0, //当前滚到的group
        contactList: [],
        //渲染搜索Input框
        searchInput: false,
        //搜索字符串
        searchStr: '',
        noData: false,
        scrollY: -1,
        diff: -1
      }
    },
    created() {
      //不需要观测，直接加到这里
      this.probeType = 3 //立即派发滚动事件
      this.listenScroll = true //监听滚动事件
      this.listHeight = []
      this.touch = {}
      this.contactList = this.data
      this.defaultAvatar = defaultHead
      console.log('contact list created...')
    },
    computed: {
      ...mapGetters([
        'attendanceList',
        'searchedContactList',
        'appInfo'
      ]),
      shortcutList() {
        return this.contactList.map((group) => {
          return group.key
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.contactList[this.currentIndex] ? this.contactList[this.currentIndex].key : ''
      },
      scrollStyle() {
        const scrollHeight = this.appInfo.height - HEADER_HEIGHT - TAB_SELECT_HEIGHT - SEARCH_CONTACT_HEIGHT
        return 'height:' + scrollHeight + 'px'
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = parseInt(e.target.getAttribute('data-index'))
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / SHORTCUT_ITEM_HEIGHT | 0 //或零取整
        let anchorIndex = this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
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
      scroll(pos) {
        this.scrollY = pos.y
      },
      _itemChecked(item) {
        for (let attendance of this.attendanceList) {
          //区分iWand联系人与临时联系人
          // TODO 处理临时联系人及联系人去重的问题
          if (item.phoneNum === attendance.phoneNum && item.imId === attendance.imId) {
            return true
          }
        }
        return false
      },
      _filterItem(item) {
        let i = {}
        i.imId = item.imId
        i.name = item.name
        i.company = item.company
        i.phoneNum = item.phoneNum
        return i
      },
      _scrollTo(index) {
        const listLen = this.listHeight.length
        index = index < 0 ? 0 : (index > listLen - 2 ? listLen - 2 : index)
        const maxScrollHeight = this.listHeight[listLen - 1] - this.$refs.scrollList.$el.clientHeight
        this.scrollY = this.listHeight[index] > maxScrollHeight ? -maxScrollHeight : -this.listHeight[index]
        this.$refs.scrollList.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        console.log('in _calculateHeight...')
        this.listHeight = []
        const list = this.$refs.listGroup
        if (list === undefined) { // listGroup渲染前,不做处理
          return
        }
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
        console.log('list height: ')
        console.log(this.listHeight)
      }
    },
    watch: {
      searchStr(newVal) {
        let searchStr = newVal
        if (searchStr === '') {
          this.noData = false
          this.searched = false
          this.contactList = this.data
          return
        }
        //遍历列表，判断每个联系人的name与搜索字符串是否匹配，
        // 若匹配则将对应的userGroup push到contactList
        let contactList = []
        for (let group of this.data) {
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
        this.contactList = contactList
        this.searched = true
      },
      scrollY(newY) {
//        console.log('scrollY: ' + newY)
        const listHeight = this.listHeight

        if (newY > 0) {
          this.currentIndex = 0
          return
        }

        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }

        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
      },
      contactList(newVal) {
        console.log('contact list change...')
        console.log(newVal)
        this.$nextTick(() => {
          this._calculateHeight()
        })
      },
      data(newVal) {
        this.contactList = newVal
      }
    },
    activated() {
      this.searchInput = false
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
  $shortcut-list-color: #000;
  $shortcut-item-size: 20px;
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
      width: 100%;
      overflow: hidden;
      position: relative;
      .scroll-list {
        height: 100%;
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
      }
      .shortcut-list {
        //块级元素垂直居中
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 30;
        right: 0;
        width: $shortcut-item-size;
        color: $shortcut-list-color;
        /*background-color: lightgrey;*/
        text-align: center;
        .item {
          height: $shortcut-item-size;
          line-height: $shortcut-item-size;
          border-radius: 100%;
        }
        .current {
          background-color: rgba(99, 154, 238, 0.44);
        }
      }
      .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        .fixed-title {
          padding: 3px 20px 0 20px;
          font-size: $font-size-medium-x;
          background-color: $list-group-background-color;
        }
      }
    }
  }
</style>

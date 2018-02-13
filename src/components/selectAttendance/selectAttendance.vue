<template>
  <div class="select-attendance">
    <tab-select :tabList="tabList" :tabIndex="tabIndex" @changeTab="_changeTab">
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
      <keep-alive>
        <component :is="currentContent"></component>
      </keep-alive>
    </tab-select>
  </div>
</template>
<script type="text/ecmascript-6">
  import TabSelect from '../../base/tabSelect/tabSelect'
  import phoneContact from './phoneContact'
  import iWandContact from './iWandContact'

  export default {
    name: 'selectAttendance',
    components: {
      TabSelect,
      phoneContact,
      iWandContact
    },
    data() {
      return {
        tabIndex: 1,
        currentContent: 'iWandContact',
        tabList: [
          {
            index: 0,
            name: '手机通讯录',
            component: 'phoneContact'
          },
          {
            index: 1,
            name: 'iWand好友',
            component: 'iWandContact'
          }
        ],
        //渲染搜索Input框
        searchInput: false,
        //搜索字符串
        searchStr: ''
      }
    },
    methods: {
      _changeTab(tab) {
        this.tabIndex = tab.index
        this.currentContent = tab.component
      }
    },
    watch: {
      'searchStr': function () {
        //TODO 实时搜索展示
        console.log(this.searchStr)
        //
      }
    },
    activated() {
      this.searchInput = false
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $search-contact-height: 34px;
  $background-color: #fff;
  $border-color: #e3e3e3;
  @mixin vertical-center {
    height: $search-contact-height;
    line-height: $search-contact-height;
  }
  .select-attendance {
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
          font-size: 16px;
          /*-webkit-appearance: none;*/
        }
        input[type="search"]::-webkit-search-cancel-button{
          display: none;
        }
        .icon-fangdajing, .icon-clear {
          font-size: 20px;
          color: #999;
        }
      }
      .search-span {
        @include vertical-center;
        text-align: center;
        font-size: 16px;
        .icon-fangdajing {
          font-size: 20px;
        }
      }
    }
  }
</style>

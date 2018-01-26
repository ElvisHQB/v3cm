<template>
  <div class="search-wrapper">
    <!--搜索历史-->
    <div v-if="renderHistory" class="search-history">
      <div class="search-history-title">
        <span class="icon-xinxi"></span> 历史搜索
      </div>
      <div class="search-history-items">
        <span v-for="(item, index) in histories" :key="index" @click="_searchHistory(item)" class="search-history-item">{{ item }}</span>
      </div>
      <div class="clear-search-history">
        <span class="clear-history-button" @click="_clearHistory">清除历史搜索记录</span>
      </div>
    </div>
    <!--搜索结果-->
    <div v-if="searched" class="search-result">
      <!--搜索结果列表-->
      <div v-if="hasResult">
        <!--搜索结果列表-->
        <scroll-list :listData="$store.getters.searchMeetingList" v-on:loadTop="_searchMeeting"  v-on:loadBottom="_searchMeeting"></scroll-list>
      </div>
      <!--无结果的空列表-->
      <div v-else class="empty-result-list">
        <span>没有搜索到相关会议</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import ScrollList from '../../base/scrollList/scrollList'
  import { searchMeetingUrl } from 'api/config'
  import api from 'api/fetchData'
  import { SET_SEARCH_MEETING_LIST } from '../../store/mutation-types'
//  import { localStorageUtils } from '../../common/js/utils'
  export default {
    name: 'search',
    components: {
      ScrollList
    },
    data() {
      return {
        // TODO 搜索记录存入localStorage，进入页面后从localStorage取一次
        histories: [
//          '金',
//          '银',
//          '会议',
//          '分析师',
//          '历史',
//          '价值投资',
//          '如何合理进行价值投资'
        ],
        // 是否进行的搜索动作
        searched: false,
        hasResult: true
      }
    },
    created() {
      this.init()
    },
    computed: {
      // 搜索历史不为空且还没进行搜索，渲染显示搜索历史
      renderHistory() {
        return (this.histories.length > 0) && (!this.searched)
      }
    },
    methods: {
      init() {
//        this.histories = localStorageUtils.getItem('searchHistory')
        this._getHistory()
      },
      //获取搜索历史
      _getHistory() {
        //
        var val = JSON.parse(localStorage.getItem('searchHistory'))
        this.histories = (val === null) ? [] : val
      },
      //设置存储搜索历史
      _setHistory(str) {
        //
        if (str !== '' && !this.histories.includes(str)) {
          // TODO 搜索历史排序
          this.histories.push(str)
          this.histories.reverse()
          localStorage.setItem('searchHistory', JSON.stringify(this.histories))
        }
      },
      //清除搜索历史记录
      _clearHistory() {
        localStorage.removeItem('searchHistory')
        this._getHistory()
      },
      //点击历史搜索进行搜索
      _searchHistory(item) {
        this._searchMeeting(item)
      },
      //搜索会议
      _searchMeeting(searchStr) {
        this.searched = true
        this._setHistory(searchStr)
        console.log(searchStr)
        console.log('this search meeting from search...')
        const url = searchMeetingUrl
        let params = {
          'criteria': {
            'category': [],
            'field': [],
            'lecturer': searchStr,
            'name': searchStr,
            'sponsor': searchStr
          },
          'isPaging': true,
          'pageSize': 10,
          'currentPage': 1
        }
        return api.getData(url, 'post', params)
          .then((res) => {
            if (res.count <= 0) {
              this.hasResult = false
            }
            this.$store.commit(SET_SEARCH_MEETING_LIST, {meetingList: res.list})
          }).catch((e) => {
            console.log(e)
//            console.log(ERR_CODE)
          })
      }
    },
    watch: {
      //搜索字符串变化，调用搜索
      '$store.getters.searchStr': function () {
        this._searchMeeting(this.$store.getters.searchStr)
      }
    },
    // keep alive会通过将实例在activated和deactivated中切换来缓存组件的Vue实例，而不会销毁。
    activated () {
      this.searched = false
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';
  $search-history-items-color: #f2f2f2;
  $clear-history-button-color: #dd524d;
  $search-history-item-color: rgba(173, 173, 173, 0.44);
  //$search-header-height: 44px;
  //$search-header-color: #dd2738;
  .search-wrapper {
    .search-history {
      font-size: $font-size-medium;
      display: flex;
      flex-direction: column;
      .search-history-title {
        margin: 10px;
        color: $color-background;
        font-size: $font-size-large;
      }
      .search-history-items {
        background-color: $search-history-items-color;
        .search-history-item {
          display: inline-block;
          padding: 5px;
          border: 1px solid $search-history-item-color;
          border-radius: 4px;
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 80px;
          margin: 10px 16px;
          text-align: center;
        }
      }
      .clear-search-history {
        display: flex;
        justify-content: center;
        .clear-history-button {
          border: 1px solid;
          padding: 4px 8px;
          border-radius: 4px;
          color: $clear-history-button-color;
        }
      }
    }
    .search-result {
      .empty-result-list {
        font-size: $font-size-medium-x;
        color: #ccc;
        display: flex;
        justify-content: center;
        justify-items: center;
        margin: 20px 0;
      }
    }
  }
</style>

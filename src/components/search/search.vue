<template>
  <div class="search-wrapper">
    <!--搜索历史-->
    <div v-show="renderHistory" class="search-history">
      <div class="search-history-title">
        <span>历史搜索</span>
        <span @click="_clearHistory">清除</span>
      </div>
      <div class="search-history-items">
        <span v-for="(item, index) in histories" :key="index"
              @click="_searchHistory(item)"
              class="search-history-item">
          {{ item }}
        </span>
      </div>
    </div>
    <!--搜索结果-->
    <div v-show="searched" class="search-result">
      <!--搜索结果列表-->
      <div v-show="hasResult">
        <!--搜索结果列表-->
        <scroll :data="searchMeetingList" :pullDownRefresh="true" :pullUpLoad="true"
                @pullingDown="_searchMeeting(searchStr, 1)"
                @pullingUp="_searchMeeting(searchStr, currentPage + 1)"
                :style="scrollStyle" ref="scroll">
          <div>
            <list-view :item="item" v-for="(item, index) in searchMeetingList" :key="index"></list-view>
          </div>
        </scroll>
      </div>
      <!--无结果的空列表-->
      <div class="empty-result-list" v-show="!hasResult">
        <span>没有搜索到相关会议</span>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import ListView from 'base/listView/listView'
  import { searchMeetingUrl, HEADER_HEIGHT } from 'api/config'
  import api from 'api/fetchData'
  import { Meeting } from 'common/js/utils'
  import { mapGetters, mapMutations } from 'vuex'

  const COMPONENT_NAME = 'search'

  export default {
    name: COMPONENT_NAME,
    components: {
      Scroll,
      ListView
    },
    data() {
      return {
        histories: [],
        // 是否进行的搜索动作
        searched: false,
        hasResult: true,
        currentPage: 1,
        noMoreData: false,
        searchStr: '',
        searchMeetingList: []
      }
    },
    created() {
      this._initSearch()
    },
    computed: {
      ...mapGetters([
        'headerSearchStr',
        'appInfo'
      ]),
      // 搜索历史不为空且还没进行搜索，渲染显示搜索历史
      renderHistory() {
        return (this.histories.length > 0) && (!this.searched)
      },
      noMore() {
        return this.hasResult && this.noMoreData
      },
      scrollStyle() {
        const scrollHeight = this.appInfo.height - HEADER_HEIGHT
        return 'height:' + scrollHeight + 'px'
      }
    },
    methods: {
      ...mapMutations({
        setHeaderSearchStr: 'SET_HEADER_SEARCH_STR'
      }),
      _initSearch() {
        this.searched = false
        this.hasResult = true
        this.noMoreData = false
        this.searchMeetingList = []
        this._getHistory()
      },
      //获取搜索历史
      _getHistory() {
        let val = JSON.parse(localStorage.getItem('searchHistory'))
        this.histories = (val === null) ? [] : val
      },
      //设置存储搜索历史
      _setHistory(str) {
        if (str.trim().length === 0) {
          return
        }
        let arr = []
        arr.push(str)
        for (let item of this.histories) {
          if (item !== str) {
            arr.push(item)
          }
        }
        localStorage.setItem('searchHistory', JSON.stringify(this.histories))
      },
      //清除搜索历史记录
      _clearHistory() {
        localStorage.removeItem('searchHistory')
        this._getHistory()
      },
      //点击历史搜索进行搜索
      _searchHistory(item) {
        this.setHeaderSearchStr(item)
        this._searchMeeting(item, 1)
      },
      //搜索会议
      _searchMeeting(searchStr, currentPage) {
        if (this.noMore) {
          this.$refs.scroll.forceUpdate(false)
          return
        }
        this.currentPage = currentPage
        this.searched = true
        this._setHistory(searchStr)
        const url = searchMeetingUrl
        let params = {
          criteria: {
            category: [],
            field: [],
            lecturer: searchStr,
            name: searchStr,
            sponsor: searchStr
          },
          isPaging: true,
          pageSize: 10,
          currentPage: currentPage
        }
        api.getData(url, 'post', params)
          .then((res) => {
            this.hasResult = res.count > 0
            let meetingList = []
            for (let meeting of res.list) {
              meetingList.push(new Meeting(meeting))
            }
            this.noMoreData = meetingList.length < 10
            if (currentPage === 1) {
              this.searchMeetingList = meetingList
            } else {
              this.searchMeetingList.concat(meetingList)
            }
          }).catch((e) => {
            console.log(e)
          })
      }
    },
    watch: {
      headerSearchStr(newVal) {
        this.searchStr = newVal
        this._searchMeeting(newVal, 1)
      }
    },
    // keep alive会通过将实例在activated和deactivated中切换来缓存组件的Vue实例，而不会销毁。
    activated () {
      this._initSearch()
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';
  $search-history-items-color: #f2f2f2;
  $clear-history-button-color: #dd524d;
  $empty-result-list-color: #ccc;
  $search-history-item-color: rgba(173, 173, 173, 0.44);
  .search-wrapper {
    .search-history {
      font-size: $font-size-medium;
      display: flex;
      flex-direction: column;
      .search-history-title {
        display: flex;
        justify-content: space-between;
        margin: 2px 5px;
        color: #aaa;
        span {
          padding: 5px 10px;
        }
        span:nth-child(2) {
          color: #dd2637;
          opacity: 0.8;
        }
      }
      .search-history-items {
        background-color: $search-history-items-color;
        padding: 0 5px;
        max-height: 160px;
        overflow: hidden;
        .search-history-item {
          display: inline-block;
          padding: 4px 6px;
          border: 1px solid $search-history-item-color;
          border-radius: 4px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 120px;
          margin: 4px 6px;
          height: 20px;
          line-height: 20px;
        }
      }
    }
    .search-result {
      .empty-result-list {
        font-size: $font-size-medium-x;
        color: $empty-result-list-color;
        display: flex;
        justify-content: center;
        justify-items: center;
        margin-top: 20px;
      }
    }
  }
</style>

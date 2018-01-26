import * as types from './mutation-types'

const mutations = {
  [types.SET_USER_INFO] (state, userInfo) {
    state.userInfo = userInfo
  },
  // TODO
  [types.SET_SEARCH_MEETING_LIST] (state, payload) {
    state.searchMeetingList = payload.meetingList
  },
  [types.SET_SEARCH_STR] (state, searchStr) {
    state.searchStr = searchStr
  }
}

export default mutations

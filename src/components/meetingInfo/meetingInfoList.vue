<template>
  <div class="meeting-info-list" @click="_openMeetingInfo(item.url, item.id)">
    <div class="meeting-info-list-main">
      <div class="meeting-info-list-title">{{item.title}}</div>
      <p>{{item.city}} {{item.date}}</p>
      <p>{{item.infoSponsor}}</p>
    </div>
    <div class="meeting-info-list-icon">
      <span class="icon-xiangyou"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { openWebView } from 'api/native'
  import { getMeetingInfoDetail } from 'api/config'
  import api from 'api/fetchData'

  export default {
    name: 'meeting-info-list',
    props: {
      item: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
      }
    },
    methods: {
      _openMeetingInfo(url, id) {
        if (url) {
          openWebView(true, this.item.title, url, true)
        } else {
          this._getMeetingInfoDetail(id)
        }
      },
      _getMeetingInfoDetail(id) {
        const url = getMeetingInfoDetail
        let params = {
          'meetingId': id
        }
        return api.getData(url, 'get', params)
          .then((res) => {
            openWebView(true, res.title, res.url, true)
          }).catch((e) => {
          })
      }
      }
  }
</script>

<style scoped lang="scss">
  @import "../../common/scss/variable";
  $title-color: #000000;
  $text-height: 21px;

  .meeting-info-list {
    margin-top: 6px;
    padding: 11px 15px;
    display: flex;
    background-color: #ffffff;
    font-family: $font-family;
    position: relative;

    .meeting-info-list-main {

      .meeting-info-list-title {
        color: $title-color;
        font-size: $font-size-large;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      p {
        font-family: $font-family;
        color: $color-text;
        font-size: $font-size-medium;
        line-height: $text-height;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }

    .meeting-info-list-icon {
      position: absolute;
      right: 15px;
      top: 33px;

      span {
        color: $color-text;
      }
    }
  }
</style>

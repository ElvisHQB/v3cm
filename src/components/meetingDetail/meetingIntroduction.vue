<template>
  <div class="meeting-introduction">
    <!--基本信息-->
    <div class="basic-info">
      <div class="title">
        <span>基本信息</span>
      </div>
      <div class="content">
        <div class="meeting-time">{{ meetingTime }}</div>
        <div class="speakers">
          <p v-for="(speaker, index) in meetingDetail.lecturers" v-bind:key="index">{{ speaker.name + '(' + speaker.title + ')' }}</p>
        </div>
        <div class="sponsors">
          <p v-for="(sponsor, index) in meetingDetail.sponsors" v-bind:key="index">{{ sponsor.name }}</p>
        </div>
      </div>
    </div>
    <!--会议简介-->
    <div class="meeting-intro">
      <div class="title">
        <span>会议简介</span>
      </div>
      <div v-html="meetingDetail.description" class="content"></div>
    </div>
    <!--会议议程-->
    <div v-if="meetingDetail.agenda" class="meeting-agenda">
      <div class="title">
        <span>会议议程</span>
      </div>
      <div v-html="meetingDetail.agenda" class="content"></div>
    </div>
    <!--主讲人简介-->
    <div class="speaker-intro">
      <div class="title">
        <span>主讲人简介</span>
      </div>
      <div class="content">
        <p v-for="(speaker, index) in meetingDetail.lecturers" v-bind:key="index">
          <span class="speaker-name">{{ speaker.name }}</span>
          <span>&nbsp;</span>
          {{ speaker.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { genMeetingTime } from '../../common/js/utils'
  export default {
    name: 'meetingIntro',
    props: {
      meetingDetail: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        //
      }
    },
    computed: {
      meetingTime() {
        return genMeetingTime(this.meetingDetail.startTime, this.meetingDetail.endTime)
      }
    },
    methods: {
      //
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $background-color: #fff;
  $title-border-color: #5470b5;
  $title-color: #000;
  $content-color: #8f8f94;
  .meeting-introduction {
    .basic-info {
      //
    }
    .meeting-intro {
      //
    }
    .speaker-intro {
      .speaker-name {
        color: #000;
        font-weight: 700;
      }
    }
    .title {
      padding: 10px 0;
      color: $title-color;
      font-size: 16px;
      background: $background-color;
      border-top: 1px solid #eee;
    }
    .title span {
      display: inline-block;
      width: 100%;
      height: 100%;
      border-left: 5px solid $title-border-color;
      text-indent: 12px;
    }
    .content {
      padding: 10px 15px;
      color: $content-color;
      background-color: $background-color;
      font-size: 14px;
    }
  }
</style>

<template>
  <div class="meetingInfo-body">
    <div class="meetingInfo-selector">
      <selector :title="meetingInfoTitle" :subTitle="meetingInfoSubTitle"></selector>
    </div>

  </div>

</template>

<script type="text/ecmascript-6">
  import selector from '../../base/selector/selector'

  const meetingInfoCategory = ['类型', '地点', '时间']
  const meetingInfoDetail = [['全部', '宏观经济', '高峰论坛', '行业会议', '业绩发布会', '学术会议', '其他会议'],
    ['全部', '上海', '杭州', '北京', '深圳', '广州', '其他地区'],
    ['全部', '未来三天', '未来一周', '未来一月', '未来三月']]

  export default {
    name: 'historyMeeting',
    components: {
      selector
    },
    mounted() {
    },
    computed: {
    },
    data() {
      return {
        meetingInfoTitle: meetingInfoCategory,
        meetingInfoSubTitle: meetingInfoDetail
      }
    },
    methods: {
    }
  }

</script>

<style scoped lang="scss">

  .meetingInfo-body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 40px;

    .meetingInfo-selector {
      position: fixed;
      width: 100%;
      top: 45px;
    }

  }
</style>

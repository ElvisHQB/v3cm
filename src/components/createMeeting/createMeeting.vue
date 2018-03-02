<template>
  <div class="create-meeting">
    <tab-select :tabList="tabList" :tabIndex="tabIndex" @changeTab="_changeTab">
      <keep-alive>
        <component :is="currentContent"></component>
      </keep-alive>
    </tab-select>
  </div>
</template>

<script type="text/ecmascript-6">
  import TabSelect from 'base/tabSelect/tabSelect'
  import publicMeeting from './publicMeeting'
  import privateMeeting from './privateMeeting'

  export default {
    name: 'createMeeting',
    components: {
      TabSelect,
      publicMeeting,
      privateMeeting
    },
    data() {
      return {
        tabIndex: 0,
        currentContent: 'publicMeeting',
        tabList: [
          {
            index: 0,
            name: '公开会议',
            component: 'publicMeeting'
          },
          {
            index: 1,
            name: '私人会议',
            component: 'privateMeeting'
          }
        ]
      }
    },
    methods: {
      _changeTab(tab) {
        this.tabIndex = tab.index
        this.currentContent = tab.component
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>

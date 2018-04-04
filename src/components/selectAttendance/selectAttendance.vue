<template>
  <div class="select-attendance">
    <tab-select :tabList="tabList" :tabIndex="tabIndex" @changeTab="_changeTab">
      <keep-alive>
        <component :is="currentContent"></component>
      </keep-alive>
    </tab-select>
  </div>
</template>
<script type="text/ecmascript-6">
  import TabSelect from 'base/tabSelect/tabSelect'
  import phoneContact from './phoneContact'
  import iWindContact from './iWindContact'

  export default {
    name: 'selectAttendance',
    components: {
      TabSelect,
      phoneContact,
      iWindContact
    },
    data() {
      return {
        tabIndex: 1,
        currentContent: 'iWindContact',
        tabList: [
          {
            index: 0,
            name: '手机通讯录',
            component: 'phoneContact'
          },
          {
            index: 1,
            name: 'iWind好友',
            component: 'iWindContact'
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

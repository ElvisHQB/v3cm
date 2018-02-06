<template>
    <div>
      <div>
        <tab-select :tabList="tabList" :tabIndex="tabIndex" @changeTab="_changeTab">
          <div>搜搜</div>
          <keep-alive>
            <component :is="currentContent"
                        :data="data">
            </component>
          </keep-alive>
        </tab-select>
      </div>
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
        data: null
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

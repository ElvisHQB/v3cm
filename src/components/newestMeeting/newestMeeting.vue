<template>
  <div>
    <p v-for="(item, index) in test" :key="index">{{item}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  import api from '../../api/fetchData'
  import {HOST} from '../../api/config'
  import * as ERR_CODE from '../../api/errorCode'
  export default {
    name: 'newestMeeting',
    data () {
      return {
        test: []
      }
    },
    mounted () {
      this._test()
      this._getList()
    },
    computed: {
    },
    methods: {
      _test () {
        for (let i = 0; i < 100; i++) {
          let t = '上的福克斯减肥路上的减肥速度快就'
          this.test.push(t)
        }
      },
      _getList () {
        const url = HOST + '/getLatestMeeting.json'
        return api.getData(url, 'post', {
          criteria: {
            meetingStatus: ['PUBLISHED', 'STARTED']
          },
          isPaging: false
        }).then((res) => {
          console.log(res)
        }).catch((e) => {
          console.log(e)
          console.log(ERR_CODE)
        })
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

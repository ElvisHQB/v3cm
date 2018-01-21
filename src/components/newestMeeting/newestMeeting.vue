<template>
  <div>
    <p v-for="(item, index) in test" :key="index">{{item}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'newestMeeting',
    data () {
      return {
        test: []
      }
    },
    mounted () {
      this._test()
    },
    computed: {
    },
    methods: {
      _test () {
        for (let i = 0; i < 100; i++) {
          let t = '上的福克斯减肥路上的减肥速度快就'
          this.test.push(t)
        }
      }
    }
  }
</script>

<style scoped lang="scss">

</style>

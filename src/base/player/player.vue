<template>
  <div class="ali-player">
    <div class="prism-player" id="J_prismPlayer" style="position: absolute"></div>
    <button @click="play()">播放</button>
    <button @click="pause()">暂停</button>
    <button @click="replay()">重播</button>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: 'player',
    data () {
      return {
        //mediaUrl: 'http://streamplay.wind3c.net/live/flvstream-L4.flv',
        /* eslint-disable*/
        options: {
          width: '100%',
          height: '55px',
          id: 'J_prismPlayer',
          width: '100%',
          autoplay: false,
          //支持播放地址播放,此播放优先级最高
          source: 'http://streamplay.wind3c.net/live/flvstream-L1.m3u8'
        },
        playerInstance: null
      }
    },
    create () {
    },
    mounted () {
      this.player()
    },
    methods: {
      player () {
        this.playerInstance = new Aliplayer(this.options, function (player) {
          console.log('播放器创建好了。')
        })
        this.playerInstance.on('liveStreamStop', function () {
          console.log('zhongduan')
        })
      },
      play () {
        console.log('播放')
        console.log(this.playerInstance)
        this.playerInstance.play()
      },
      pause () {
        console.log('暂停')
        this.playerInstance.pause()
      },
      replay () {
        console.log('重播')
        this.playerInstance.replay()
      }
    },
    components: {}
  }
</script>

<style scoped lang="scss">
.ali-player {
  .prism-player {
    display: none;
  }
}
</style>

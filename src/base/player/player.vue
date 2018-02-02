<template>
  <div class="ali-player">
    <div class="prism-player" id="J_prismPlayer" style="position: absolute"></div>
    <button @click="play">播放</button>
    <button @click="pause">暂停</button>
    <button @click="replay">重播</button>
  </div>
</template>
<script type="text/ecmascript-6">
  import VueAliplayer from 'vue-aliplayer'

  export default {
    name: 'aliplayer',
    data () {
      return {
        options: {
          width: '100%',
          height: '55px',
          showBuffer: true,
          id: 'J_prismPlayer',
          autoplay: false,
          useH5Prism: true,
          x5_type: 'h5',
          isLive: true,
          preload: true,
          //支持播放地址播放,此播放优先级最高
//          source: 'http://sk.cri.cn/887.m3u8'
          source: 'static/sound.mp3'
        },
        playerInstance: null
      }
    },
    created () {
    },
    mounted () {
      this.playerInit()
    },
    methods: {
      playerInit () {
        /* eslint-disable */
        const player = new Aliplayer(this.options, function (player) {
          console.log('播放器创建好了。', player)
        })
        this.playerInstance = player
      },
      play () {
        console.log(this.playerInstance)
        this.playerInstance.play()
      },
      pause () {
        console.log(this.playerInstance)
        this.playerInstance.pause()
      },
      replay () {
        console.log(this.playerInstance)
        this.playerInstance.replay()
      }
    },
    components: {
      'ali-player': VueAliplayer
    }
  }
</script>

<style scoped lang="scss">
  .ali-player {
    .prism-player {
      display: none;
    }
  }
</style>

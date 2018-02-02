<template>
  <div class="selector">
    <div class="selector-tab">
      <div class="selector-tab-item" :class="{'selector-tab-item-active': isShow[index]}" :title="title"
           v-for="(item,index) in title" :key="index"
           @click.stop="_selectTab(index,title.length)">
        <div><span class="selector-span" :class="{'selector-span-active': isShow[index]}">{{item}}
          <i :class="{'icon-xiangxia': !isShow[index], 'icon-xiangshang': isShow[index]}"></i></span></div>
      </div>
    </div>
    <transition-group name="fade">
      <div class="selector-list-wrap" transiton="fade" key="1">
        <div ref="seList" class="selector-list" v-for="(item,index) in subTitle" :key="index" :id="index"
             v-show="isShow[index]">
          <button class="default" v-for="(n, indexDetail) in item" :key="n" @click="_chooseThis(n,index,indexDetail)">
            {{n}}
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'selector',
    data() {
      return {
        isShow: [],
        storeTitle: []
      }
    },
    props: {
      title: '',
      subTitle: '',
      selectorVal: ''
    },
    mounted() {
      document.addEventListener('click', this._handleDocumentClick)
      this._setShow()
    },
    methods: {
      _setShow() {
        for (let i = 0; i < this.title.length; i++) {
          this.$set(this.isShow, i, false)
          this.$set(this.storeTitle, i, this.title[i])
        }
      },
      _chooseThis(msg, index, indexDetail) {
        this.$emit('searchVal', index, indexDetail)
        if (msg === '全部') {
          this.$set(this.title, index, this.storeTitle[index])
        } else {
          this.$set(this.title, index, msg)
        }
        this.$set(this.isShow, index, false)
      },
      _selectTab(index, length) {
        for (let i = 0; i < length; i++) {
          if (index === i) {
            let isShow = this.isShow[i]
            this.$set(this.isShow, i, !isShow)
          } else {
            this.$set(this.isShow, i, false)
          }
        }
      },
      _handleDocumentClick(e) {
        if (e.target.className !== 'selector-list' && e.target.className !== 'selector-tab-item' && e.target.className !== 'selector-span') {
          for (let i in this.isShow) {
            this.$set(this.isShow, i, false)
          }
        }
      }
    }
  }
</script>

<style scoped lang='scss'>
  @import "../../common/scss/variable";

  .selector {
    color: black;
    font-family: $font-family;
    font-size: 15px;

    .selector-tab {
      text-align: center;
      height: 38px;
      line-height: 38px;
      display: flex;
      background-color: white;
      position: relative;

      .selector-tab-item {
        flex: 1;

        .selector-span-active {
          color: #007aff;
        }

        .selector-span i {
          vertical-align: sub;
        }
      }

      .selector-tab-item-active {
        border-bottom: 2px solid #007aff;
      }
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.7s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }

    .selector-list-wrap {

      .selector-list {
        margin-top: 5px;
        background-color: white;
        width: 100%;
        position: absolute;
        z-index: 9999;

        .default {
          height: 28px;
          padding: 0 8px;
          margin: 7px 5px;
          background-color: white;
          border: 1px solid lightgray;
          border-radius: 5px;
        }
      }
    }
  }

</style>

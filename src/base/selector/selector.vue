<template>
  <div class="selector">
    <div class="selector-tab">
      <div class="selector-tab-item" :class="{'selector-tab-item-active': isShow[index]}" :title="title"
           v-for="(item,index) in title" :key="index"
           @click.stop="_selectTab(index,title.length)">
        <div><span class="selector-span" :class="{'selector-span-active': isShow[index]}">{{item}}
          <i :class="[isShow[index] ? iconXiangShang : iconXiangXia]"></i></span></div>
      </div>
    </div>
    <div class="selector-list-wrap" key="1">
      <transition-group name="fade">
        <div ref="seList" class="selector-list" v-for="(item,index) in subTitle" :key="index" :id="index"
             v-show="isShow[index]" :class="[isShow[index] || isChooseAnother ? fadeLeaveShort : fadeLeaveLong]">
          <button class="selector-list-button" v-for="(n, indexDetail) in item" :key="n"
                  @click="_chooseThis(n,index,indexDetail)">
            {{n}}
          </button>
        </div>
      </transition-group>
    </div>
    <transition-group name="fadeShadow">
      <div class="selector-shadow" v-for="(item,index) in subTitle" :key="index" v-show="isShow[index]"
           v-bind:style="{height: height + 'px'}">
      </div>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    name: 'selector',
    data() {
      return {
        iconXiangShang: 'icon-xiangshang',
        iconXiangXia: 'icon-xiangxia',
        fadeLeaveShort: 'fade-leave-active-short',
        fadeLeaveLong: 'fade-leave-active-long',
        isShow: [],
        storeTitle: [],
        height: window.innerHeight,
        isChooseAnother: false
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
        this.isChooseAnother = false
        let tabIsShow = false
        let tabIndex = -1
        for (let i = 0; i < length; i++) {
          if (this.isShow[i] === true) {
            tabIsShow = true
            tabIndex = i
            break
          }
        }
        for (let i = 0; i < length; i++) {
          if (index === i) {
            if (!tabIsShow) {
              this.$set(this.isShow, i, true)
            } else if (i === tabIndex) {
              this.$set(this.isShow, i, false)
            } else {
              this.$set(this.isShow, tabIndex, false)
              this.$set(this.isShow, i, true)
              this.isChooseAnother = true
            }
          }
        }
      },
      _handleDocumentClick(e) {
        if (e.target.className !== 'selector-list' && e.target.className !== 'selector-tab-item' && e.target.className !== 'selector-span') {
          this.isChooseAnother = false
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

  $selector-font-size: 15px;
  $selector-tab-height: 38px;
  $selector-background: #fcfcfc;
  $selector-active: #007aff;
  $selector-shadow-color: rgba(0, 0, 0, 0.47);
  $selector-list-button-height: 28px;
  $selector-list-button-border-radius: 5px;
  $selector-list-button-border-color: #d3d3d3;
  $selector-tab-border-color: #efeff4;
  $selector-tab-border-width: 1px;

  .selector {
    color: black;
    font-family: $font-family;
    font-size: $selector-font-size;
    position: relative;

    .selector-tab {
      text-align: center;
      height: $selector-tab-height;
      line-height: $selector-tab-height;
      display: flex;
      background-color: $selector-background;
      border-bottom: $selector-tab-border-width solid $selector-tab-border-color;
      position: relative;
      z-index: 99;

      .selector-tab-item {
        flex: 1;

        .selector-span-active {
          color: $selector-active;
        }

        .selector-span i {
          vertical-align: sub;
        }
      }

      .selector-tab-item-active {
        border-bottom: 2px solid $selector-active;
      }
    }

    .fade-enter-active, .fade-enter {
      animation-name: fold-in;
      animation-duration: 0.5s;
    }
    /*.fade-leave, .fade-leave-active {*/
      /*animation-name: fold-out;*/
      /*animation-duration: 0.5s;*/
    /*}*/

    .fade-leave-active-short {
    }

    .fade-leave-active-long {
      animation-name: fold-out;
      animation-duration: 0.5s;
    }

    @keyframes fold-in {
      from {
        transform: translate3d(0, -100%, 0);
      }

      to {
        transform: translate3d(0, 0, 0);
      }
    }
    @keyframes fold-out {
      from {
        transform: translate3d(0, 0, 0);
      }

      to {
        transform: translate3d(0, -100%, 0);
      }
    }

    .selector-list-wrap {

      .selector-list {
        background-color: $selector-background;
        width: 100%;
        z-index: 50;

        .selector-list-button {
          height: $selector-list-button-height;
          padding: 0 8px;
          margin: 7px 5px;
          background-color: $selector-background;
          border: 1px solid $selector-list-button-border-color;
          border-radius: $selector-list-button-border-radius;
        }
      }
    }

    .selector-shadow {
      width: 100%;
      background-color: $selector-shadow-color;
      z-index: -1;
      opacity: 0.1;
      position: absolute;
      top: 0;
    }
  }

</style>

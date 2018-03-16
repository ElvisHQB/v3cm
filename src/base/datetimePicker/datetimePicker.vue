<template>
  <div class="datetime-picker-wrapper">
    <div class="datetime-picker" v-show="state===1">
      <div class="picker-header">
        <button class="btn-cancel" @click="cancel">取消</button>
        <button class="btn-ok" @click="confirm">确定</button>
      </div>
      <div class="picker-title">
        <span v-for="(item, index) in titleArr" :key="index">{{item}}</span>
      </div>
      <div class="picker-body">
        <div class="mask-top"></div>
        <div class="mask-bottom"></div>
        <div class="wheel-wrapper" ref="wheelWrapper">
          <div :class="[{'wheel-left-border': index === 3}, 'wheel']" v-for="(data, index) in pickerData" :key="index">
            <ul class="wheel-scroll">
              <li class="wheel-item" v-for="(item, index) in data" :key="index">{{ filterVal(item) }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="datetime-picker-shadow" v-show="state===1" @click="state = 0"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import { genNumSeq } from 'common/js/utils'

  const COMPONENT_NAME = 'datetimePicker'
  const STATE_HIDE = 0
  const STATE_SHOW = 1
  const EVENT_SELECT = 'select'
  const EVENT_CANCEL = 'cancel'

  const TITLE_ARR = ['年', '月', '日', '时', '分']
  const YEARS = [new Date().getFullYear(), new Date().getFullYear() + 1]
  const MONTHS = genNumSeq(1, 12)
  const DAYS1 = genNumSeq(1, 28)
  const DAYS2 = genNumSeq(1, 29)
  const DAYS3 = genNumSeq(1, 30)
  const DAYS4 = genNumSeq(1, 31)
  const HOURS = genNumSeq(0, 23)
  const MINUTES = genNumSeq(0, 59)

  const YEAR_INDEX = 0
  const MONTH_INDEX = 1
  const DAY_INDEX = 2
  const HOUR_INDEX = 3
  const MINUTES_INDEX = 4

  export default {
    name: COMPONENT_NAME,
    props: {
      defaultTime: {
        type: Number,
        default: function() {
          return new Date().getTime()
        }
      }
    },
    data() {
      return {
        state: STATE_HIDE,
        titleArr: TITLE_ARR,
        pickerData: [YEARS, MONTHS, DAYS4, HOURS, MINUTES],
        pickerSelectedIndex: [0, 0, 0, 0, 0],
        pickerSelectedVal: []
      }
    },
    methods: {
      confirm() {
        if (!this._canConfirm()) {
          return
        }

        for (let i = 0; i < this.pickerData.length; i++) {
          if (this.pickerData[i].length) {
            this.pickerSelectedVal[i] = this.pickerData[i][this.pickerSelectedIndex[i]]
          }
        }
        this.hide()
        let date = new Date(this.pickerSelectedVal[YEAR_INDEX], this.pickerSelectedVal[MONTH_INDEX] - 1,
          this.pickerSelectedVal[DAY_INDEX], this.pickerSelectedVal[HOUR_INDEX], this.pickerSelectedVal[MINUTES_INDEX])
        console.log(date)
        console.log(date.getTime())
        //抛出select时间，参数为所选时间的时间戳
        this.$emit(EVENT_SELECT, date.getTime())
      },
      cancel() {
        this.hide()
        this.$emit(EVENT_CANCEL)
      },
      //调用执行的入口
      show() {
        if (this.state === STATE_SHOW) {
          return
        }
        this.state = STATE_SHOW
        if (!this.wheels || this.dirty) {
          this.$nextTick(() => {
            this.wheels = []
            let wheelWrapper = this.$refs.wheelWrapper
            for (let i = 0; i < this.pickerData.length; i++) {
              this._createWheel(wheelWrapper, i)
            }
            this.dirty = false
          })
          //设置默认时间
          this.setDatetime(this.defaultTime)
        } else {
          for (let i = 0; i < this.pickerData.length; i++) {
            this.wheels[i].enable()
            this.wheels[i].wheelTo(this.pickerSelectedIndex[i])
          }
        }
      },
      hide() {
        this.state = STATE_HIDE
        for (let i = 0; i < this.pickerData.length; i++) {
          this.wheels[i].disable()
        }
      },
      scrollTo(index, dist) {
        const wheel = this.wheels[index]
        this.pickerSelectedIndex[index] = dist
        wheel.wheelTo(dist)
      },
      refresh() {
        this.$nextTick(() => {
          this.wheels.forEach((wheel, index) => {
            wheel.refresh()
          })
        })
      },
      _createWheel(wheelWrapper, i) {
        if (!this.wheels[i]) {
          this.wheels[i] = new BScroll(wheelWrapper.children[i], {
            wheel: {
              selectedIndex: this.pickerSelectedIndex[i],
              rotate: 25,
              wheelWrapperClass: 'wheel-scroll',
              wheelItemClass: 'wheel-item'
            },
            probeType: 3
          })
          console.log(this.wheels[i])
          this.wheels[i].on('scrollEnd', () => {
            let index = this.wheels[i].getSelectedIndex()
            //必须通过$set, watch才能生效
            this.$set(this.pickerSelectedIndex, i, index)
            if (this.pickerData[i].length) {
              this.pickerSelectedVal[i] = this.pickerData[i][index]
            }
          })
        } else {
          this.wheels[i].refresh()
        }
        return this.wheels[i]
      },
      _canConfirm() {
        return this.wheels.every((wheel) => {
          return !wheel.isInTransition
        })
      },
      setData(data) {
        this.pickerData = data.slice()
        this.dirty = true
      },
      setDatetime(timeStamp) {
        let curDate = new Date(timeStamp)
        let yearIndex = YEARS.indexOf(curDate.getFullYear())
        let monthIndex = MONTHS.indexOf(curDate.getMonth() + 1)
        let dayIndex = DAYS4.indexOf(curDate.getDate())
        let hourIndex = HOURS.indexOf(curDate.getHours())
        let minutesIndex = MINUTES.indexOf(curDate.getMinutes())
        this.pickerSelectedIndex = [yearIndex, monthIndex, dayIndex, hourIndex, minutesIndex]
      },

      filterVal(val) {
        return val < 10 ? '0' + val.toString() : val.toString()
      },
      //判断闰年
      isLeapYear(year) {
        return year % 100 === 0 ? year % 400 === 0 : year % 4 === 0
      },
      //判断大小月
      isSmallMonth(month) {
        return (month === 4 || month === 6 || month === 9 || month === 11)
      }
    },
    watch: {
      pickerSelectedIndex: {
        handler: function () {
          // TODO 不全部刷新，只刷新day的wheel
          let days = []
          if (MONTHS[this.pickerSelectedIndex[MONTH_INDEX]] === 2) { //2月
            days = this.isLeapYear(YEARS[this.pickerSelectedIndex[YEAR_INDEX]]) ? DAYS2 : DAYS1
          } else { //其他月份，区分大小月
            days = this.isSmallMonth(MONTHS[this.pickerSelectedIndex[MONTH_INDEX]]) ? DAYS3 : DAYS4
          }
          this.pickerData = [YEARS, MONTHS, days, HOURS, MINUTES]
          this.refresh()
//          this.wheels[2].refresh()
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  @import '../../common/scss/variable.scss';

  $picker-background-color: #eee;
  $header-btn-ok-color: #007aff;
  $header-btn-cancel-color: #555;
  $header-btn-cancel-border-color: #bbb;
  $main-color: #fff;

  .datetime-picker-wrapper {
    .datetime-picker {
      position: fixed;
      bottom: 0;
      width: 375px;
      height: 274px;
      background-color: $picker-background-color;
      z-index: 999;
      display: flex;
      flex-direction: column;
      font-size: 12px;
      .picker-header {
        border-top: 1px solid #ccc;
        border-bottom: 1px dotted #ccc;
        padding: 6px;
        @mixin picker-header-btn {
          font-size: 12px;
          padding: 6px 10px;
          border-radius: 2px;
          outline: none;
        }
        .btn-cancel {
          float: left;
          @include picker-header-btn;
          color: $header-btn-cancel-color;
          border: 1px solid $header-btn-cancel-border-color;
          background-color: $picker-background-color;
        }
        .btn-ok {
          float: right;
          @include picker-header-btn;
          color: $main-color;
          border: 1px solid $header-btn-ok-color;
          background-color: $header-btn-ok-color;
        }
      }
      .picker-title {
        display: flex;
        border-bottom: solid 1px #ccc;
        span {
          display: block;
          padding: 8px 10px;
          width: 75px;
          text-align: center;
        }
        span:nth-child(4) {
          width: 74px;
          border-left: dotted 1px #ccc;
        }
      }
      .picker-body {
        color: #000;
        font-size: 14px;
        background-color: #ddd;
        width: 100%;
        height: 200px;
        position: relative;
        @mixin mask {
          z-index: 10;
          width: 100%;
          height: 82px;
          pointer-events: none;
          transform: translateZ(0);
        }
        .mask-top {
          @include mask;
          position: absolute;
          top: 0;
          background: linear-gradient(to top, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4));
        }
        .mask-bottom {
          @include mask;
          position: absolute;
          bottom: 1px;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.4));
        }
        .wheel-wrapper {
          display: flex;
          flex-direction: row;
          width: 100%;
          height: 100%;
          .wheel {
            width: 75px;
            height: 100%;
            overflow: hidden;
            .wheel-scroll {
              padding: 0;
              margin-top: 82px;
              line-height: 36px;
              list-style: none;
              .wheel-item {
                width: 100%;
                height: 36px;
                line-height: 36px;
                overflow: hidden;
                white-space: nowrap;
                list-style: none;
                text-align: center;
              }
            }
          }
          .wheel-left-border {
            width: 74px;
            border-left: dotted 1px #bbb;
          }
        }
      }
    }
    .datetime-picker-shadow {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 555;
      opacity: 0.4;
      position: absolute;
      top: 0;
    }
  }
</style>

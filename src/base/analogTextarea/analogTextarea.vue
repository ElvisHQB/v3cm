<template>
  <div class="analog-textarea-wrapper">
    <div @input="onInputChange($event.target.textContent)" :placeholder="placeholderText"
         contenteditable="true" class="analog-textarea">
    </div>
    <div v-bind:class="[{ 'count-exceed': countExceed }, 'counter']">
      <span class="">{{ currentCount }}</span>
      <span>/</span>
      <span>{{ maxCount }}</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { Toast } from 'mint-ui'

  export default {
    name: 'analogTextarea',
    props: {
      maxCount: {
        type: Number,
        default: 0
      },
      placeholderText: {
        type: String,
        default: ''
      },
      message: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        'currentCount': 0,
        'countExceed': false
      }
    },
    methods: {
      onInputChange(content) {
        this.$emit('contentChange', content)
        this.currentCount = content.length
        this.countExceed = this.currentCount > this.maxCount
        if (this.countExceed) {
          Toast({
            message: this.message,
            position: 'middle',
            duration: 3000
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  $placeholder-color: #8f8f94;
  $text-count-exceed-color: #dd524d;
  $background-color: #fff;
  $counter-height: 20px;
  .analog-textarea-wrapper {
    background-color: $background-color;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .analog-textarea {
      outline: none;
      border: none;
      width: 100%;
      height: 100%;
    }
    .counter {
      height: $counter-height;
      line-height: $counter-height;
      align-self: flex-end;
    }
    .count-exceed {
      color: $text-count-exceed-color;
    }
    .analog-textarea:empty::before {
      color: $placeholder-color;
      content: attr(placeholder);
    }
  }
</style>

<template>
  <div class="loading-container">
    <img src="./loading.gif">
  </div>
</template>
<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'loading'

  export default {
    name: COMPONENT_NAME
  }
</script>

<style scoped lang="scss" type="text/scss">
  $loading-icon-size: 20px;
  .loading-container {
    img {
      display: block;
      padding: 0 5px;
      width: $loading-icon-size;
      height: $loading-icon-size;
    }
  }
</style>

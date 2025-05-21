<template>
  <div class="fm-design-container">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'app',
  methods: {
    handleHome () {
      this.$router.push({path: '/'})
    }
  }
}
</script>

<style lang="scss">
html,body{
  height: 100%;
}
html.dark{
  body{
    background: #141414;
  }
}
#app {
  min-height: 100%;
  height: 100%;
  padding: 10px;
}
.fm-design-container{
  min-height: 100%;
  height: 100%;
}
</style>

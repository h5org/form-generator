<template>
  <a-config-provider :theme="{algorithm: themeAlgorithm}">
    <slot></slot>
  </a-config-provider>
</template>

<script>
import { getCurrentInstance, h } from 'vue'

export default {
  components: {},
  created () {
    const instance = getCurrentInstance()

    if (instance.appContext.components['AConfigProvider'] === undefined) {
      this.$options.components['a-config-provider'] = (props, {slots}) => h('div', slots.default?.())
    }
  },
  inject: {
    themeAlgorithm: {
      default: null
    },
  }
}
</script>
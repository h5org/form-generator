<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
})

const show = ref(props.modelValue)

const emits = defineEmits(['update:modelValue'])

watchEffect(() => {
  show.value = !!props.modelValue
})

function onClose () {
  emits('update:modelValue', false)
}
</script>

<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    round
    destroy-on-close
    :closeable="closable"
    @close="onClose"
    safe-area-inset-bottom
    teleport="body"
    z-index="5000"
  >
    <van-nav-bar :title="title"></van-nav-bar>
    <div class="fm-van-dialog-content">
      <div style="display: flex; overflow: auto; flex-direction: column;"><slot></slot></div>

      <div class="fm-van-dialog-footer">
        <slot name="footer"></slot>
      </div>
    </div>
    
  </van-popup>
</template>

<style lang="scss" scoped>

.fm-van-dialog-content{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 300px;
  max-height: calc(100vh - 100px);

  .fm-van-dialog-footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;

    > * {
      &:not(:last-child) {
        margin-right: 12px;
      }
    } 
  }
}
</style>
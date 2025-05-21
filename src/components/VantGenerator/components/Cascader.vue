<script setup>
import { ref, watchEffect } from 'vue'

const props = defineProps({
  modelValue: [String, Number, Array],
  placeholder: String,
  disabled: Boolean,
  customProps: Object,
  extendProps: Object,
  publicProps: Object,
  options: Array,
  title: String,
  isPathValue: Boolean,
  printRead: Boolean
})

const emit = defineEmits(['update:modelValue'])

const fieldValue = ref('')
const cascaderValue = ref('')
const show = ref(false)

watchEffect(() => {
  if (props.isPathValue) {
    const values = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]

    fieldValue.value = getCascaderText([...values], props.options).join('/')

    cascaderValue.value = values.length > 0 ? values[values.length - 1] : ''
  } else {
    const value = Array.isArray(props.modelValue) ? props.modelValue?.[0] : props.modelValue

    fieldValue.value = getTreeText(value, props.options)
    cascaderValue.value = value
  }
})

function getTreeText (value, options) {
  for (let i = 0; i < options.length; i++) {
    let currentOpt = options[i]

    if (currentOpt.value == value) {
      return currentOpt.text
    }

    if (currentOpt.children && currentOpt.children.length > 0) {
      let res = getTreeText(value, currentOpt.children)

      if (res == '') {
        continue
      } else {
        return res
      }
    }
  }

  return ''
}

function getCascaderText (values, options, texts = []) {
  if (values.length >= 1) {
    let currentOpt = options?.find(opt => opt.value == values[0])
    if (currentOpt) {
      texts.push(currentOpt.text)
    }
    values.splice(0, 1)
    return getCascaderText(values, currentOpt?.children, texts)
  } else {
    return texts
  }
}

function onFinish ({ selectedOptions }) {

  if (props.isPathValue) {
    emit('update:modelValue', selectedOptions.map(item => item.value))
    fieldValue.value = selectedOptions.map(item => item.text).join('/')
  } else {
    emit('update:modelValue', cascaderValue.value)
    fieldValue.value = selectedOptions[selectedOptions.length - 1]['text']
  }
  show.value = false
}

function onShowPicker () {
  if (props.printRead) return false
  show.value = true
}
</script>

<template>
<van-field
  v-model="fieldValue"
  :is-link="!printRead"
  readonly
  :placeholder="placeholder"
  :disabled="disabled"
  v-bind="{...publicProps}"
  @click="onShowPicker"
  :key="printRead"
>
  <template #input v-if="printRead">
    {{ fieldValue }}
  </template>
</van-field>
<van-popup v-model:show="show" round position="bottom" teleport="body" z-index="5000">
  <van-cascader
    v-model="cascaderValue"
    :options="options"
    :title="publicProps.label"
    @close="show = false"
    @finish="onFinish"
    v-bind="{...customProps, ...extendProps}"
  />
</van-popup>
</template>
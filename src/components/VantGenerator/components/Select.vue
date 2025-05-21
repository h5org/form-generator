<script setup>
import { ref, watchEffect, onBeforeUpdate } from 'vue'

const props = defineProps({
  modelValue: [String, Array],
  placeholder: String,
  disabled: Boolean,
  customProps: Object,
  extendProps: Object,
  publicProps: Object,
  columns: Array,
  multiple: Boolean,
  printRead: Boolean
})

const emit = defineEmits(['update:modelValue'])

const dataModel = ref()
const showPicker = ref(false)
const pickerValue = ref([])
const fieldValue = ref('')

const findText = (value) => {
  if (!props.columns) return value
  const option = props.columns.find(item => item.value === value)
  return option ? option.text : ''
}

watchEffect(() => {
  dataModel.value = props.modelValue
  
  if (props.multiple) {
    const value = Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]

    fieldValue.value = value.map(item => findText(item)).join(',')
    pickerValue.value = value
  } else {
    const value = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue

    fieldValue.value = findText(value)
    pickerValue.value = [value]
  }
})

const onConfirm = ({selectedOptions}) => {
  if (props.multiple) {
    fieldValue.value = selectedOptions.map(item => item.text).join(',')
    dataModel.value = selectedOptions.map(item => item.value)
  } else {
    fieldValue.value = selectedOptions[0].text
    dataModel.value = selectedOptions[0].value
  }
  showPicker.value = false
  emit('update:modelValue', dataModel.value)
}

const onShowPicker = () => {
  if (props.printRead) return false
  showPicker.value = true
}

/* 多选操作 */
const checkboxRefs = ref([])
const toggle = (index) => {
  checkboxRefs.value[index].toggle()
}

onBeforeUpdate(() => {
  checkboxRefs.value = []
})

const onMultipleConfirm = () => {
  showPicker.value = false

  fieldValue.value = dataModel.value.map(item => findText(item)).join(',')
  emit('update:modelValue', dataModel.value)
}
</script>

<template>
  <van-field
    :modelValue="fieldValue"
    :placeholder="placeholder"
    :disabled="disabled"
    v-bind="{...publicProps}"
    :is-link="!printRead"
    @click="onShowPicker"
    readonly
    :key="printRead"
  >
    <template #input v-if="printRead">
      {{ fieldValue }}
    </template>
  </van-field>
  <van-popup round v-model:show="showPicker" destroy-on-close position="bottom" v-if="!multiple" teleport="body" z-index="5000">
    <van-picker
      :columns="columns"
      :model-value="pickerValue"
      @confirm="onConfirm"
      @cancel="showPicker = false"
      
    >
    </van-picker>
  </van-popup>
    
  <van-popup round v-model:show="showPicker" destroy-on-close position="bottom" v-else teleport="body" z-index="5000">
    <van-nav-bar :title="publicProps.label" right-text="确定"
      @click-left="showPicker = false"
      @click-right="onMultipleConfirm"
    >
      <template #left>
        <span>取消</span>
      </template>
    </van-nav-bar>
    <div class="van-select-multiple-content">
      <van-checkbox-group v-model="dataModel">
        <van-cell-group :border="false">
          <van-cell
            v-for="(item, index) in columns"
            clickable
            :key="item.value"
            :title="item.text"
            @click="toggle(index)"
          >
            <template #right-icon>
              <van-checkbox
                :name="item.value"
                :ref="el => checkboxRefs[index] = el"
                @click.stop
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-checkbox-group>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.van-select-multiple-content{
  min-height: 200px;
  max-height: 360px;
  overflow: auto;
  margin-bottom: 50px;
  margin-top: 10px;
}
</style>
<template>
  <div class="array-dynamic-container">
    <div v-for="(item, index) in array" :key="index" class="array-dynamic-item">
      <el-input :readonly="!operable" v-model="item.key" placeholder="KEY" size="small"></el-input>
      <formula-input v-model="item.value" v-model:select="item.fx" :class="{'not-operable': !operable}" :showArguments="showArguments" :showRow="showRow" :isArgs="isArgs" :keyValue="item.key"></formula-input>
      <i v-if="operable" @click="handleRemove(index)" style="font-size: 16px;margin: 0 10px;cursor: pointer; color: #F56C6C;"><i class="fm-iconfont icon-delete"></i></i>
    </div>
    <el-button v-if="operable" link type="primary" @click="handleAdd"><i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>{{$t('fm.datasource.edit.add')}}</el-button>
  </div>
</template>

<script>
import FormulaInput from '../FormulaPanel/input.vue'

export default {
  components: {
    FormulaInput
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    operable: {
      type: Boolean,
      default: true
    },
    showArguments: {
      type: Boolean,
      default: true
    },
    showRow: {
      type: Boolean,
      default: true
    },
    isArgs: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      array: this.modelValue
    }
  },
  methods: {
    handleAdd () {
      this.array.push({key: '', value: '', fx: false})
    },

    handleRemove (index) {
      this.array.splice(index, 1)
    }
  },
  watch: {
    modelValue (val) {
      this.array = val
    },
    array: {
      deep: true,
      handler (val) {
        this.$emit('update:modelValue', val)
      }
    }
  }
}
</script>

<style lang="scss">
.array-dynamic-container{
  .array-dynamic-item{
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px dashed var(--el-border-color-lighter);
    display: flex;

    .el-input:first-child{
      width: 30%;
      margin-right: 6px;
      vertical-align: top;
    }

    .el-input:nth-child(2){
      width: 65%;
      vertical-align: top;

      &.not-operable{
        width: 70%;
      }
    }

    .el-button{
      vertical-align: top;
      margin-left: 10px;
    }
  }
}
</style>
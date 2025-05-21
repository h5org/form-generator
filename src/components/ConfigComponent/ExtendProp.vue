<template>
  <div class="fm-extend-config">

    <div v-for="(item, index) in extendArray" :key="index" class="fm-extend-item">
      <el-input v-model="item.key" placeholder="Key" type="textarea" autosize></el-input>
      
      <div class="fm-extend-content">
        <template v-if="item.valueType === 'fx'">
          <formula-input v-model="item.value" only></formula-input>
        </template>
        <template v-else-if="item.valueType === 'number'">
          <el-input v-model.number="item.value" placeholder="Value" type="number"></el-input>
        </template>
        <template v-else-if="item.valueType === 'boolean'">
          <el-select v-model="item.value">
            <el-option label="true" :value="true"></el-option>
            <el-option label="false" :value="false"></el-option>
          </el-select>
        </template>
        <template v-else>
          <el-input v-model="item.value" placeholder="Value" type="textarea" autosize></el-input>
        </template>

        <el-select v-model="item.valueType" class="fm-extend-select">
          <el-option :label="$t('fm.rules.label.string')" value="string"></el-option>
          <el-option :label="$t('fm.rules.label.number')" value="number"></el-option>
          <el-option :label="$t('fm.rules.label.boolean')" value="boolean"></el-option>
          <el-option :label="$t('fm.rules.label.fx')" value="fx"></el-option>
        </el-select>
      </div>

      <i @click="handleRemove(index)" style="font-size: 16px;margin: 0 10px;cursor: pointer; color: #F56C6C;"><i class="fm-iconfont icon-delete"></i></i>
    </div>

    <el-button text bg plain type="primary" style="width: 100%;" size="small" @click="handleAdd"> 
      {{$t('fm.actions.add')}}<i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>
    </el-button>
  </div>
</template>

<script>
import { isExpression, extractExpression, executeExpression } from '../../util/expression'
import FormulaInput from '../FormulaPanel/input.vue'

export default {
  name: 'extend-prop-config',
  components: {
    FormulaInput
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      extendArray: this.transformExtends(this.modelValue)
    }
  },
  watch: {
    extendArray: {
      deep: true,
      handler (val) {
        this.$emit('update:modelValue', this.transformExtends(val))
      }
    }
  },
  methods: {
    transformExtends (data) {
      if (Array.isArray(data)) {
        let obj = {}

        data && data.length && data.forEach(item => {
          if (item.key) {
            obj[item.key.trim()] = ((type, value) => {
              switch (type) {
                case 'fx':
                case 'function':
                  return `{{${value + ''}}}`
                case 'boolean':
                  return !!value
                case 'number':
                  return +value
                default:
                  return value + ''
              }
            })(item.valueType, item.value)
          }
        })

        return obj
      } else {
        if (!data) return []

        return Object.keys(data).map(key => {
          return {
            key,
            valueType: isExpression(data[key]) ? 'fx' : typeof data[key],
            value: isExpression(data[key]) ? extractExpression(data[key]) : data[key]
          }
        })
      }
    },

    handleAdd () {
      this.extendArray.push({
        key: 'key' + (this.extendArray.length + 1),
        valueType: 'string',
        value: ''
      })
    },

    handleRemove (index) {
      this.extendArray.splice(index, 1)
    }
  }
}
</script>

<style lang="scss">
.fm-extend-config{
  .fm-extend-item{
    margin-bottom: 6px;
    padding-bottom: 6px;
    border-bottom: 1px dashed var(--el-border-color-lighter);
    display: flex;
    // align-items: center;

    .el-input,.el-select__wrapper{
      height: 30px;
      line-height: 30px;
      min-height: 30px;
    }

    .fm-extend-content{
      display: flex;
      // align-items: center;
    }

    .fm-extend-select{
      width: 80px;

      .el-select__wrapper{
        padding: 4px;
        box-shadow: 0 0 0 1px var(--fm-color-primary) inset;
        height: 30px;
        line-height: 30px;
        min-height: 30px;

        .el-select__selected-item{
          overflow: unset;
          text-overflow: unset;
          text-align: center;
        }

        .el-select__suffix{
          display: none;
        }

        .el-select__icon{
          color: var(--fm-color-primary);
        }
      }
    }

    >.el-input:first-child{
      width: 30%;
      margin-right: 6px;
      vertical-align: top;
    }

    >.el-textarea:first-child{
      width: 30%;
      margin-right: 6px;
      vertical-align: top;
    }

    >div:nth-child(2){
      width: 65%;
      vertical-align: top;

      &.not-operable{
        width: 70%;
      }
    }

    >.el-button{
      vertical-align: top;
      margin-left: 10px;
    }
  }
}
</style>
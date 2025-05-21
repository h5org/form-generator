<template>
  <div class="fm-state-config">
    <div class="fm-state-item">
      <div>{{label}}:</div>
      <div>
        <el-switch v-model="select"></el-switch>
      </div>
    </div>
    <div class="fm-state-content" v-if="select">
      <div>
        <el-radio-group v-model="fx" size="small">
          <el-radio :label="$t('fm.formula.input.value2')" :value="false"></el-radio>
          <el-radio :label="$t('fm.formula.input.fx')" :value="true"></el-radio>
        </el-radio-group>
      </div>
      <div v-if="fx">
        <formula-input v-model="fxValue" only size="small"></formula-input>
      </div>
    </div>
  </div>
</template>

<script>
import { isExpression, extractExpression, executeExpression } from '../../util/expression'
import FormulaInput from '../FormulaPanel/input.vue'

export default {
  name: 'state-config',
  components: {
    FormulaInput
  },
  emits: ['update:modelValue'],
  props: {
    label: {
      type: String
    },
    modelValue: {
      type: [String, Boolean]
    }
  },
  data () {
    return {
      select: false,
      fx: false,
      fxValue: ''
    }
  },
  created () {
    this.transformData(this.modelValue)
  },
  watch: {
    select (val) {
      this.$emit('update:modelValue', this.transformValue())
    },
    fx (val) {
      this.$emit('update:modelValue', this.transformValue())
    },
    fxValue (val) {
      this.$emit('update:modelValue', this.transformValue())
    }
  },
  methods: {
    transformData (value) {
      if (typeof value === 'boolean') {
        this.select = value
        this.fx = false
      }
      if (typeof value === 'string') {
        this.select = true
        this.fx = true,
        this.fxValue = extractExpression(value)
      }
    },

    transformValue () {
      if (this.select) {
        if (this.fx) {
          return `{{${this.fxValue}}}`
        } else {
          return true
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.fm-state-config{
  margin: 0 10px;
  padding: 5px 0;

  +.fm-state-config{
    border-top: 1px dashed var(--fm-border-color);
  }

  .fm-state-item{
    display: flex;
    justify-content: space-between;
  }

  .fm-state-content{
    background: var(--fm-fill-lighter);
    border-radius: 5px;
    padding: 5px 10px;
    margin: 5px 0;
    position: relative;

    >div{
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
      align-items: cneter;
    }

    &::after{
      background-color: var(--fm-fill-lighter);
      content: "";
      display: block;
      height: 10px;
      left: 10px;
      position: absolute;
      top: -5px;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      width: 10px;
    }
  }
}
</style>
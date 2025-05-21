<template>
  <el-input
    :placeholder="placeholder"
    v-model="value"
    :size="size"
    :class="{
      'input-with-select': true,
      'formula-input': Boolean(this.selectValue),
      [$attrs.class]: true
    }"
    @click="handleFormulaInput"
    :readonly="Boolean(selectValue)"
    :style="$attrs.style"
    :disabled="selectValue === 'args'"
  >
    <template #append v-if="!only">
      <el-select v-model="selectValue" style="width: 80px">
        <el-option :label="$t('fm.formula.input.value')" :value="false" />
        <el-option :label="$t('fm.formula.input.fx')" :value="true" />
        <el-option v-if="isArgs" :label="$t('fm.formula.input.variable')" :value="'args'"></el-option>
      </el-select>
    </template>
  </el-input>

  <FormulaDialog ref="formulaDialog" @dialog-confirm="handleFormulaConfirm"></FormulaDialog>
</template>

<script>
import FormulaDialog from './dialog.vue'

export default {
  components: {
    FormulaDialog
  },
  props: {
    select: {
      type: Boolean,
      default: true
    },
    modelValue: {
      type: String
    },
    only: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
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
    },
    keyValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:select', 'update:modelValue'],
  watch: {
    selectValue (val) {
      if (val === 'args') {
        this.value = `args.${this.keyValue}`
        this.$emit('update:select', true)
      } else {
        this.$emit('update:select', val)
      }
    },
    value (val) {
      this.$emit('update:modelValue', val)
    },
    modelValue (val) {
      this.value = val
    },
    keyValue (val) {
      if (this.selectValue === 'args') {
        this.value = `args.${this.keyValue}`
      }
    }
  },
  data () {
    const isValidArgsFormat = (str) => {
      const regexString = `^args\\.${this.keyValue}$`
      const regex = new RegExp(regexString)
      return regex.test(str)
    }

    return {
      selectValue: isValidArgsFormat(this.modelValue) ? 'args' : (this.select ?? false),
      value: this.modelValue ?? '',
    }
  },
  computed: {
    placeholder () {
      if (this.selectValue) {
        return this.$t('fm.formula.input.fxPlaceholder')
      } else {
        return this.$t('fm.formula.input.valuePlaceholder')
      }
    }
  },
  methods: {
    handleFormulaInput () {
      this.selectValue && this.$refs.formulaDialog.open(this.value, {
        showArguments: this.showArguments, 
        showRow: this.showRow
      })
    },

    handleFormulaConfirm (val) {
      this.value = val
    }
  }
}
</script>

<style lang="scss">
.input-with-select .el-input-group__append {
  background-color: var(--el-fill-color-blank);

  .el-select__selected-item{
    font-size: 12px;
  }
}

.formula-input{
  input, .el-input__wrapper{
    cursor: pointer;
  }

  .el-input__wrapper{
    &::before{
      content: '{{';
      padding-right: 3px;
      opacity: 0.8;
      color: var(--el-color-primary);
    }
    &::after{
      content: '}}';
      padding-left: 3px;
      opacity: 0.8;
      color: var(--el-color-primary);
    }
  }
}
</style>
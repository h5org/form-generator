<template>
  <el-popover
    :visible="visible"
    width="500"
    :teleported="true"
    placement="bottom-end"
    ref="tempaleInput"
    popper-class="fm-template-popover"
  >
    <div class="code-line">{{prefix}}</div>
    <code-editor mode="xml" v-model="value" height="150px" :key="key"></code-editor>
    <div class="code-line">{{suffix}}</div>
    <div style="text-align: right; margin: 0">
      <el-button size="small" bg text @click="visible = false">{{$i18n.locale == 'zh-cn' ? '取 消' : 'Cancel'}}</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">
        {{$i18n.locale == 'zh-cn' ? '确 定' : 'Confirm'}}
      </el-button>
    </div>
    <template #reference>
      <el-button ref="buttonRef" @click="handleEdit" size="small" :style="$attrs.style">{{$i18n.locale == 'zh-cn' ? '点击编辑模板' : 'Setting'}}</el-button>
    </template>
  </el-popover>
</template>

<script>
import CodeEditor from '../CodeEditor/index.vue'

export default {
  components: {
    CodeEditor
  },
  props: {
    modelValue: {
      type: String
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      visible: false,
      value: '',
      key: Math.random().toString(36).slice(-8),
    }
  },
  mounted () {
    document.addEventListener('click', this.onClickOutside)
  },
  beforeUnmount () {
    document.removeEventListener('click', this.onClickOutside)
  },
  methods: {
    handleEdit () {
      if (this.visible) {
        this.visible = false
      } else {
        this.value = this.modelValue
        this.visible = true

        this.key = Math.random().toString(36).slice(-8)
      }
    },

    handleConfirm () {
      this.visible = false
      this.$emit('update:modelValue', this.value)
    },

    onClickOutside(event) {
      const popoverElement = this.$refs.tempaleInput?.$refs?.tooltipRef?.$refs?.popperRef?.contentRef
      const buttonElement = this.$refs.buttonRef.$el

      if (popoverElement && !popoverElement.contains(event.target) && 
        (!buttonElement || !buttonElement.contains(event.target))
      ) {
        this.visible = false
      }
    }
  }
}
</script>

<style lang="scss">
.fm-template-popover{
  .code-line{
    font-size: 14px;
    color: var(--el-color-primary);
    font-weight: 500;
    line-height: 30px;
  }
}
</style>
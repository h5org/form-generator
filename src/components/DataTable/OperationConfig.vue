<template>
  <div class="fm-operation-config-container">
    <el-form-item :label="$t('fm.config.widget.width')">
      <el-input-number v-model="data.width"  /> px
    </el-form-item>
    <el-form-item :label="$t('fm.config.widget.operationButton')">
      <draggable
        v-model="data.buttons"
        v-bind="{group:{ name:'buttons'}, ghostClass: 'ghost',handle: '.drag-item'}"
        handle=".drag-item"
        item-key="key"
      >
        <template #item="{element:item, index}">
          <div :key="item.key">
            <div class="button-config-item">
              <el-input v-model="item.name" style="margin: 0 3px;" ></el-input>

              <el-select v-model="item.type" class="type-select">
                <el-option :label="$t('fm.config.widget.primaryButton')" value="primary"></el-option>
                <el-option :label="$t('fm.config.widget.defaultButton')" value="default"></el-option>
                <el-option :label="$t('fm.config.widget.textButton')" value="text"></el-option>
                <el-option :label="$t('fm.config.widget.linkButton')" value="link"></el-option>
              </el-select>

              <el-button plain :type="item.event ? 'primary' : 'default'"   style="margin: 0 5px; font-size: 12px;" @click="handleEvent(index)">
                <i  class="fm-iconfont icon-zidingyishuju"></i>
              </el-button>
              
              <i style="font-size: 16px;margin: 0 5px;cursor: pointer;" @click="handleRemove(index)"><i class="fm-iconfont icon-delete"></i></i>

              <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="fm-iconfont icon-drag"></i></i>
            </div>
          </div>
        </template>
      </draggable>

      <el-button link type="primary" @click="handleAdd"  >{{$t('fm.config.widget.addButton')}}&nbsp;<i style="font-size: 12px;font-weight: 600;" class="fm-iconfont icon-plus"></i></el-button>
    </el-form-item>
  </div>
</template>

<script>
import Draggable from 'vuedraggable/src/vuedraggable'

export default {
  components: {
    Draggable
  },
  emits: ['update:modelValue', 'on-add-buttonevent', 'on-edit-buttonevent'],
  props: {
    modelValue: {
      type: Object
    }
  },
  data () {
    return {
      data: this.modelValue,
      buttonItem: {
        name: this.$i18n.locale == 'zh-cn' ? '操作' : 'Operation',
        type: 'primary',
        event: ''
      }
    }
  },
  watch: {
    modelValue (val) {
      this.data = this.modelValue
    },
    data (val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    handleRemove (index) {
      this.data.buttons.splice(index, 1)
    },

    handleEvent (index) {
      if (this.data.buttons[index].event) {
        this.$emit('on-edit-buttonevent', index, this.data.buttons[index].event)
      } else {
        this.$emit('on-add-buttonevent', index)
      }
    },

    handleAdd () {
      const key = Math.random().toString(36).slice(-8)
      this.data.buttons.push({...this.buttonItem, key})
    }
  }
}
</script>

<style lang="scss">
.fm-operation-config-container{
  .button-config-item{
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .type-select{
      .el-select__wrapper{
        padding: 4px 8px 4px 12px;
      }
    }
  }
}
</style>
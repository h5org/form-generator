<template>
  <div class="fm-columns-config-container">
    <div class="column-config-header" v-if="columns.length">
      <label>{{$t('fm.config.widget.columnLabel')}}</label>
      <label>{{$t('fm.config.widget.columnProp')}}</label>
    </div>
    <draggable
      v-model="columns"
      v-bind="{group:{ name:'options'+key}, ghostClass: 'ghost',handle: '.drag-item'}"
      handle=".drag-item"
      item-key="key"
      @start="handleMoveStart"
    >
      <template #item="{element:item, index}">
        <div :key="item.key">
          <div class="column-config-item"  :class="{'is-parent': item.isParent}">
            <i :class="{'is-active': currentIndex == index}" :ref="(el) => {buttonRefs[index] = el}" @click="handleDetail(index)" style="font-size: 16px;margin-right: 5px;cursor: pointer;"><i class="fm-iconfont icon-zidingyishuju"></i></i>

            <el-input :class="{'is-template': item.headerSlot}" :disabled="item.headerSlot" clearable  v-model="item.label" style="margin: 0 3px;"></el-input>
            <el-input v-if="!item.isParent" :class="{'is-template': item.defaultSlot}" :disabled="item.defaultSlot" clearable  v-model="item.prop" style="margin: 0 3px;"></el-input>

            <i style="font-size: 16px;margin: 0 5px;cursor: pointer;" 
              v-if="item.isParent" 
              @click="handleExpand(index)"
              class="expand-action"
              :style="{transform: item.isExpand ? '' : 'rotate(180deg)'}"
            > <i class="fm-iconfont icon-icon_function_shouqi"></i></i>

            <i style="font-size: 16px;margin: 0 5px;cursor: pointer;" @click="handleRemove(index)"><i class="fm-iconfont icon-delete"></i></i>

            <i class="drag-item" style="font-size: 16px;margin: 0 5px;cursor: move;"><i class="fm-iconfont icon-drag"></i></i>

          </div>
          <div v-if="item.isParent" class="column-config-parent" v-show="item.isExpand">
            <columns-config v-model="item.children"></columns-config>
          </div>
        </div>
      </template>
    </draggable>

    <el-button link type="primary" @click="handleAdd"  >{{$t('fm.actions.addColumn')}}&nbsp;<i style="font-size: 12px;font-weight: 600;" class="fm-iconfont icon-plus"></i></el-button>

    <el-button link type="primary" @click="handleParentAdd"  >{{$t('fm.config.widget.addParentHeader')}}&nbsp;<i style="font-size: 12px;font-weight: 600;" class="fm-iconfont icon-plus"></i></el-button>

    <el-popover
      ref="popoverRef"
      :virtual-ref="currentDetailRef"
      trigger="click"
      virtual-triggering
      placement="left"
      :visible="showPopover"
      width="360"
      :title="$t('fm.config.widget.columnSetting')"
    >
      <div class="fm-columns-config-popover-close" @click="handleClosePopover">
        <i class="fm-iconfont icon-close"></i>
      </div>
      <el-scrollbar max-height="600px">
        <el-form label-position="left" label-width="85px" size="small"  class="fm-columns-config-form">
          <el-form-item :label="$t('fm.config.widget.columnLabel')">
            <el-input v-model="columnDetail.label"></el-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.columnProp')" v-if="!columnDetail.isParent">
            <el-input v-model="columnDetail.prop"></el-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.columnWidth')">
            <el-input v-model.number="columnDetail.width" :disabled="columnDetail.isParent">
              <template #suffix>px</template>
            </el-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.ellipsis')">
            <el-switch v-model="columnDetail.ellipsis"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.columnAlign')">
            <el-radio-group v-model="columnDetail.align" size="small">
              <el-radio-button label="left" value="left" />
              <el-radio-button label="center" value="center" />
              <el-radio-button label="right" value="right" />
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.columnFixed')">
            <div style="display: flex; align-items: center;height:28px;width: 100%;">
              <el-switch v-model="columnDetail.fixed"></el-switch>
              <el-radio-group v-if="columnDetail.fixed" v-model="columnDetail.fixedOption" size="small" style="margin-left: 20px;">
                <el-radio-button label="left" value="left" />
                <el-radio-button label="right" value="right" />
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.rowspan')">
            <el-switch v-model="columnDetail.isRowspan" :disabled="!columnDetail.prop"></el-switch>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.columnDefaultSlot')" v-if="!columnDetail.isParent">
            <el-switch v-model="columnDetail.defaultSlot"></el-switch>
            <template-input 
              prefix="&lt;template #default=&quot;scope&quot;&gt;"
              suffix="&lt;/template&gt;"
              v-model="columnDetail.defaultSlotTemplate" 
              ref="templateDefaultInput" 
              v-if="columnDetail.defaultSlot" 
              style="margin-left: 20px;width: 169px;">
            </template-input>
          </el-form-item>
          <el-form-item :label="$t('fm.config.widget.columnHeaderSlot')">
            <el-switch v-model="columnDetail.headerSlot"></el-switch>
            <template-input 
              v-model="columnDetail.headerSlotTemplate"
              prefix="&lt;template #header&gt;"
              suffix="&lt;/template&gt;"
              ref="templateHeaderInput" 
              v-if="columnDetail.headerSlot" 
              style="margin-left: 20px;width: 169px;">
            </template-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </el-popover>
    
  </div>
</template>

<script>
import Draggable from 'vuedraggable/src/vuedraggable'
import CodeEditor from '../CodeEditor/index.vue'
import TemplateInput from './TemplateInput.vue'
import _ from 'lodash'

export default {
  name: 'columns-config',
  components: {
    Draggable,
    CodeEditor,
    TemplateInput
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      key:  Math.random().toString(36).slice(-8),
      columns: this.modelValue ?? [],
      currentDetailRef: null,
      popoverRef: null,
      buttonRefs: [],
      showPopover: false,
      columnDetail: {},
      columnItem: {
        label: '',
        prop: '',
        width: '',
        sortable: false,
        fixed: false,
        align: 'left',
        headderAlign: 'left',
        fixedOption: 'left',
        defaultSlot: false,
        defaultSlotTemplate: '',
        headerSlot: false,
        headerSlotTemplate: ''
      },
      parentItem: {
        label: '',
        width: '',
        fixed: false,
        fixedOption: 'left',
        align: 'left',
        headerSlot: false,
        headerSlotTemplate: '',
        isParent: true,
        isExpand: true,
        children: []
      },
      currentIndex: -1
    }
  },
  mounted () {
    this.popoverRef = this.$refs.popoverRef

    document.addEventListener('click', this.onClickOutside)
  },
  beforeUnmount () {
    document.removeEventListener('click', this.onClickOutside)
  },
  watch: {
    columns (val) {
      this.$emit('update:modelValue', val)
    },
    modelValue (val) {
      this.columns = val
    },
    showPopover (val) {
      if (!val) this.currentIndex = -1
    }
  },
  methods: {
    handleAdd () {
      const key = Math.random().toString(36).slice(-8)
      this.columns.push({...this.columnItem, key})
    },

    handleParentAdd () {
      const key = Math.random().toString(36).slice(-8)
      this.columns.push({..._.cloneDeep(this.parentItem), key})
    },

    handleDetail (index) {

      if (this.showPopover) {
        this.showPopover = false
      } else {
        this.columnDetail = this.columns[index]

        this.currentDetailRef = this.buttonRefs[index]

        this.currentIndex = index

        this.showPopover = true
      }
    },

    handleRemove (index) {
      this.columns.splice(index, 1)
    },

    handleClosePopover () {
      this.showPopover = false
    },

    onClickOutside(event) {

      const popoverElement = this.popoverRef.$refs?.tooltipRef?.$refs?.popperRef?.contentRef
      const buttonElement = this.buttonRefs[this.currentIndex]
      const defaultInputElement = this.$refs.templateDefaultInput?.$refs?.tempaleInput?.$refs?.tooltipRef?.$refs?.popperRef?.contentRef
      const headerInputElement = this.$refs.templateHeaderInput?.$refs?.tempaleInput?.$refs?.tooltipRef?.$refs?.popperRef?.contentRef

      if (popoverElement && !popoverElement.contains(event.target) &&
        (!buttonElement || !buttonElement.contains(event.target)) &&
        (!defaultInputElement || (defaultInputElement && !defaultInputElement.contains(event.target))) &&
        (!headerInputElement || (headerInputElement && !headerInputElement.contains(event.target)))
      ) {
        
        this.showPopover = false
      }
    },

    handleMoveStart () {
      this.showPopover = false
    },

    handleExpand (index) {
      this.columns[index].isExpand = !this.columns[index].isExpand
    }
  }
}
</script>

<style lang="scss">
.fm-columns-config-container{
  .column-config-item{
    display: flex;
    margin-bottom: 10px;

    .is-active{
      color: var(--el-color-primary);
    }

    .is-template {
      position: relative;

      &::after{
        background: var(--el-fill-color-light);
        display: block;
        content: 'customize';
        position: absolute;
        left: 0;
        right: 0;
        text-align: center;
        opacity: 0.6;
        z-index: 999;
      }
    }
  }

  .column-config-parent{
    padding-left: 20px;
    margin-bottom: 10px;
    border-left: 1px dashed var(--el-border-color);
    border-bottom: 1px dashed var(--el-border-color);

    .column-config-item{
      position: relative;
      &::before{
        display: block;
        content: '';
        width: 20px;
        height: 0;
        position: absolute;
        border-bottom: 1px dashed var(--el-border-color);
        left: -20px;
        top: 15px;
      }
    }
  }

  .column-config-header{
    margin-left: 24px;
    margin-bottom: 3px;
    margin-right: 50px;
    display: flex;

    label{
      width: 50%;
      padding-left: 3px;
    }
  }
}

.fm-columns-config-popover-close{
  height: 30px;
  width: 30px;
  cursor: pointer;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 10px;
  
  :hover{
    color: #000;
  }
}

.fm-columns-config-form{
  padding: 10px;
  // background: var(--el-fill-color-light);
  border-radius: 5px;

  .code-line{
    font-size: 14px;
    color: var(--el-color-primary);
    font-weight: 500;
  }
}
</style>
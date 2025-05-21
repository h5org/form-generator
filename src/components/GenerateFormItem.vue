<template>
  <div class="fm-form-item" :data-id="widget.model" v-if="widget.key">
    <el-form-item 
      v-if="widget.type != 'divider' && widget.type != 'alert' && elementDisplay" 
      :prop="fieldNode ? fieldNode + '.' + widget.model : widget.model"
      :rules="rules[ruleProp]"
      :class="{
        [widget.options && widget.options.customClass]: widget.options && widget.options.customClass?true: false,
        'no-label-form-item': widget.options.isLabelWidth && widget.options.labelWidth == 0,
        'fm-label-wrap': widget.options.labelWrap
      }"
      :label="(widget.options.hideLabel || (isTable && !isMobile)) ? '' : widget.name"
      :label-width="widget.options.hideLabel ? '0px' : (widget.options.isLabelWidth ? widget.options.labelWidth + 'px' : '')"
      :key="widget.key"
      :required="widget.options.required"
      ref="generateFormItem"
    >
      <div v-if="widget.options.tip" class="fm-item-tooltip" v-html="widget.options.tip.replace(/\n/g, '<br/>')"></div>
      <generate-element-item 
        :blanks="blanks" 
        :is-table="isTable" 
        :table-name="tableName"
        :widget="widget" 
        :models="dataModels"
        :remote="remote"
        :edit="edit"
        :remote-option="remoteOption"
        :key="widget.key"
        :rules="rules"
        v-model="dataModel"
        :platform="platform"
        :preview="preview"
        :data-source-value="dataSourceValue"
        :event-function="eventFunction"
        :print-read="printRead"
        :is-subform="isSubform"
        :row-index="rowIndex"
        :sub-name="subName"
        :is-dialog="isDialog"
        :dialog-name="dialogName"
        ref="generateElementItem"
        :container-key="containerKey"
        :is-group="isGroup"
        :group="group"
        :field-node="fieldNode ? fieldNode + '.' + widget.model : widget.model"
      >
        
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-element-item>
      
    </el-form-item>

    <el-form-item v-if="widget.type == 'divider' && elementDisplay" label-width="0">
      <el-divider 
        :content-position="widget.options.contentPosition"
        v-bind="widget.options.customProps"
        style="margin-bottom: 10px;"
        :ref="'fm-'+widget.model"
      >
        {{widget.name}}
      </el-divider>
    </el-form-item>

    
    <el-form-item v-if="widget.type == 'alert' && elementDisplay" label-width="0">
      <el-alert 
        :title="widget.options.title"
        :type="widget.options.type"
        :description="widget.options.description"
        :closable="widget.options.closable"
        :center="widget.options.center"
        :show-icon="widget.options.showIcon"
        :effect="widget.options.effect"
        :style="{width: widget.options.width}"
        v-bind="widget.options.customProps"
        @close="display[widget.model] = false"
        :ref="'fm-'+widget.model"
      ></el-alert>
    </el-form-item>
    
  </div>
  
</template>

<script>
import GenerateElementItem from './GenerateElementItem.vue'
import { generateFormItemMixin } from '../mixins/generateFormItem.js'

export default {
  components: {
    GenerateElementItem
  },
  mixins: [generateFormItemMixin]
}
</script>

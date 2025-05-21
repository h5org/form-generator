<template>
  <div class="fm-form-item " :data-id="widget.model" v-if="widget.key">
    <generate-element-item
      v-if="widget.type != 'divider' && widget.type != 'alert' && elementDisplay"
      :key="widget.key"
      :label="widget.options.hideLabel ? '' : widget.name"
      :label-width="widget.options.hideLabel ? '0px' : (widget.options.isLabelWidth ? widget.options.labelWidth + 'px' : config.labelWidth + 'px')"
      :config="config"
      :blanks="blanks" 
      :is-table="isTable" 
      :table-name="tableName"
      :widget="widget" 
      :models="dataModels"
      :remote="remote"
      :edit="edit"
      :remote-option="remoteOption"
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

    <van-divider
      v-if="widget.type == 'divider' && elementDisplay"
      :content-position="widget.options.contentPosition"
      v-bind="widget.options.customProps"
    >{{ widget.name }}</van-divider>

    <van-notice-bar
      v-if="widget.type == 'alert' && elementDisplay"
      :wrapable="true"
      :color="widget.options.type === 'success' ? '#07c160' : 
              widget.options.type === 'warning' ? '#ed6a0c' :
              widget.options.type === 'error' ? '#ee0a24' : 
              widget.options.type === 'info' ? '#1989fa' : ''"
      :background="widget.options.type === 'success' ? '#e8fff0' : 
              widget.options.type === 'warning' ? '#fffbe8' :
              widget.options.type === 'error' ? '#ffe8e8' : 
              widget.options.type === 'info' ? '#e8f4ff' : ''"
      :left-icon="widget.options.showIcon ? (
        widget.options.type === 'success' ? 'passed' :
        widget.options.type === 'warning' ? 'warning-o' :
        widget.options.type === 'error' ? 'close' :
        widget.options.type === 'info' ? 'info-o' : '' 
      ) : ''"
      :mode="widget.options.closable ? 'closeable' : ''"
    >
      {{ widget.options.description || widget.options.title }}
    </van-notice-bar>

    <div></div>
  </div>
</template>

<script>
import GenerateElementItem from './GenerateElementItem.vue'
import { generateFormItemMixin } from '../../mixins/generateFormItem.js'

export default {
  components: {
    GenerateElementItem
  },
  mixins: [generateFormItemMixin],
}
</script>
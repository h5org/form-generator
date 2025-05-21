<template>
  <div class="fm-form-item" :data-id="widget.model" v-if="widget.key">
    <a-form-item 
      v-if="widget.type != 'divider' && widget.type != 'alert' &&  elementDisplay" 
      :name="fieldNode ? [...fieldNode.split('.'), widget.model] : widget.model"
      :rules="rules[ruleProp]"
      :class="{
        [widget.options && widget.options.customClass]: widget.options && widget.options.customClass?true: false,
        'no-label-form-item': widget.options.isLabelWidth && widget.options.labelWidth == 0,
        'no-label-left': widget.name === '',
        'fm-label-wrap': widget.options.labelWrap
      }"
      :label="(widget.options.hideLabel || (isTable && !isMobile)) ? '' : widget.name"
      :key="widget.key"
      :required="widget.options.required"
      ref="generateFormItem"
      :colon="config?.labelSuffix ? true : false"
      validateFirst
      
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
        :container-key="containerKey"
        :print-read="printRead"
        :config="config"
        :is-subform="isSubform"
        :row-index="rowIndex"
        :sub-name="subName"
        :is-dialog="isDialog"
        :dialog-name="dialogName"
        ref="generateElementItem"
        :is-group="isGroup"
        :group="group"
        :field-node="fieldNode ? fieldNode + '.' + widget.model : widget.model"
      >
        
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-element-item>
    </a-form-item>

    <a-form-item v-if="widget.type == 'divider' && elementDisplay" :wrapperCol="{span: 0, offset: 0}">
      <a-divider 
        :orientation="widget.options.contentPosition"
        v-bind="widget.options.customProps"
        :ref="'fm-'+widget.model"
      >
        {{widget.name}}
      </a-divider>
    </a-form-item>

    <a-form-item v-if="widget.type == 'alert' && elementDisplay"  :wrapperCol="{span: 0, offset: 0}">
      <a-alert 
        :message="widget.options.title"
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
      ></a-alert>
    </a-form-item>
  </div>
  
</template>

<script>
import GenerateElementItem from './GenerateElementItem.vue'
import { generateFormItemMixin } from '../../mixins/generateFormItem.js'

export default {
  components: {
    GenerateElementItem
  },
  mixins: [generateFormItemMixin]
}
</script>

<style lang="scss" >
.fm-form, .fm-generate-ant-dialog{
  .fm-form-item{

    .ant-form-item{
      .ant-col{
        max-width: none;
      }

      .ant-form-item-label{
        flex: 0 0 auto;
      }

      .ant-form-item-control{
        flex: 1;
      }
    }

    .ant-form-item{
      .ant-form-item-label{
        width: v-bind(labelWidth);
      }
    }

    .no-label-left{
      .ant-form-item-control{
        margin-left: v-bind(labelWidth);
      }
    }
  }
}
</style>
<template>
  <div
    class="widget-table-view" 
    :class="{
      active: selectWidget.key == element.key, 
      'is_req': element.options.required,
      'is_hidden': element.options.hidden,
      'mobile': platform == 'mobile'
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetTableItem"
    :style="{
      width: platform != 'mobile' ? (!element.options.width ? '200px' : element.options.width) : ''
    }"
  >
    <widget-element-item 
      :element="element" 
      :is-table="true" 
      :key="element.key"
      :label="element.options.hideLabel ? '' : element.name"
      :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : config.labelWidth + 'px')"
      :config="config"
    ></widget-element-item>
  
    <div class="widget-view-action" v-if="selectWidget.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>
    <div class="widget-view-drag" v-if="selectWidget.key == element.key">
      <i class="fm-iconfont icon-drag drag-widget"></i>
    </div>
  
    <div class="widget-view-model" :style="{'color': element.options.dataBind ? '' : '#666'}">
      <span>{{element.model}}</span>
    </div>
  
    <div class="widget-view-type ">
      <span>{{element.type ? this.$t('fm.components.fields.' + element.type) : ''}}</span>
    </div>
  </div>
</template>
  
<script>
import WidgetElementItem from './WidgetElementItem.vue'
import { widgetTableItemMixin } from '../../mixins/widgetTableItem.js'

export default {
  components: {
    WidgetElementItem
  },
  props: ['config'],
  mixins: [widgetTableItemMixin]
}
</script>
  
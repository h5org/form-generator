<template>
<div>
  <div class="widget-view"
    :class="{
      active: select.key == element.key, 
      'is_req': element.options.required, 
      'is_hidden': element.options.hidden,
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    v-if="element && element.key && element.type != 'divider' && element.type != 'alert'"
    ref="widgetFormItem"
  >
    <el-form-item 
      :class="{
        [element.options && element.options.customClass]: element.options.customClass?true: false,
        'fm-label-wrap': element.options.labelWrap
      }"
      :label="element.options.hideLabel ? '' : element.name"
      :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : '')"
    >
      <div v-if="element.options.tip" class="fm-item-tooltip" v-html="element.options.tip.replace(/\n/g, '<br/>')"></div>
      <widget-element-item :element="element" :is-table="false" :key="element.key"></widget-element-item>
    </el-form-item>

    <div class="widget-view-action" v-if="select.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag" v-if="select.key == element.key">
      <i class="fm-iconfont icon-drag drag-widget"></i>
    </div>

    <div class="widget-view-model" :style="{'color': element.options.dataBind ? '' : '#666'}">
      <span>{{element.model}}</span>
    </div>

    <div class="widget-view-type ">
      <span>{{element.type ? this.$t('fm.components.fields.' + element.type) : ''}}</span>
    </div>
  </div>
  <div class="widget-view no-put"
    v-if="element && element.key && (element.type == 'divider' || element.type == 'alert')" 
    :class="{active: select.key == element.key, 'is_hidden': element.options.hidden}"
    @click.stop="handleSelectWidget(index)"
    style="padding-bottom: 0;"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetFormItem"
  >
    <el-form-item label-width="0">
      <el-divider 
        :content-position="element.options.contentPosition"
        v-bind="element.options.customProps"
        v-if="element.type == 'divider'">
        {{element.name}}
      </el-divider>

      <el-alert v-if="element.type == 'alert'"
        :title="element.options.title"
        :type="element.options.type"
        :description="element.options.description"
        :closable="element.options.closable"
        :center="element.options.center"
        :show-icon="element.options.showIcon"
        :effect="element.options.effect"
        :style="{width: element.options.width}"
        v-bind="element.options.customProps"
      ></el-alert>
    </el-form-item>

    <div class="widget-view-action" v-if="select.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag" v-if="select.key == element.key">
      <i class="fm-iconfont icon-drag drag-widget"></i>
    </div>

    <div class="widget-view-model " :style="{'color': element.options.dataBind ? '' : '#666'}">
      <span>{{element.model}}</span>
    </div>

    <div class="widget-view-type ">
      <span>{{element.type ? this.$t('fm.components.fields.' + element.type) : ''}}</span>
    </div>
  </div>
</div>
</template>

<script>
import WidgetElementItem from './WidgetElementItem.vue'
import { widgetFormItemMixin } from '../mixins/widgetFormItem.js'

export default {
  name: 'WidgetFormItem',
  components: {
    WidgetElementItem
  },
  mixins: [widgetFormItemMixin] 
}
</script>

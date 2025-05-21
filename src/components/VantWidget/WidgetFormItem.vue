<template>
  <div>
    <div class="widget-view"
      v-if="element && element.key && element.type != 'divider' && element.type != 'alert'"
      :class="{
        active: select.key == element.key,
        'is_hidden': element.options.hidden,
      }"
      @click.stop="handleSelectWidget(index)"
      @mouseover.stop="handleMouseover"
      @mouseout="handleMouseout"
      ref="widgetFormItem"
    >

      <widget-element-item 
        :element="element" 
        :is-table="false" 
        :key="element.key"
        :label="element.options.hideLabel ? '' : element.name"
        :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : config.labelWidth + 'px')"
        :config="config"
      ></widget-element-item>

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
      @mouseover.stop="handleMouseover"
      @mouseout="handleMouseout"
      ref="widgetFormItem"
    >
      <van-divider
        v-if="element.type == 'divider'"
        :content-position="element.options.contentPosition"
        v-bind="element.options.customProps"
      >{{ element.name }}</van-divider>

      <van-notice-bar
        v-if="element.type == 'alert'"
        :wrapable="true"
        :color="element.options.type === 'success' ? '#07c160' : 
               element.options.type === 'warning' ? '#ed6a0c' :
               element.options.type === 'error' ? '#ee0a24' : 
               element.options.type === 'info' ? '#1989fa' : ''"
        :background="element.options.type === 'success' ? '#e8fff0' : 
               element.options.type === 'warning' ? '#fffbe8' :
               element.options.type === 'error' ? '#ffe8e8' : 
               element.options.type === 'info' ? '#e8f4ff' : ''"
        :left-icon="element.options.showIcon ? (
          element.options.type === 'success' ? 'passed' :
          element.options.type === 'warning' ? 'warning-o' :
          element.options.type === 'error' ? 'close' :
          element.options.type === 'info' ? 'info-o' : '' 
        ) : ''"
        :mode="element.options.closable ? 'closeable' : ''"
      >
        {{ element.options.description || element.options.title }}
      </van-notice-bar>

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
import { widgetFormItemMixin } from '../../mixins/widgetFormItem.js'
import WidgetElementItem from './WidgetElementItem.vue'

export default {
  name: 'VantWidgetFormItem',
  components: {
    WidgetElementItem
  },
  props: ['config'],
  mixins: [widgetFormItemMixin] 
}
</script>
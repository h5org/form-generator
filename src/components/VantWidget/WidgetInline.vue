<template>
  <div
    class="widget-inline widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    :size="element.options.size"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetInline"
  >
    <div class="widget-inline-content">
      <draggable
        v-model="element.list"
        v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        :no-transition-on-drag="true"
        @add="handleWidgetInlineAdd($event, element)"
        @update="handleWidgetInlineUpdate"
        @start="setDragging(true)"
        @end="setDragging(false)"
        class="widget-inline-list"
        :class="{
          [element.options && element.options.customClass]: element.options.customClass ? true : false
        }"
        item-key="key"
        :style="{
          display: element.options.flex ? 'flex' : 'block',
          'flex-direction': 'row',
          'flex-wrap': 'wrap',
          'justify-content': element.options.flexJustify || 'normal',
          'align-items': element.options.flexAlign || 'normal'
        }"
      >
        <template #item="{element:item, index}"> 

          <template v-if="item && item.key" > 
            <widget-form-item
              :key="item.key"
              :element="item" 
              v-model:select="selectWidget" 
              :index="index" :data="element"
              @select-change="handleSelectChange($event, element)"
              :form-key="formKey"
              :style="{'margin-right': element.options.spaceSize+'px'}"
              :config="config"
            >
            </widget-form-item>
          </template>
        </template>
      </draggable>
    </div>

    <div class="widget-view-action widget-inline-action" v-if="selectWidget.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleInlineClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag widget-inline-drag" v-if="selectWidget.key == element.key">
      <i class="fm-iconfont icon-drag drag-widget"></i>
    </div>
    <div class="widget-view-model " :style="{'color': element.options.dataBind ? '' : '#666'}">
      <span>{{element.model}}</span>
    </div>

    <div class="widget-view-type ">
      <span>{{element.type ? this.$t('fm.components.fields.' + element.type) : ''}}</span>
    </div>
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem.vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { widgetInlineMixin } from '../../mixins/widgetInline.js'

export default {
  name: 'widget-inline',
  components: {
    Draggable,
    WidgetFormItem
  },
  props: ['config'],
  mixins: [widgetInlineMixin],
}
</script>
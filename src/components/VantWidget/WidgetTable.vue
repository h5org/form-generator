<template>
  <div 
    class="widget-table widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden,
      'mobile': platform == 'mobile'
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetTable"
  >
    <van-field
      :label="element.options.hideLabel ? '' : element.name"
      :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : config.labelWidth + 'px')"
      :labelAlign="element.options.labelWrap ? 'top' : config.labelPosition"
      style="padding-right: 2px;"
    >
      <template #input>
        <div class="widget-table-wrapper mobile" style="width: 100%;">
          <div class="widget-table-top" v-if="platform == 'mobile'" style="display: flex; align-items: center;">
            <van-checkbox v-if="element.options.selection" style="margin-right: 10px;" shape="square"># 1</van-checkbox>
            <span v-else># 1</span>
          </div>
          <div class="widget-table-content mobile">
            <draggable
              v-model="element.tableColumns"
              :group="{name: 'people', put: handlePut}"
              ghost-class="ghost"
              :animation="200"
              handle=".drag-widget"
              :no-transition-on-drag="true"
              @add="handleWidgetTableAdd($event, element)"
              @update="handleWidgetTableUpdate"
              @start="setDragging(true)"
              @end="setDragging(false)"
              class="widget-table-col" 
              item-key="key"
            >
              <template #item="{element:item, index}">
                <widget-table-item 
                  :key="item.key" 
                  :element="item"
                  v-model:select="selectWidget" 
                  :index="index" 
                  :data="element.tableColumns"
                  @select-change="handleSelectChange($event, item)"
                  :platform="platform"
                  :form-key="formKey"
                  :config="config"
                >
                </widget-table-item>
              </template>
            </draggable>
          </div>
        </div>
      </template>
    </van-field>

    <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleTableClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
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
import Draggable from 'vuedraggable/src/vuedraggable'
import WidgetTableItem from './WidgetTableItem.vue'
import { widgetTableMixin } from '../../mixins/widgetTable.js'

export default {
  components: {
    Draggable,
    WidgetTableItem
  },
  props: ['config'],
  mixins: [widgetTableMixin]
}
</script>

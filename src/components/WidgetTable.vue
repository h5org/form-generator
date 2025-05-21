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
    <el-form-item 
      :label="element.options.hideLabel ? '' : element.name"
      :label-width="element.options.hideLabel ? '0px' : (element.options.isLabelWidth ? element.options.labelWidth + 'px' : '')"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass?true: false,
        'fm-label-wrap': element.options.labelWrap
      }"
    >
      <div v-if="element.options.tip" class="fm-item-tooltip" v-html="element.options.tip.replace(/\n/g, '<br/>')"></div>
      <div class="widget-table-wrapper" :class="{'mobile': platform == 'mobile'}">
        <div class="widget-table-left" v-if="platform != 'mobile' && element.options.selection">
          <div class="widget-table-left__top"><el-checkbox ></el-checkbox></div>
          <div class="widget-table-left__body" style="padding: 8px;"><el-checkbox></el-checkbox></div>
        </div>
        <div class="widget-table-left" v-if="platform != 'mobile' && element.options.showControl">
          <div class="widget-table-left__top">#</div>
          <div class="widget-table-left__body">1</div>
        </div>
        <div class="widget-table-top" v-if="platform == 'mobile'">
          <el-checkbox v-if="element.options.selection" style="margin-right: 10px;"></el-checkbox>
          # 1
        </div>
        <div class="widget-table-content" :class="{'mobile': platform == 'mobile'}">
          <div v-if="element.tableColumns.length == 0" class="table-empty">{{$t('fm.description.tableEmpty')}}</div>

          <div :style="{width: platform != 'mobile' ? columnsWidthStyle : '100%'}">
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
                >
                </widget-table-item>
              </template>
            </draggable>
          </div>

        </div>
      </div>
    </el-form-item>
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
import { widgetTableMixin } from '../mixins/widgetTable.js'

export default {
  components: {
    Draggable,
    WidgetTableItem
  },
  mixins: [widgetTableMixin]
}
</script>

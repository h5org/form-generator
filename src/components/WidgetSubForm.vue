<template>
  <div class="widget-subform widget-view"
    :class="{
      active: select.key && select.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetSubform"
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
      <div class="widget-subform-wrapper">
        <draggable
          v-model="element.list"
          v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetSubFormAdd($event, element)"
          @update="handleWidgetSubFormUpdate"
          @start="setDragging(true)"
          @end="setDragging(false)"
          class="widget-col-list"
          :class="{
            [element.options && element.options.customClass]: element.options.customClass ? true : false
          }"
          item-key="key"
        >
          <template #item="{element:item, index}">
            <widget-tab-item
              v-if="item.type === 'tabs'"
              :key="`tabs-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index" 
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-tab-item>

            <widget-collapse
              v-else-if="item.type === 'collapse'"
              :key="`collapse-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index" 
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-collapse>

            <widget-card
              v-else-if="item.type === 'card'"
              :key="`card-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index" 
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-card>

            <widget-group
              v-else-if="item.type === 'group'"
              :key="`group-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index" 
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-group>

            <widget-inline
              v-else-if="item.type === 'inline'"
              :key="`inline-${item.key}`" 
              :element="item"
              v-model:select="selectWidget"
              :index="index"
              :data="element"
              @select-change="handleSelectChange($event, item)"
              :platform="platform"
              :form-key="formKey"
              :subform="true"
            ></widget-inline>

            <widget-report
              v-else-if="item.type === 'report'"
              :key="`report-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index"
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-report>

            <widget-sub-form
              v-else-if="item.type === 'subform'"
              :key="`subform-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index"
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-sub-form>

            <widget-table
              v-else-if="item.type === 'table'"
              :key="`table-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index"
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-table>

            <widget-form-item 
              v-else-if="item.type !== 'grid'" 
              :key="`form-item-${item.key}`" 
              :element="item" 
              v-model:select="selectWidget" 
              :index="index" :data="element"
              @select-change="handleSelectChange($event, item)"
              :form-key="formKey"
            >
            </widget-form-item>

            <widget-col-item
              v-else
              :key="`grid-${item.key}`" 
              :element="item"
              v-model:select="selectWidget" 
              :index="index"
              :data="element"
              @select-change="handleSelectChange($event, item)" 
              :platform="platform" 
              :form-key="formKey"
              :subform="true"
            >
            </widget-col-item>
        </template>
        </draggable>
      </div>
    </el-form-item>

    <div class="widget-view-action widget-subform-action" v-if="select.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleWidgetClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag widget-subform-drag" v-if="select.key == element.key">
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
import Draggable from 'vuedraggable/src/vuedraggable'
import WidgetFormItem from './WidgetFormItem.vue'
import WidgetInline from './WidgetInline.vue'
import WidgetTable from './WidgetTable.vue'
import { defineAsyncComponent } from 'vue'
import { widgetSubFormMixin } from '../mixins/widgetSubForm.js'

export default {
  name: 'widget-sub-form',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetInline,
    WidgetTable,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetTabItem: defineAsyncComponent(() => import('./WidgetTabItem.vue')),
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetSubFormMixin]
}
</script>
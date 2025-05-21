<template>
  <div
    class="widget-collapse widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetCollapse"
  >
    <el-collapse v-model="tabActive"
      :accordion="element.options.accordion"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass?true: false
      }"
    >
      <el-collapse-item
        :key="item.name" 
        :title="item.title" 
        :name="item.name" 
        v-for="(item, index) in element.tabs"
      >
        <draggable
          v-model="item.list"
          v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetTabAdd($event, element, index)"
          @update="handleWidgetTabUpdate"
          @start="setDragging(true)"
          @end="setDragging(false)"
          class="widget-col-list"
          item-key="key"
        >
            <template #item="{element: tab, index: tabindex}">
                <widget-tab-item
                  v-if="tab.type === 'tabs'"
                  :key="`tabs-${tab.key}`"  
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-tab-item>

                <widget-collapse
                  v-else-if="tab.type === 'collapse'"
                  :key="`collapse-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-collapse>

                <widget-table
                  v-else-if="tab.type === 'table'"
                  :key="`table-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-table>

                <widget-sub-form
                  v-else-if="tab.type === 'subform'"
                  :key="`subform-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-sub-form>

                <widget-card
                  v-else-if="tab.type === 'card'"
                  :key="`card-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-card>

                <widget-group
                  v-else-if="tab.type === 'group'"
                  :key="`group-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-group>

                <widget-inline
                  v-else-if="tab.type === 'inline'"
                  :key="`inline-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform"
                  :form-key="formKey"
                ></widget-inline>

                <widget-report
                  v-else-if="tab.type === 'report'"
                  :key="`report-${tab.key}`"
                  :element="tab"
                  v-model:select="selectWidget" 
                  :index="tabindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform" 
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-report>

                <widget-col-item
                  v-else-if="tab.type === 'grid'" 
                  :key="`grid-${tab.key}`" 
                  :element="tab" 
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform" 
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-col-item>

                <widget-form-item 
                  v-else
                  :key="`form-item-${tab.key}`" 
                  :element="tab" 
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)"
                  :form-key="formKey"
                >
                </widget-form-item>
                
            </template>
        </draggable>
      </el-collapse-item>
    </el-collapse>

    <div class="widget-view-action widget-col-action" v-if="selectWidget.key == element.key">
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleTabClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag widget-col-drag" v-if="selectWidget.key == element.key">
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
import WidgetTable from './WidgetTable.vue'
import WidgetInline from './WidgetInline.vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { widgetCollapseMixin } from '../mixins/widgetCollapse.js'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'widget-collapse',
  components: {
    WidgetFormItem,
    WidgetTable,
    WidgetInline,
    Draggable,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetTabItem: defineAsyncComponent(() => import('./WidgetTabItem.vue')),
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetCollapseMixin],
}
</script>

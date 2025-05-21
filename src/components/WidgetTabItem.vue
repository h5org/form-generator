<template>
  <div
    class="widget-tab widget-view"
    :class="{
      active: selectWidget.key && selectWidget.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetTab"
  >
    <el-tabs v-model="tabActive" 
      :type="element.options.type"
      :tab-position="element.options.tabPosition"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass?true: false
      }"
      :key="tabsKey"
    >
      <el-tab-pane 
        :key="item.name" 
        :label="item.label" 
        :name="item.name" 
        v-for="(item, index) in element.tabs"
      >
        <!-- <div v-if="element.tabs[index].list.length == 0" class="widget-empty">{{$t('fm.description.tableEmpty')}}</div> -->
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

                <widget-form-item 
                  v-else-if="tab.type !== 'grid'" 
                  :key="`form-item-${tab.key}`" 
                  :element="tab" 
                  v-model:select="selectWidget" 
                  :index="tabindex" :data="item"
                  @select-change="handleSelectChange($event, item)"
                  :form-key="formKey"
                >
                </widget-form-item>

                <widget-col-item
                  v-else
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
            </template>
          
        </draggable>
      </el-tab-pane>
    </el-tabs>

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
import { defineAsyncComponent, ref, watch } from 'vue'
import { widgetTabItemMixin } from '../mixins/widgetTabItem.js'

export default {
  name: 'widget-tab-item',
  components: {
    WidgetFormItem,
    WidgetTable,
    WidgetInline,
    Draggable,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetTabItemMixin],
  setup (props) {
    const tabsKey = ref(Math.random().toString(36).slice(-8))

    watch(
      () => props.element.tabs.map(item => item.name),
      (newVal, oldVal) => {
        if (newVal.join() !== oldVal.join()) {
          tabsKey.value = Math.random().toString(36).slice(-8)
        }
      }
    )

    return {
      tabsKey
    }
  }
}
</script>


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
    <van-tabs 
      v-model:active="tabActive"
      :type="element.options.type ? 'card' : 'line'"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass?true: false
      }"
    >
      <van-tab 
        v-for="(item, index) in element.tabs" 
        :title="item.label" :name="item.name"
        :key="item.name"
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
          <template #item="{ element: tab, index: tabindex }">
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
              :config="config"
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
              :config="config"
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
              :config="config"
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
              :config="config"
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
              :config="config"
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
              :config="config"
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
              :config="config"
            ></widget-inline>

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
              :config="config"
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
              :config="config"
            >
            </widget-form-item>
          </template>
        </draggable>
      </van-tab>
    </van-tabs>

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
import Draggable from 'vuedraggable/src/vuedraggable'
import { defineAsyncComponent } from 'vue'
import { widgetTabItemMixin } from '../../mixins/widgetTabItem.js'

export default {
  name: 'VantWidgetTabItem',
  components: {
    WidgetFormItem,
    Draggable,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue')),
    WidgetTable: defineAsyncComponent(() => import('./WidgetTable.vue')),
    WidgetInline: defineAsyncComponent(() => import('./WidgetInline.vue')),
  },
  props: ['config'],
  mixins: [widgetTabItemMixin]
}
</script>

<template>
  <div class="widget-card widget-view"
    :class="{
      active: select.key && select.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    ref="widgetCard"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
  >
    
    <el-card 
      :shadow="element.options.shadow"
      :body-style="{
        padding: element.options.padding
      }"
      :style="{
        width: element.options.width,
        'border-width': element.options.bordered ? '1px' : '0px'
      }"
      :class="{
        [element.options?.customClass]: element.options?.customClass ? true: false
      }"
    >
      <template #header v-if="element.options.showHeader">
        <div>
          <span>{{element.options.title}}</span>

        </div>
      </template>
      <draggable
        v-model="element.list"
        v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
        :no-transition-on-drag="true"
        @add="handleWidgetCardAdd($event, element)"
        @update="handleWidgetCardUpdate"
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
          >
          </widget-collapse>

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
          >
          </widget-table>

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
          >
          </widget-sub-form>

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
          >
          </widget-card>

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
          >
          </widget-report>

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
          >
          </widget-group>

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
          >
          </widget-col-item>
        </template>
      </draggable>
    </el-card>

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
import { defineAsyncComponent } from 'vue'
import { widgetCardMixin } from '../mixins/widgetCard.js'

export default {
  name: 'widget-card',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetInline,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetTabItem: defineAsyncComponent(() => import('./WidgetTabItem.vue')),
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetTable: defineAsyncComponent(() => import('./WidgetTable.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetCardMixin]
}
</script>

<style lang="scss">
.fm-form .widget-form-container{
  .el-card__header{
    padding: v-bind(padding)
  }
}
</style>
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
    <van-cell-group
      :title="element.options.showHeader ? element.options.title : ''"
      :border="element.options.bordered"
    >
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
            :config="config"
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
            :config="config"
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
            :config="config"
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
            :config="config"
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
            :config="config"
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
            :config="config"
          ></widget-inline>

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
            :config="config"
          >
          </widget-group>
          
          <widget-col-item
            v-else-if="item.type === 'grid'"
            :key="`grid-${item.key}`"
            :element="item"
            v-model:select="selectWidget" 
            :index="index"
            :data="element"
            @select-change="handleSelectChange($event, item)" 
            :platform="platform"
            :form-key="formKey"
            :config="config"
          >
          </widget-col-item>
          
          <widget-form-item
            v-else
            :key="item.key"
            :element="item" 
            v-model:select="selectWidget" 
            :index="index" :data="element"
            @select-change="handleSelectChange($event, element)"
            :form-key="formKey"
            :config="config"
          >
          </widget-form-item>
        </template>
      </draggable>
    </van-cell-group>

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
import { widgetCardMixin } from '../../mixins/widgetCard.js'
import { defineAsyncComponent } from 'vue'

export default {
  name: 'widget-card',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetInline: defineAsyncComponent(() => import('./WidgetInline.vue')),
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetTabItem: defineAsyncComponent(() => import('./WidgetTabItem.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetTable: defineAsyncComponent(() => import('./WidgetTable.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  props: ['config'],
  mixins: [widgetCardMixin]
}
</script>

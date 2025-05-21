<template>
  <div
    class="widget-col widget-view"
    :class="{
      active: select.key && select.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetCol"
  >
    <el-row 
      :type="element.options.flex ? 'flex' : ''"
      :gutter="element.options.gutter || 0"
      :justify="element.options.justify"
      :align="element.options.align"
      :class="{
        [element.options && element.options.customClass]: element.options && element.options.customClass?true: false
      }"
    >
    
      <el-col
        class="widget-col-item"
        v-for="(item, i) in element.columns" :key="item.key" 
        :class="{
          active: select.key && select.key == item.key,
          [item.options && item.options.customClass]: item.options && item.options.customClass?true: false
        }"
        @click.stop="handleSelectItemWidget(i)"
        :span="getColSpan(item.options)"
        :offset="item.options ? item.options.offset : 0"
        :push="item.options ? item.options.push : 0"
        :pull="item.options ? item.options.pull : 0"
        @mouseover.stop="handleMouseoverCol(i)"
        @mouseout="handleMouseoutCol(i)"
        ref="widgetColItem"
      >
        <draggable
          :list="element.columns[i].list"
          v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetColAdd($event, element, i)"
          @update="handleWidgetColUpdate"
          @start="setDragging(true)"
          @end="setDragging(false)"
          class="widget-col-list"
          item-key="key"
        >
            <template #item="{element:col, index:colindex}">

                <widget-col-item
                  v-if="col.type === 'grid'" 
                  :key="`grid-${col.key}`"
                  :element="col" 
                  v-model:select="selectWidget" 
                  :index="colindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-col-item>

                <widget-tab-item
                  v-else-if="col.type === 'tabs'"
                  :key="`tabs-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-tab-item>

                <widget-collapse
                  v-else-if="col.type === 'collapse'"
                  :key="`collapse-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-collapse>

                <widget-report
                  v-else-if="col.type === 'report'"
                  :key="`report-${col.key}`"
                  :element="col" 
                  v-model:select="selectWidget" 
                  :index="colindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)" 
                  :platform="platform"
                  :form-key="formKey"
                  :subform="subform"
                >
                </widget-report>

                <widget-table
                  v-else-if="col.type === 'table'"
                  :key="`table-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-table>

                <widget-sub-form
                  v-else-if="col.type === 'subform'"
                  :key="`subform-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-sub-form>

                <widget-card
                  v-else-if="col.type === 'card'"
                  :key="`card-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-card>

                <widget-group
                  v-else-if="col.type === 'group'"
                  :key="`group-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex"
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-group>

                <widget-inline
                  v-else-if="col.type === 'inline'"
                  :key="`inline-${col.key}`"
                  :element="col"
                  v-model:select="selectWidget" 
                  :index="colindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)"  
                  :platform="platform"
                  :form-key="formKey"
                >
                </widget-inline>

                <widget-form-item 
                  v-else
                  :key="`form-item-${col.key}`" 
                  :element="col" 
                  v-model:select="selectWidget" 
                  :index="colindex" 
                  :data="item"
                  @select-change="handleSelectChange($event, item)"
                  :form-key="formKey"
                >
                </widget-form-item>
            </template>
          
        </draggable>

        <div class="widget-view-action widget-col-action" v-if="select.key == item.key">
          <i class="fm-iconfont icon-icon_clone" @click.stop="handleColItemClone(index, i)" :title="$t('fm.tooltip.clone')"></i>
          <i class="fm-iconfont icon-trash" @click.stop="handleColItemDelete(index, i)" v-if="element.columns.length > 1" :title="$t('fm.tooltip.trash')"></i>
        </div>

        <div class="widget-view-type ">
          <span>{{item.type ? this.$t('fm.components.fields.' + item.type) : ''}}</span>
        </div>
      </el-col>
    </el-row>

    <div class="widget-view-action widget-col-action" v-if="select.key == element.key">
      <i class="fm-iconfont icon-tianjiazengjiajia" @click.stop="handleAddCol(index)" :title="$t('fm.actions.addColumn')"></i>

      <i class="fm-iconfont icon-icon_clone" @click.stop="handleColClone(index)" :title="$t('fm.tooltip.clone')"></i>
      <i class="fm-iconfont icon-trash" @click.stop="handleWidgetDelete(index)" :title="$t('fm.tooltip.trash')"></i>
    </div>

    <div class="widget-view-drag widget-col-drag" v-if="select.key == element.key">
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
import { defineAsyncComponent } from 'vue'
import { widgetColItemMixin } from '../mixins/widgetColItem.js'
export default {
  name: 'widget-col-item',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTable,
    WidgetInline,
    WidgetReport: defineAsyncComponent(() => import('./WidgetReport.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetTabItem: defineAsyncComponent(() => import('./WidgetTabItem.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetColItemMixin]
}
</script>

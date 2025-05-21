<template>
  <div class="widget-dialog widget-view"
    :class="{
      active: select.key && select.key == element.key,
      'is_hidden': !element.options.visible
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetDialog"
  >
    
    <div class="el-dialog" :class="{'el-dialog--center' : element.options.center}" 
      :style="{
        '--el-dialog-width': element.options.width ? element.options.width : '100%',
        '--el-dialog-margin-top': element.options.top
      }">
      <div class="el-dialog__header">
        <span class="el-dialog__title">{{element.options.title}}</span>
        <button v-if="element.options.showClose" aria-label="Close this dialog" class="el-dialog__headerbtn" type="button"><i class="el-icon el-dialog__close"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg></i></button>
      </div>

      <div class="el-dialog__body">
        <draggable
          v-model="element.list"
          v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          :no-transition-on-drag="true"
          @add="handleWidgetDialogAdd($event, element)"
          @update="handleWidgetDialogUpdate"
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
      </div>
      <div class="el-dialog__footer" v-if="element.options.showCancel || element.options.showOk">
        <div>
          <el-button v-if="element.options.showCancel">{{element.options.cancelText}}</el-button>
          <el-button type="primary" v-if="element.options.showOk" :loading="element.options.confirmLoading">{{element.options.okText}}</el-button>
        </div>
      </div>
    </div>

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
import { widgetDialogMixin } from '../mixins/widgetDialog.js'

export default {
  name: 'widget-dialog',
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
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetDialogMixin]
}
</script>
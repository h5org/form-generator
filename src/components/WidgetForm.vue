<template>
  <div class="widget-form-container"
    :class="`${platform}`"
  >
    <el-form  
      :size="data.config.size" 
      :label-position="data.config.labelPosition" 
      :label-width="data.config.labelWidth + 'px'"
      :class="{
        [data.config && data.config.customClass]:  (data.config && data.config.customClass) ? true : false,
      }"
      :style="{width: data.config.width, margin: 'auto'}"
      :label-suffix="data.config?.labelSuffix ? ' : ' : ' '"
    >
      <div v-if="data.list.length == 0" class="form-empty">{{$t('fm.description.containerEmpty')}}</div>
      <el-scrollbar ref="formScrollRef">
        <draggable
          :list="data.list" 
          v-bind="{group:'people', ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
          @add="handleWidgetAdd"
          @update="handleWidgetUpdate"
          @start="handleMoveStart"
          @end="handleMoveEnd"
          :no-transition-on-drag="true"
          item-key="key"
          class="widget-form-list"
        >

          <template #item="{element, index}">
            
              <widget-table
                v-if="element.type === 'table'"
                :key="`table-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform"
                :form-key="formKey"
              >
              </widget-table>

              <widget-collapse
                v-else-if="element.type === 'collapse'"
                :key="`collapse-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange"  
                :platform="platform"
                :form-key="formKey"
              >
              </widget-collapse>

              <widget-tab-item
                v-else-if="element.type === 'tabs'"
                :key="`tabs-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange"  
                :platform="platform"
                :form-key="formKey"
              >
              </widget-tab-item>

              <widget-report
                v-else-if="element.type === 'report'"
                :key="`report-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-report>

              <widget-inline
                v-else-if="element.type === 'inline'"
                :key="`inline-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index"
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-inline>

              <widget-sub-form
                v-else-if="element.type === 'subform'"
                :key="`subform-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index"
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-sub-form>

              <widget-group
                v-else-if="element.type === 'group'"
                :key="`group-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index"
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-group>

              <widget-dialog
                v-else-if="element.type === 'dialog'"
                :key="`dialog-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index"
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-dialog>

              <widget-card
                v-else-if="element.type === 'card'"
                :key="`card-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index"
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-card>

              <widget-form-item 
                v-else-if="element.type !== 'grid'" 
                :key="`form-item-${element.key}`" 
                :element="element" 
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange" 
                :form-key="formKey" 
              >
              </widget-form-item>

              <widget-col-item
                v-else
                :key="`grid-${element.key}`" 
                :element="element" 
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange"
                :platform="platform"
                :form-key="formKey"
              >
              </widget-col-item>
            
          </template>
        </draggable>
      </el-scrollbar>
    </el-form>
  </div>
</template>

<script>
import Draggable from 'vuedraggable/src/vuedraggable'
import WidgetFormItem from './WidgetFormItem.vue'
import WidgetColItem from './WidgetColItem.vue'
import WidgetTable from './WidgetTable.vue'
import WidgetTabItem from './WidgetTabItem.vue'
import WidgetReport from './WidgetReport.vue'
import WidgetInline from './WidgetInline.vue'
import WidgetSubForm from './WidgetSubForm.vue'
import WidgetCollapse from './WidgetCollapse.vue'
import WidgetDialog from './WidgetDialog.vue'
import WidgetCard from './WidgetCard.vue'
import WidgetGroup from './WidgetGroup.vue'
import { widgetFormMixin } from '../mixins/widgetForm.js'

export default {
  name: 'WidgetForm',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetColItem,
    WidgetTable,
    WidgetTabItem,
    WidgetReport,
    WidgetInline,
    WidgetSubForm,
    WidgetCollapse,
    WidgetDialog,
    WidgetCard,
    WidgetGroup
  },
  mixins: [widgetFormMixin]
}
</script>

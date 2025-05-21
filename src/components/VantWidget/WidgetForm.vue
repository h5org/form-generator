<template>
  <van-config-provider :theme="isDark ? 'dark' : 'light'">
    <div class="widget-form-container"
      :class="`${platform}`"
    >
      <van-form
        :label-align="data.config.labelPosition"
        :label-width="data.config.labelWidth + 'px'"
        :class="{
          [data.config && data.config.customClass]:  (data.config && data.config.customClass) ? true : false,
        }"
        :colon="data.config?.labelSuffix ? true : false"
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
              
              <widget-col-item
                v-if="element.type === 'grid'"
                :key="`grid-${element.key}`" 
                :element="element" 
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                :config="data.config"
                @select-change="handleSelectChange"
                :platform="platform"
                :form-key="formKey"
              ></widget-col-item>

              <div v-else-if="element.type === 'report'" style="height: 0;"></div>

              <widget-tab-item
                v-else-if="element.type === 'tabs'"
                :key="`tabs-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                :config="data.config"
                @select-change="handleSelectChange"  
                :platform="platform"
                :form-key="formKey"
              >
              </widget-tab-item>

              <widget-collapse
                v-else-if="element.type === 'collapse'"
                :key="`collapse-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                :config="data.config"
                @select-change="handleSelectChange"  
                :platform="platform"
                :form-key="formKey"
              >
              </widget-collapse>

              <widget-inline
                v-else-if="element.type === 'inline'"
                :key="`inline-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index"
                :data="data"
                :config="data.config"
                @select-change="handleSelectChange" 
                :platform="platform" 
                :form-key="formKey"
              >
              </widget-inline>

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
                :config="data.config"
              >
              </widget-card>

              <widget-table
                v-else-if="element.type === 'table'"
                :key="`table-${element.key}`"
                :element="element"
                v-model:select="selectWidget" 
                :index="index" 
                :data="data"
                @select-change="handleSelectChange" 
                :platform="platform"
                :form-key="formKey"
                :config="data.config"
              >
              </widget-table>

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
                :config="data.config"
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
                :config="data.config"
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
                :config="data.config"
              >
              </widget-dialog>

              <widget-form-item
                v-else
                :element="element"
                v-model:select="selectWidget"
                :index="index"
                :data="data"
                :config="data.config"
                :formKey="formKey"
                @select-change="handleSelectChange"
              ></widget-form-item>
            </template>
          </draggable>
        </el-scrollbar>
      </van-form>
    </div>
  </van-config-provider>
</template>

<script>
import WidgetFormItem from './WidgetFormItem.vue'
import Draggable from 'vuedraggable/src/vuedraggable'
import { widgetFormMixin } from '../../mixins/widgetForm.js'
import WidgetColItem from './WidgetColItem.vue'
import WidgetTabItem from './WidgetTabItem.vue'
import WidgetCollapse from './WidgetCollapse.vue'
import WidgetInline from './WidgetInline.vue'
import WidgetCard from './WidgetCard.vue'
import WidgetTable from './WidgetTable.vue'
import WidgetSubForm from './WidgetSubForm.vue'
import WidgetGroup from './WidgetGroup.vue'
import WidgetDialog from './WidgetDialog.vue'

export default {
  name: 'VantWidgetForm',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetColItem,
    WidgetTabItem,
    WidgetCollapse,
    WidgetInline,
    WidgetCard,
    WidgetTable,
    WidgetSubForm,
    WidgetGroup,
    WidgetDialog
  },
  inject: ['isDark'],
  mixins: [widgetFormMixin]
}
</script>

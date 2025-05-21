<template>
  <div
    class="widget-report widget-view"
    :class="{
      active: select.key && select.key == element.key,
      'is_hidden': element.options.hidden
    }"
    @click.stop="handleSelectWidget(index)"
    @mouseover.stop="handleMouseover"
    @mouseout="handleMouseout"
    ref="widgetReport"
  >
    <div class="fm-report-table">
      <table class="fm-report-table__table" :style="{
          'border': 0,
          'width': element.options.width || 'auto'
        }"
        :class="{
          [element.options && element.options.customClass]: element.options.customClass ? true : false
        }"
      >
        <tbody>
          <tr>
            <template v-for="(th, i) in element.headerRow" :key="i">
              <th :style="{
                  'border-style': 'solid',
                  'border-width': element.options.borderWidth + 'px',
                  'border-color': element.options.borderColor,
                  'width': th.options.width,
                }"
                class="widget-report-item widget-report-header"
                valign="top"
                @click.stop="handleSelectHeaderWidget(i)"
                :class="{
                  active: select.key && select.key == th.key
                }"
                @mouseover.stop="handleMouseoverTH(i)"
                @mouseout="handleMouseoutTH(i)"
                :ref="`widgetTH_${i}`"
              ><div style="text-align: center; height: 10px;line-height: 10px;font-size: 12px;">{{th.options.width}}</div></th>
            </template>
          </tr>
          <tr :key="rowIndex" v-for="(row, rowIndex) in element.rows">
            <template v-for="(column, i) in row.columns" :key="rowIndex + '-' + i">
              <td :style="{
                  'border-style': 'solid',
                  'border-width': element.options.borderWidth + 'px',
                  'border-color': element.options.borderColor,
                  'width': column.options.width,
                  'height': column.options.height,
                  'text-align': column.options.textAlign,
                  'vertical-align': column.options.verticalAlign,
                }"
                v-if="!column.options.invisible"
                :colspan="column.options.colspan"
                :rowspan="column.options.rowspan"
                class="widget-report-item fm-report-table__td"
                :class="{
                  active: select.key && select.key == column.key,
                  [column.options.customClass]: column.options.customClass?true: false,
                  selected: selectIndex == i && column.options.colspan == 1
                }"
                @click.stop="handleSelectItemWidget(rowIndex, i)"
                valign="top"
                @mouseover.stop="handleMouseoverTD(rowIndex, i)"
                @mouseout="handleMouseoutTD(rowIndex, i)"
                :ref="`widgetTD_${rowIndex}_${i}`"
              >
                <!-- <div v-if="element.tabs[index].list.length == 0" class="widget-empty">{{$t('fm.description.tableEmpty')}}</div> -->
                <draggable
                  v-model="column.list"
                  v-bind="{group:{name: 'people', put: handlePut}, ghostClass: 'ghost',animation: 200, handle: '.drag-widget'}"
                  :no-transition-on-drag="true"
                  @add="handleWidgetItemAdd($event, element, rowIndex, i)"
                  @update="handleWidgetItemUpdate"
                  @start="setDragging(true)"
                  @end="setDragging(false)"
                  class="widget-col-list"
                  item-key="key"
                  :style="{
                    'text-align': column.options.textAlign,
                    'vertical-align': column.options.verticalAlign,
                  }"
                >
                    <template #item="{element:c, index:cindex}">
                        <widget-tab-item
                          v-if="c.type === 'tabs'"
                          :key="`tabs-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex" 
                          :data="column"
                          @select-change="handleSelectChange($event, column)" 
                          :platform="platform" 
                          :form-key="formKey"
                          :subform="subform"
                        >
                        </widget-tab-item>

                        <widget-collapse
                          v-else-if="c.type === 'collapse'"
                          :key="`collapse-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex" 
                          :data="column"
                          @select-change="handleSelectChange($event, column)" 
                          :platform="platform" 
                          :form-key="formKey"
                          :subform="subform"
                        >
                        </widget-collapse>

                        <widget-table
                          v-else-if="c.type === 'table'"
                          :key="`table-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)"
                          :platform="platform"
                          :form-key="formKey"
                        >
                        </widget-table>

                        <widget-sub-form
                          v-else-if="c.type === 'subform'"
                          :key="`subform-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)"
                          :platform="platform"
                          :form-key="formKey"
                        >
                        </widget-sub-form>

                        <widget-card
                          v-else-if="c.type === 'card'"
                          :key="`card-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)"
                          :platform="platform"
                          :form-key="formKey"
                        >
                        </widget-card>

                        <widget-group
                          v-else-if="c.type === 'group'"
                          :key="`group-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)"
                          :platform="platform"
                          :form-key="formKey"
                        >
                        </widget-group>

                        <widget-inline
                          v-else-if="c.type === 'inline'"
                          :key="`inline-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget"
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)"
                          :platform="platform"
                          :form-key="formKey"
                        ></widget-inline>

                        <widget-report
                          v-else-if="c.type === 'report'"
                          :key="`report-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)" 
                          :platform="platform" 
                          :form-key="formKey"
                          :subform="subform"
                        >
                        </widget-report>

                        <widget-form-item 
                          v-else-if="c.type !== 'grid'" 
                          :key="`form-item-${c.key}`" 
                          :element="c" 
                          v-model:select="selectWidget" 
                          :index="cindex" :data="column"
                          @select-change="handleSelectChange($event, column)"
                          :form-key="formKey"
                        >
                        </widget-form-item>

                        <widget-col-item
                          v-else
                          :key="`grid-${c.key}`" 
                          :element="c"
                          v-model:select="selectWidget" 
                          :index="cindex"
                          :data="column"
                          @select-change="handleSelectChange($event, column)" 
                          :platform="platform" 
                          :form-key="formKey"
                          :subform="subform"
                        >
                        </widget-col-item>
                    </template>
                  
                </draggable>
                <div class="widget-view-action widget-col-action" v-if="select.key == column.key">
                  <el-dropdown size="default" trigger="click">
                    <span class="el-dropdown-link">
                      <i class="fm-iconfont icon-biaogeshezhi"  :title="$t('fm.tooltip.cellsetting')"></i> 
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="insertleft" @click.stop="handleInsertLeft">{{$t('fm.tooltip.insertcolumnleft')}}</el-dropdown-item>
                        <el-dropdown-item command="insertright" @click.stop="handleInsertRight">{{$t('fm.tooltip.insertcolumnright')}}</el-dropdown-item>
                        <el-dropdown-item command="insertbefore" @click.stop="handleInserBefore">{{$t('fm.tooltip.insertrowbefore')}}</el-dropdown-item>
                        <el-dropdown-item command="insertafter" @click.stop="handleInserAfter">{{$t('fm.tooltip.insertrowafter')}}</el-dropdown-item>
                        <el-dropdown-item command="right" @click.stop="handleRight(column)" :disabled="!showRight" divided>{{$t('fm.tooltip.mergeright')}}</el-dropdown-item>
                        <el-dropdown-item command="bottom" @click.stop="handleBottom(column)" :disabled="!showBottom">{{$t('fm.tooltip.mergedown')}}</el-dropdown-item>
                        <el-dropdown-item command="splitcolumns" @click.stop="handleSplitColumn" divided :disabled="!showSplitColumn">{{$t('fm.tooltip.splitcolumns')}}</el-dropdown-item>
                        <el-dropdown-item command="splitrows" @click.stop="handleSplitRow" :disabled="!showSplitRow">{{$t('fm.tooltip.splitrows')}}</el-dropdown-item>
                        <el-dropdown-item command="removecolumn" @click.stop="handleRemoveColumn" :disabled="!showRemoveColumn" divided>{{$t('fm.tooltip.deletecolumn')}}</el-dropdown-item>
                        <el-dropdown-item command="removerow" @click.stop="handleRemoveRow" :disabled="!showRemoveRow" >{{$t('fm.tooltip.deleterow')}}</el-dropdown-item>
                        <el-dropdown-item command="setcolwidth" @click.stop="handleSetColumnWidth" :disabled="column.options.colspan !== 1" divided>{{$t('fm.tooltip.setcolwidth')}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                    
                  </el-dropdown>
                </div>

                <div class="widget-view-type ">
                  <span>{{column.type ? this.$t('fm.components.fields.' + column.type) : ''}}</span>
                </div>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="widget-view-action widget-col-action" v-if="select.key == element.key">
      <i class="fm-iconfont icon--charuhang" @click.stop="handleAddRow(index)" :title="$t('fm.tooltip.addrow')"></i>
      <i class="fm-iconfont icon--charulie" @click.stop="handleAddColumns(index)" :title="$t('fm.tooltip.addcolumn')"></i>
      <i class="fm-iconfont icon-icon_clone" @click.stop="handleReportClone(index)" :title="$t('fm.tooltip.clone')"></i>
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
import { widgetReportMixin } from '../mixins/widgetReport.js'

export default {
  name: 'widget-report',
  components: {
    Draggable,
    WidgetFormItem,
    WidgetTable,
    WidgetInline,
    WidgetColItem: defineAsyncComponent(() => import('./WidgetColItem.vue')),
    WidgetTabItem: defineAsyncComponent(() => import('./WidgetTabItem.vue')),
    WidgetSubForm: defineAsyncComponent(() => import('./WidgetSubForm.vue')),
    WidgetCollapse: defineAsyncComponent(() => import('./WidgetCollapse.vue')),
    WidgetCard: defineAsyncComponent(() => import('./WidgetCard.vue')),
    WidgetGroup: defineAsyncComponent(() => import('./WidgetGroup.vue'))
  },
  mixins: [widgetReportMixin]
}
</script>
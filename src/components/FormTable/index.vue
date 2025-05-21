<template>
  <div class="form-table" :class="{'is-disabled': disableddata}">
    <template v-if="(preview && platform != 'mobile') || (!preview && !mobileScreen)">
      <el-table
        :data="paging ? pagingData : tableData"
        border
        :class="{'form-table-pc': !preview}"
        v-if="!widget.options.virtualTable"
        ref="formTable"
        row-key="fm_key"
      >
        <el-table-column type="selection" fixed="left"  width="50" reserve-selection	v-if="widget.options.selection" />
        <el-table-column
          v-if="showControl"
          label="#"
          fixed
          width="50">
          <template #default="scope">
            <div class="scope-index">
              <span>{{(paging ? pageSize * (currentPage - 1) : 0) + scope.$index + 1}}</span>
            </div>
            <div class="scope-action">
              <el-popconfirm v-if="!printRead && isDelete" :teleported="true" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + scope.$index)">
                <template #reference>
                  <el-button :disabled="disableddata" type="danger" size="small" circle><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></el-button>
                </template>
              </el-popconfirm>
              <span v-if="printRead || !isDelete">{{(paging ? pageSize * (currentPage - 1) : 0) + scope.$index + 1}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.length==0"></el-table-column>
        <template v-else>
          <template v-for="column in columns" :key="column.model">
            <el-table-column
              v-if="columnDisplay(column.model, column)"
              :label="column.options.hideLabel ? '' : column.name"
              :width="column.options.width"
              :label-class-name="column.options.required ? 'required' : ''"
              :class-name="column.options?.customClass"
              :fixed="column.options.fixedColumn ? (column.options.fixedColumnPosition || 'left') : false"
              :column-key="column.key"
            >
              <template #default="scope" >

                <generate-form-item
                  :models="tableData[(paging ? pageSize * (currentPage - 1) : 0) + scope.$index]"
                  :rules="rules"
                  :widget="column"
                  :remote="remote"
                  :blanks="blanks"
                  :display="displayFields"
                  :sub-hide-fields="tableHideFields"
                  :sub-disabled-fields="tableDisabledFields"
                  :edit="!disableddata"
                  :remote-option="remoteOption"
                  :platform="platform"
                  :preview="preview"
                  :container-key="containerKey"
                  :data-source-value="dataSourceValue"
                  :event-function="eventFunction"
                  :print-read="printRead"
                  :is-table="true"
                  :is-mobile="false"
                  :row-index="(paging ? pageSize * (currentPage - 1) : 0) + scope.$index"
                  :table-name="name"
                  :is-dialog="isDialog"
                  :dialog-name="dialogName"
                  :is-group="false"
                  :group="group ? `${group}.${name}` : name"
                  :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + scope.$index}`"
                  :key="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + scope.$index}.${column.key}`"
                >
                  <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                    <slot :name="blank.name" :model="scope.model"></slot>
                  </template>
                </generate-form-item>

              </template>
              
            </el-table-column>
          </template>
          
        </template>
      </el-table>

      <VirtualTable
        v-if="widget.options.virtualTable"
        :columns="columns"
        :showControl="showControl"
        :paging="paging"
        :pageSize="pageSize"
        :currentPage="currentPage"
        :displayFields="displayFields"
        :group="group"
        :widget="widget"
        ref="virtualTable"
      >
        <template v-slot="{rowWidthCalc, rowLeftWidthCalc, rowRightWidthCalc}">
          <VirtualRow :rowWidthCalc="rowWidthCalc"
            v-for="(t, index) in (paging ? pagingLength : tableData)"
            :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
            :row-index="index"
            class="main"
            :table-key="tableKey"
          >
            <VirtualCell width="50px" v-if="showControl"></VirtualCell>
            <VirtualCell :width="`calc(${rowLeftWidthCalc})`" v-if="rowLeftWidthCalc != '0px'"></VirtualCell>
            <template v-for="column in columns">
              <VirtualCell :key="column.key" v-if="columnDisplay(column.model, column) && !column.options.fixedColumn" :width="column.options.width">
                <generate-form-item
                  :models="tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
                  :rules="rules"
                  :widget="column"
                  :remote="remote"
                  :blanks="blanks"
                  :display="displayFields"
                  :sub-hide-fields="tableHideFields"
                  :sub-disabled-fields="tableDisabledFields"
                  :edit="!disableddata"
                  :remote-option="remoteOption"
                  :platform="platform"
                  :preview="preview"
                  :container-key="containerKey"
                  :data-source-value="dataSourceValue"
                  :event-function="eventFunction"
                  :print-read="printRead"
                  :is-table="true"
                  :is-mobile="false"
                  :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
                  :table-name="name"
                  :is-dialog="isDialog"
                  :dialog-name="dialogName"
                  :is-group="false"
                  :group="group ? `${group}.${name}` : name"
                  :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
                >
                  <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                    <slot :name="blank.name" :model="scope.model"></slot>
                  </template>
                </generate-form-item>
              </VirtualCell>
            </template>
            <VirtualCell :width="`calc(${rowRightWidthCalc})`" v-if="rowRightWidthCalc != '0px'"></VirtualCell>
          </VirtualRow>
        </template>
        <template #left>
          <VirtualRow 
            v-for="(t, index) in (paging ? pagingLength : tableData)" :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
            :rowIndex="index"  
            class="left"
            :table-key="tableKey"
          >
            <VirtualCell width="50px" class="fm-table-check" v-if="widget.options.selection">
              <el-checkbox
                :modelValue="checkSelectKeys.includes(tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key'])"
                @change="handleCheckSelectChange((paging ? pageSize * (currentPage - 1) : 0) + index, $event)"
              >
              </el-checkbox>
            </VirtualCell>
            <VirtualCell width="50px" v-if="showControl">
              <div class="scope-index">
                <span>{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
              </div>
              <div class="scope-action">
                <el-popconfirm v-if="!printRead && isDelete" :teleported="true" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)">
                  <template #reference>
                    <el-button :disabled="disableddata" type="danger" size="small" circle><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></el-button>
                  </template>
                </el-popconfirm>
                <span v-if="printRead || !isDelete">{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
              </div>
            </VirtualCell>
            <template v-for="column in columns">
              <VirtualCell :key="column.key" v-if="columnDisplay(column.model, column) && column.options.fixedColumn && column.options.fixedColumnPosition != 'right'" :width="column.options.width">
                <generate-form-item
                  :models="tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
                  :rules="rules"
                  :widget="column"
                  :remote="remote"
                  :blanks="blanks"
                  :display="displayFields"
                  :sub-hide-fields="tableHideFields"
                  :sub-disabled-fields="tableDisabledFields"
                  :edit="!disableddata"
                  :remote-option="remoteOption"
                  :platform="platform"
                  :preview="preview"
                  :container-key="containerKey"
                  :data-source-value="dataSourceValue"
                  :event-function="eventFunction"
                  :print-read="printRead"
                  :is-table="true"
                  :is-mobile="false"
                  :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
                  :table-name="name"
                  :is-dialog="isDialog"
                  :dialog-name="dialogName"
                  :is-group="false"
                  :group="group ? `${group}.${name}` : name"
                  :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
                >
                  <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                    <slot :name="blank.name" :model="scope.model"></slot>
                  </template>
                </generate-form-item>
              </VirtualCell>
            </template>
          </VirtualRow>
        </template>
        <template #right>
          <VirtualRow 
            v-for="(t, index) in (paging ? pagingLength : tableData)" :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
            :rowIndex="index"
            class="right"
            :table-key="tableKey"
          >
            <template v-for="column in columns">
              <VirtualCell :key="column.key" v-if="columnDisplay(column.model, column) && column.options.fixedColumn && column.options.fixedColumnPosition == 'right'" :width="column.options.width">
                <generate-form-item
                  :models="tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
                  :rules="rules"
                  :widget="column"
                  :remote="remote"
                  :blanks="blanks"
                  :display="displayFields"
                  :sub-hide-fields="tableHideFields"
                  :sub-disabled-fields="tableDisabledFields"
                  :edit="!disableddata"
                  :remote-option="remoteOption"
                  :platform="platform"
                  :preview="preview"
                  :container-key="containerKey"
                  :data-source-value="dataSourceValue"
                  :event-function="eventFunction"
                  :print-read="printRead"
                  :is-table="true"
                  :is-mobile="false"
                  :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
                  :table-name="name"
                  :is-dialog="isDialog"
                  :dialog-name="dialogName"
                  :is-group="false"
                  :group="group ? `${group}.${name}` : name"
                  :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
                >
                  <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                    <slot :name="blank.name" :model="scope.model"></slot>
                  </template>
                </generate-form-item>
              </VirtualCell>
            </template>
          </VirtualRow>
        </template>
        <template #selection>
          <el-checkbox
            v-model="checkAll"
            :indeterminate="checkIndeterminate"
            @change="handleCheckAllChange"
          >
          </el-checkbox>
        </template>
      </VirtualTable>
    </template>
    

    <div class="form-table-mobile"
      v-if="(preview && platform === 'mobile') || (!preview && mobileScreen)"
      :style="{'display': (preview && platform === 'mobile') ? 'block' : ''}"
    >
      <div class="form-table-mobile-item"
        v-for="(t, index) in (paging ? pagingLength : tableData)"
        :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
      >
        <div class="form-table-mobile-item__top" >
          <el-checkbox
            :modelValue="checkSelectKeys.includes(tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key'])"
            @change="handleCheckSelectChange((paging ? pageSize * (currentPage - 1) : 0) + index, $event)"
            v-if="widget.options.selection"
            style="margin-right: 10px;"
          >
          </el-checkbox>
          <span># {{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
          <el-popconfirm v-if="showControl && !printRead && isDelete" :teleported="false" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)">
            <template #reference>
              <el-button :disabled="disableddata" type="danger" size="small" circle><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></el-button>
            </template>
          </el-popconfirm>
        </div>
        <div class="form-table-mobile-item__content">
          <template v-for="column in columns" 
            :key="column.key"
          >
            <generate-form-item
              :models="tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :widget="column"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="tableHideFields"
              :sub-disabled-fields="tableDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-table="true"
              :is-mobile="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :table-name="name"
              :is-dialog="isDialog"
              :dialog-name="dialogName"
              :is-group="false"
              :group="group ? `${group}.${name}` : name"
              :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
            >
              <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                <slot :name="blank.name" :model="scope.model"></slot>
              </template>
            </generate-form-item>
          </template>
        </div>
      </div>
    </div>

    <el-row>
      <el-col :span="(preview && platform != 'mobile') || !preview ? 12 : 24" :xs="24">
        <el-button link type="primary" @click="handleAddRow" v-if="!disableddata && isAdd">
          <i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>{{$t('fm.actions.add')}}
        </el-button>
        
      </el-col>
      <el-col :span="((preview && platform != 'mobile') || !preview) && !disableddata ? 12 : 24" :xs="24">
        <el-pagination
          style="float: right;"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          :current-page="currentPage"
          :total="tableData.length"
          :pager-count="5"
          @current-change="handlePageChange"
          v-if="paging && tableData.length"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import VirtualTable from '../VirtualTable/index.vue'
import VirtualRow from '../VirtualTable/row.vue'
import VirtualCell from '../VirtualTable/cell.vue'
import { formTableMixin } from '../../mixins/formTable'

export default {
  components: {
    VirtualTable,
    VirtualRow,
    VirtualCell,
    GenerateFormItem: defineAsyncComponent(() => import('../GenerateFormItem.vue')),
    GenerateElementItem: defineAsyncComponent(() => import('../GenerateElementItem.vue'))
  },
  mixins: [formTableMixin],
  data () {
    return {
      checkSelectKeys: [],
    }
  },
  computed: {
    checkSelectLength () {
      return this.checkSelectKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item).length
    }
  },
  methods: {
    handleRemove (index) {
      const removeData = {...this.tableData[index]}

      if (((this.preview && this.platform != 'mobile') || (!this.preview && !this.mobileScreen)) && !this.widget.options.virtualTable) {
        this.$refs.formTable.toggleRowSelection(this.tableData[index], false)
      } else {
        this.handleCheckSelectChange(index, false)
      }
      
      const tmpdata = [...this.tableData]
      tmpdata.splice(index, 1)
      this.tableData = tmpdata

      if (this.widget && this.widget.events && this.widget.events.onRowRemove) {
        let funcKey = this.widget.events.onRowRemove

        this.eventFunction[funcKey]({
          removeIndex: index, 
          removeData: removeData,
          field: this.widget.model,
          currentRef: this,
          group: this.group,
          fieldNode: this.fieldNode
        })
      }

      this.changeItem = {}

      this.pagingData = []
      this.pagingLength = 0

      this.$nextTick(() => {

        if (this.paging) {
          if (this.tableData.length % this.pageSize == 0 && this.currentPage > parseInt(this.tableData.length / this.pageSize)) {
            this.currentPage = parseInt(this.tableData.length / this.pageSize)
          }

          this.loadPagingData()
        }

        this.calcCheckStatus()
      })
    },
    handleCheckSelectChange (index, val) {
      if (val) {
        if (!this.checkSelectKeys.includes(this.tableData[index]['fm_key'])) {
          this.checkSelectKeys.push(this.tableData[index]['fm_key'])
        }
      } else {
        if (this.checkSelectKeys.includes(this.tableData[index]['fm_key'])) {
          this.checkSelectKeys.splice(this.checkSelectKeys.indexOf(this.tableData[index]['fm_key']), 1)
        }
      }

      this.$nextTick(() => {
        this.calcCheckStatus()
      })
    },

    handleCheckAllChange (val) {
      this.checkIndeterminate = false
      if (val) {
        this.checkSelectKeys = this.tableData.map(item => (item.fm_key))
      } else {
        this.checkSelectKeys = []
      }
    },
    calcCheckStatus () {
      if (this.checkSelectLength == 0) {
        this.checkAll = false
        this.checkIndeterminate = false
      } else if (this.checkSelectLength == this.tableData.length) {
        this.checkAll = true
        this.checkIndeterminate = false
      } else {
        this.checkAll = false
        this.checkIndeterminate = true
      }
    },

    getSelection () {
      if (((this.preview && this.platform != 'mobile') || (!this.preview && !this.mobileScreen)) && !this.widget.options.virtualTable) {
        return this.$refs.formTable.getSelectionRows()
      } else {
        return this.checkSelectKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item)
      }
    },

    clearSelection () {
      if (((this.preview && this.platform != 'mobile') || (!this.preview && !this.mobileScreen)) && !this.widget.options.virtualTable) {
        this.$refs.formTable.clearSelection()
      } else {
        this.checkSelectKeys = []

        this.$nextTick(() => {
          this.calcCheckStatus()
        })
      }
    }
  },
}
</script>

<style lang="scss">
.form-table{
  position: relative;

  .el-form-item{
    margin-top: 2px;
  }

  .el-table th.required>div::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    background: transparent;
    vertical-align: top;
  }

  .el-table td{
    padding-bottom: 0;
  }

  .el-table__header-wrapper{
    background: var(--el-fill-color-light);

    div,th{
      background: var(--el-fill-color-light);
    }

    th.el-table-fixed-column--left{
      background: var(--el-fill-color-light);
      overflow: hidden;
    }

    th.el-table-fixed-column--right{
      background: var(--el-fill-color-light);
    }
  }

  td.el-table-column--selection{
    padding-top: 0;
  }

  .el-table__fixed-header-wrapper{
    div,th{
      background: var(--el-fill-color-light);
    }
  }

  .el-table__empty-block{
    // display: none;
    min-height: 50px;
  }

  .scope-action{
    display: none;
    margin-bottom: 18px;
  }

  .scope-index{
    display: block;
    margin-bottom: 18px;
  }

  .hover-row{
    .scope-action{
      display: block;
      .el-button{
        padding: 3px;
      }
    }

    .scope-index{
      display: none;
    }
  }

  .form-table-pc{
    display: block;
  }

  .form-table-mobile{
    display: none;

    .form-table-mobile-item{
      border: 1px solid var(--el-border-color-lighter);
      margin-bottom: 10px;

      .form-table-mobile-item__top{
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        background:  var(--el-fill-color-light);
        border-bottom: 1px solid var(--el-border-color-lighter);
        font-weight: 500;

        button{
          float: right;
          margin-top: 4px;
        }
      }

      .form-table-mobile-item__content{
        padding: 8px;
      }

    }
  }
}

@media screen and (max-width: 768px) {
  .form-table{
    .form-table-pc{
      display: none;
    }

    .form-table-mobile{
      display: block;
    }
  }
}
</style>

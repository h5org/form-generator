<template>
  <div class="antd-form-table" :class="{'is-disabled': disableddata}">
    <template v-if="(preview && platform != 'mobile') || (!preview && !mobileScreen)">
      <a-table
        :dataSource="paging ? pagingData : tableData" 
        :pagination="false" bordered
        :class="{'antd-form-table-pc': !preview}"
        v-if="!widget.options.virtualTable"
        table-layout="fixed"
        :scroll="{ x: '100%'}"
        :size="tableSize"
        row-key="fm_key"
        ref="formTable"
        :row-selection="rowSelection"
      >
          <a-table-column
            v-if="showControl"
            :scopedSlots="{ customRender: '#' }"
            title="#"
            data-index="#"
            key="#"
            fixed="left"
            :width="80">
            <template #default="{index}">
              <div class="scope-index">
                <span>{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
              </div>
              <div class="scope-action">
                
                <a-popconfirm :disabled="disableddata" v-if="!printRead && isDelete" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)">
            
                  <a-button :disabled="disableddata" type="primary" danger shape="circle"  size="small"><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></a-button>
                  
                </a-popconfirm>
                <span v-if="printRead || !isDelete">{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
              </div>
            </template>
          </a-table-column>
          <a-table-column v-if="columns.length==0"></a-table-column>
          <template v-else>
            <template v-for="column in columns" >
              <a-table-column 
                :key="column.key"
                v-if="columnDisplay(column.model, column)"
                :data-index="column.key"
                :title="column.options.hideLabel ? '' : column.name"
                :width="column.options.width"
                :class="column.options.required ? 'required' : ''"
                :scopedSlots="{ customRender: column.key }"
                :fixed="column.options.fixedColumn ? (column.options.fixedColumnPosition || 'left') : false"
              >
                <template #default="{index}">
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
                    :config="config"
                    :is-dialog="isDialog"
                    :dialog-name="dialogName"
                    :is-group="false"
                    :group="group ? `${group}.${name}` : name"
                    :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
                    :key="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}.${column.key}`"
                  >
                    <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                      <slot :name="blank.name" :model="scope.model"></slot>
                    </template>
                  </generate-form-item>

                </template>
                
              </a-table-column>
            </template>
            
          </template>
        <!-- </a-table-column-group> -->
      </a-table>

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
                  :config="config"
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
              <a-checkbox
                :checked="selectedRowKeys.includes(tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key'])"
                @change="handleCheckSelectChange((paging ? pageSize * (currentPage - 1) : 0) + index, $event)"
              >
              </a-checkbox>
            </VirtualCell>

            <VirtualCell width="50px" v-if="showControl">
              <div class="scope-index">
                <span>{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
              </div>
              <div class="scope-action">
                
                <a-popconfirm :disabled="disableddata"  v-if="!printRead && isDelete" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)">
            
                  <a-button :disabled="disableddata" type="primary" danger shape="circle"  size="small"><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></a-button>
                  
                </a-popconfirm>
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
                  :config="config"
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
                  :config="config"
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
          <a-checkbox
            v-model:checked="checkAll"
            :indeterminate="checkIndeterminate"
            @change="handleCheckAllChange"
          >
          </a-checkbox>
        </template>
      </VirtualTable>
    </template>

    <div class="antd-form-table-mobile"
      v-if="(preview && platform === 'mobile') || (!preview && mobileScreen)"
      :style="{'display': (preview && platform === 'mobile') ? 'block' : ''}"
    >
      <div class="antd-form-table-mobile-item"
        v-for="(t, index) in (paging ? pagingLength : tableData)"
        :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
      >
        <div class="antd-form-table-mobile-item__top">
          <a-checkbox
            :checked="selectedRowKeys.includes(tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key'])"
            @change="handleCheckSelectChange((paging ? pageSize * (currentPage - 1) : 0) + index, $event)"
            v-if="widget.options.selection"
            style="margin-right: 10px;"
          >
          </a-checkbox>

          <span># {{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</span>
          <a-popconfirm :disabled="disableddata"  v-if="showControl && !printRead && isDelete" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)">
          
            <a-button :disabled="disableddata" type="primary" danger shape="circle"  size="small"><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></a-button>
            
          </a-popconfirm>
        </div>
        <div class="antd-form-table-mobile-item__content">
          <a-space direction="vertical" style="width: 100%;">
            <template v-for="column in columns" :key="column.key" >
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
                :config="config"
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
          </a-space>
        </div>
      </div>
    </div>

    <a-row>
      <a-col :md="(preview && platform != 'mobile') || !preview ? 12 : 24" :xs="24" :sm="24">
        <a-button  type="link" @click="handleAddRow" v-if="!disableddata && isAdd">
          <i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>{{$t('fm.actions.add')}}
        </a-button>
        
      </a-col>
      <a-col :md="((preview && platform != 'mobile') || !preview) && !disableddata ? 12 : 24" :xs="24" :sm="24">
        <a-pagination
          style="float: right; padding-top: 5px;white-space: nowrap;"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          v-model:current="currentPage"
          :total="tableData.length"
          :pager-count="5"
          @change="handlePageChange"
          v-if="paging && tableData.length"
          show-less-items
        >
        </a-pagination>
      </a-col>
    </a-row>
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
    GenerateFormItem: defineAsyncComponent(() => import('./GenerateFormItem.vue')),
    GenerateElementItem: defineAsyncComponent(() => import('./GenerateElementItem.vue'))
  },
  mixins: [formTableMixin],
  data () {
    return {
      selectedRowKeys: [],
    }
  },
  computed: {
    checkSelectLength () {
      return this.selectedRowKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item).length
    },
    tableSize () {
      switch (this.config.size) {
        case 'large': return 'default'; break;
        case 'default': return 'middle'; break;
        case 'small': return 'small'; break;
      }
    },

    rowSelection () {
      if (this.widget.options.selection && !this.printRead) {
        const _this = this
        return {
          checkStrictly: true,
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange,
          fixed: 'left'
        }
      } else {
        return null
      }
    }
    // labelWidth () {
    //   return this.widget.options.hideLabel ? '0px' : (this.widget.options.isLabelWidth ? this.widget.options.labelWidth + 'px' : this.config.labelWidth + 'px')
    // }
  },
  methods: {
    handleRemove (index) {
      const removeData = {...this.tableData[index]}

      const tmpdata = [...this.tableData]
      tmpdata.splice(index, 1)
      this.tableData = tmpdata

      if (this.widget.events && this.widget.events.onRowRemove) {
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

      if (this.paging) {
        this.$nextTick(() => {
          if (this.tableData.length % this.pageSize == 0 && this.currentPage > parseInt(this.tableData.length / this.pageSize)) {
            this.currentPage = parseInt(this.tableData.length / this.pageSize)
          }

          this.loadPagingData()

          this.calcCheckStatus()

        })
      }
    },
    onSelectChange (keys) {
      this.selectedRowKeys = keys
    },

    handleCheckSelectChange (index, val) {
      if (val.target.checked) {
        if (!this.selectedRowKeys.includes(this.tableData[index]['fm_key'])) {
          this.selectedRowKeys.push(this.tableData[index]['fm_key'])
        }
      } else {
        if (this.selectedRowKeys.includes(this.tableData[index]['fm_key'])) {
          this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(this.tableData[index]['fm_key']), 1)
        }
      }

      this.$nextTick(() => {
        this.calcCheckStatus()
      })
    },

    handleCheckAllChange (val) {
      this.checkIndeterminate = false
      if (val.target.checked) {
        this.selectedRowKeys = this.tableData.map(item => (item.fm_key))
      } else {
        this.selectedRowKeys = []
      }
    },
    calcCheckStatus () {
      const checkSelectLength = this.selectedRowKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item).length

      if (checkSelectLength == 0) {
        this.checkAll = false
        this.checkIndeterminate = false
      } else if (checkSelectLength == this.tableData.length) {
        this.checkAll = true
        this.checkIndeterminate = false
      } else {
        this.checkAll = false
        this.checkIndeterminate = true
      }
    },
    getSelection () {
      return this.selectedRowKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item)
    },

    clearSelection () {
      this.selectedRowKeys = []
    },
  },
}
</script>

<style lang="scss">
.fm-form .fm-form-item .antd-form-table{
  .ant-form-item{
    .ant-col{
      max-width: none;
    }

    .ant-form-item-label{
      flex: 0 0 auto;
    }

    .ant-form-item-control{
      flex: 1;
    }
  }

  .ant-form-item{
    .ant-form-item-label{
      width: var(--labelWidth)
    }
  }

  .no-label-left{
    .ant-form-item-control{
      margin-left: var(--labelWidth);
    }
  }
}

.antd-form-table{

  .fm-virtual-table{
    .scope-index{
      margin-bottom: 18px;
    }
    .scope-action{
      margin-bottom: 18px;
    }

    .fm-virtual-table-main{

      .fm-virtual-table__body{

        .fm-virtual-table__row{
          border-bottom: 1px solid #f0f0f0;

          &.is-hover{
            background-color: #fafafa;
          }
        }
      }

      .fm-virtual-table__header{

        .fm-virtual-table__header-content{
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }

        .fm-virtual-table__header-row{

          .fm-virtual-table__header-cell{
            border-bottom: 1px solid #f0f0f0;
          }
        }
      }
    }
  }

  .ant-form-item{
    margin-bottom: 0;
  }

  .ant-form-explain{
    position: absolute;
    margin-top: -5px;
  }

  td{
    vertical-align: top;
  }

  .ant-table th.required div::before{
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
    background: transparent;
    vertical-align: top;
  }

  .ant-table-body{
    overflow: auto;
  }

  .scope-action{
    display: none;
  }

  .scope-index{
    display: block;
  }

  .ant-table-row:hover{
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

  .ant-table-row-hover{
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

  .ant-table-pagination{
    display: none;
  }

  .ant-empty-normal{
    margin: 0;
  }

  .antd-form-table-pc{
    display: block;
  }

  .antd-form-table-mobile{
    display: none;

    .antd-form-table-mobile-item{
      border: 1px solid #e8e8e8;
      margin-bottom: 10px;

      .antd-form-table-mobile-item__top{
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        background:  #fafafa;
        border-bottom: 1px solid #e8e8e8;
        font-weight: 500;

        button{
          float: right;
          margin-top: 4px;
        }
      }

      .antd-form-table-mobile-item__content{
        padding: 8px;
      }

    }
  }
}

html.dark{

  .antd-form-table{

    .fm-virtual-table{

      .fm-virtual-table-main{

        .fm-virtual-table__body{

          .fm-virtual-table__row{
            border-bottom: 1px solid #303030;

            &.is-hover{
              background-color: #1d1d1d;
            }
          }
        }

        .fm-virtual-table__header{

          .fm-virtual-table__header-content{
            border-bottom: 1px solid #303030;
            background: #1d1d1d;
          }

          .fm-virtual-table__header-row{

            .fm-virtual-table__header-cell{
              border-bottom: 1px solid #303030;
            }
          }
        }
      }
    }

    .antd-form-table-mobile{

      .antd-form-table-mobile-item{
        border: 1px solid #303030;

        .antd-form-table-mobile-item__top{
          background:  #1d1d1d;
          border-bottom: 1px solid #303030;
        }
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .antd-form-table{
    .antd-form-table-pc{
      display: none;
    }

    .antd-form-table-mobile{
      display: block;
    }
  }
}
</style>

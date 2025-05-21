<template>
  <div class="fm-data-table-container">
    <el-table :data="tableData" :max-height="theMaxHeight" :stripe="stripe" :border="border" :highlight-current-row="highlight"
      @current-change="handleCurrentRow"
      @selection-change="handleSelectionChange"
      row-key="fm_key"
      :span-method="onSpanMethod"
      table-layout="fixed"
      :ref="`table${tableKey}`"
    >
      <el-table-column v-if="selection && !printRead" type="selection" width="50" fixed="left" />
      <template v-for="(column, index) in columns" :key="index">
        <data-table-column :data="column"></data-table-column>
      </template>
      <el-table-column fixed="right" :label="$i18n.locale == 'zh-cn' ? '操作' : 'Operations'" :width="operations.width" v-if="showOperation && !printRead">
        <template #default="scope">
          <template v-for="(button, index) in operations.buttons" :key="index">
            <el-button v-if="button.type == 'primary'" class="is-data-table" type="primary" size="small" @click.stop="handleOperate(scope, index)">{{button.name}}</el-button>
            <el-button v-if="button.type == 'default'" class="is-data-table" size="small" @click.stop="handleOperate(scope, index)">{{button.name}}</el-button>
            <el-button v-if="button.type == 'text'" class="is-data-table" text size="small" @click.stop="handleOperate(scope, index)">{{button.name}}</el-button>
            <el-button v-if="button.type == 'link'" class="is-data-table" link type="primary" size.stop="small" @click.stop="handleOperate(scope, index)">{{button.name}}</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-row v-if="pagination.paging && total" class="table-pagination">
      <el-col style="text-align: right;">
        <template v-if="printRead">
          Page {{currentPage}}
        </template>
        <template v-else>
          <el-pagination
            v-model:currentPage="currentPage"
            v-model:page-size="pageSize"
            :pager-count="pagination.pagerCount"
            layout="total, sizes, prev, pager, next"
            :page-sizes="listPageSizes"
            :total="total"
            :background="pagination.background"
            :small="pagination.small"
            @change="handlePageChange"
          />
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {defineAsyncComponent} from 'vue'

export default {
  components: {
    DataTableColumn: defineAsyncComponent(() => import('./column.vue'))
  },
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    modelValue: {
      type: [Array, Object]
    },
    showOperation: {
      type: Boolean,
      default: false
    },
    operations: {
      type: Object,
      default: () => ({})
    },
    pagination: {
      type: Object,
      default: () => ({})
    },
    isDesign: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: [String, Number]
    },
    stripe: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    highlight: {
      type: Boolean,
      default: false
    },
    selection: {
      type: Boolean,
      default: false
    },
    printRead: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    theMaxHeight () {
      if (this.maxHeight) {
        return this.maxHeight
      } else {
        return '100%'
      }
    },
    listPageSizes () {
      if (this.pagination.pageSizes && this.pagination.pageSizes.trim()) {
        return this.pagination.pageSizes.split(',')
          .map(value => value.trim())
          .filter(item => item !== "" && !isNaN(Number(item)))
          .map(value => parseInt(value))
      } else {
        return [10,20,50,100]
      }
    },
    rowspanColumnKeys () {
      return this.columns.filter(item => item.prop && item.isRowspan).map(item => item.key)
    }
  },
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: (this.pagination.pageSizes && this.pagination.pageSizes.trim()) ? this.pagination.pageSizes.split(',').map(value => parseInt(value.trim()))[0] : 10,
      multipleSelection: [],
      tableKey: Math.random().toString(36).slice(-8),
    }
  },
  created () {
    this.loadData()
  },
  emits: ['update:modelValue', 'on-current-row', 'on-page-change', 'on-operate', 'on-selection-change'],
  watch: {
    modelValue (val) {
      this.loadData()
    },
    'pagination.props': {
      deep: true,
      handler (val) {
        this.loadData()
      }
    }
  },
  methods: {
    loadData () {
      if (typeof this.modelValue === 'object') {
        if (Array.isArray(this.modelValue)) {
          this.tableData = this._generateDataKey(this.modelValue)

          this.total = this.isDesign ? 100 : 0
        } else {
          this.tableData = this._generateDataKey(this.modelValue[this.pagination.props.list])
          this.total = Number(this.modelValue[this.pagination.props.total])
          this.currentPage = Number(this.modelValue[this.pagination.props.current]) ?? this.currentPage
          this.pageSize = Number(this.modelValue[this.pagination.props.size]) ?? this.pageSize
        }
      }
    },

    _generateDataKey (data) {
      if (!Array.isArray(data)) return data
      return data.map(item => {
        if (item.children && item.children.length) {
          return {
            ...item,
            fm_key: Math.random().toString(36).slice(-8),
            children: this._generateDataKey(item.children)
          }
        } else {
          return {
            ...item,
            fm_key: Math.random().toString(36).slice(-8)
          }
        }
      })
    },

    handlePageChange (val) {
      this.$emit('on-page-change', {
        [this.pagination.props.current]: this.currentPage, 
        [this.pagination.props.size]: this.pageSize
      })
    },

    handleCurrentRow (val) {
      this.$emit('on-current-row', {
        row: val,
      })
    },

    handleOperate (val, buttonIndex) {
      const funcKey = this.operations.buttons[buttonIndex].event
      if (funcKey) {
        this.$emit('on-operate', {
          funcKey: funcKey,
          $index: val.$index,
          column: val.column,
          row: val.row
        })
      }
    },

    handleSelectionChange (val) {
      this.multipleSelection = val

      this.$emit('on-selection-change', this.multipleSelection)
    },

    _calcRowspan (index, key) {
      if (index === 0) {
        let curValue = this.tableData[index][key]
        let rowspan = 1
        for (let i = index + 1; i < this.tableData.length; i++) {
          if (this.tableData[i][key] === curValue && this.tableData[i][key] != undefined 
            && !(this.tableData[i].children && this.tableData[i].children.length)
            && !(this.tableData[index].children && this.tableData[index].children.length)
          ) {
            rowspan++
          } else {
            break
          }
        }
        return {
          rowspan: rowspan,
          colspan: 1,
        }
      } else if (index < this.tableData.length){
        let curValue = this.tableData[index][key]
        if (this.tableData[index - 1][key] === curValue && this.tableData[index - 1][key] != undefined 
          && !(this.tableData[index - 1].children && this.tableData[index - 1].children.length)
          && !(this.tableData[index].children && this.tableData[index].children.length)
        ) {
          return {
            rowspan: 0,
            colspan: 0,
          }
        } else {
          let rowspan = 1
          for (let i = index + 1; i < this.tableData.length; i++) {
            if (this.tableData[i][key] === curValue && this.tableData[i][key] != undefined 
              && !(this.tableData[i].children && this.tableData[i].children.length)
              && !(this.tableData[index].children && this.tableData[index].children.length)
            ) {
              rowspan++
            } else {
              break
            }
          }
          return {
            rowspan: rowspan,
            colspan: 1,
          }
        }
      } else {
        return {
          rowspan: 1,
          colspan: 1,
        }
      }
    },

    onSpanMethod ({row, column, rowIndex, columnIndex}) {

      if (this.rowspanColumnKeys.includes(column.columnKey)) {

        return this._calcRowspan(rowIndex, column.property)
      }
    },

    getSelection () {
      return JSON.parse(JSON.stringify(this.multipleSelection))
    },

    getPageInfo () {
      return this.pagination.paging ? {
        [this.pagination.props.current]: this.currentPage, 
        [this.pagination.props.size]: this.pageSize
      } : {}
    },
    clearSelection () {
      this.$refs[`table${this.tableKey}`].clearSelection()
    },
    getSelectionRows () {
      return this.$refs[`table${this.tableKey}`].getSelectionRows()
    },
    toggleAllSelection () {
      this.$refs[`table${this.tableKey}`].toggleAllSelection()
    },
    _filterMatchRow (data, row) {
      let result = []

      const isMatch = (obj, row) => {
        for (let key in row) {
          if (obj[key] !== row[key]) {
            return false
          }
        }
        return true
      }

      result = data.filter(item => isMatch(item, row))

      data.forEach(item => {
        if (item.children && item.children.length) {
          result.push(...this._filterMatchRow(item.children, row))
        }
      })

      return result
    },
    toggleRowSelection (row, selected) {

      const result = this._filterMatchRow(this.tableData, row)

      result.forEach(item => {
        this.$refs[`table${this.tableKey}`].toggleRowSelection(item, selected)
      })
    },
    setCurrentRow (row) {
      const result = this._filterMatchRow(this.tableData, row)

      result && result[0] && this.$refs[`table${this.tableKey}`].setCurrentRow(result[0])
    }
  }
}
</script>

<style lang="scss">
.fm-data-table-container{
  .table-pagination{
    padding-top: 10px;
  }

  .el-table__header-wrapper{
    background: var(--el-fill-color-light);

    th{
      background: var(--el-fill-color-light);
    }

    th.el-table-fixed-column--left{
      background: var(--el-fill-color-light);
    }

    th.el-table-fixed-column--right{
      background: var(--el-fill-color-light);
    }
  }

  .el-table__fixed-header-wrapper{
    th{
      background: var(--el-fill-color-light);
    }
  }
}
</style>
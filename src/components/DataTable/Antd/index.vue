<template>
<div class="fm-antd-data-table-container">
  <a-table 
    :bordered="border"
    :columns="aTableColums" 
    :dataSource="tableData"
    :scroll="{ x: '100%', y: maxHeight || null}"
    :row-selection="rowSelection"
    row-key="fm_key"
    :customRow="onCustomRow"
    :row-class-name="onRowClassName"
    :class="{
      'ant-table-striped': stripe
    }"
    :size="tableSize"
    :pagination="false"
    table-layout="fixed"
  >
    <template #bodyCell="{column, record, text}">
      <template v-for="key in Object.keys(columnComponent)" :key="key">
        <component v-if="column.key === key" :is="`component-column-${key}`" :scope="{row: record, column, record, text}" ></component>
      </template>

      <template v-if="column.key === 'operations'">
        <template v-for="(button, index) in operations.buttons" :key="index">
          <a-button v-if="button.type == 'primary'" class="is-data-table" type="primary" size="small" @click.stop="handleOperate({column, record, text}, index)" style="margin-right: 10px;">{{button.name}}</a-button>
          <a-button v-if="button.type == 'default'" class="is-data-table" size="small" @click.stop="handleOperate({column, record, text}, index)" style="margin-right: 10px;">{{button.name}}</a-button>
          <a-button v-if="button.type == 'text'" class="is-data-table" type="text" size="small" @click.stop="handleOperate({column, record, text}, index)" style="margin-right: 10px;">{{button.name}}</a-button>
          <a-button v-if="button.type == 'link'" class="is-data-table" type="link" size.stop="small" @click.stop="handleOperate({column, record, text}, index)" style="margin-right: 10px;">{{button.name}}</a-button>
        </template>
      </template>
    </template>

    <template #headerCell="{ column }">
      <template v-for="key in Object.keys(headerComponent)" :key="key">
        <component v-if="column.key === key" :is="`component-header-${key}`"></component>
      </template>
    </template>
  </a-table>
  <div class="table-pagination" v-if="pagination.paging && total">
    <template v-if="printRead">
      Page {{currentPage}}
    </template>
    <template v-else>
      <a-pagination
        v-model:current="currentPage"
        v-model:page-size="pageSize"
        :total="total"
        :size="pagination.small ? 'small' : ''"
        @change="handlePageChange"
        :show-total="total => `Total ${total} items`"
        :pageSizeOptions="listPageSizes"
        showSizeChanger
      />
    </template>
  </div>
</div>
</template>

<script>
export default {
  components: {},
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
    size: {
      type: String,
      default: 'middle'
    },
    printRead: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: (this.pagination.pageSizes && this.pagination.pageSizes.trim()) ? 
        this.pagination.pageSizes.split(',').map(value => value.trim())
          .filter(item => item !== "" && !isNaN(Number(item)))
          .map(value => parseInt(value))[0] : 10,
      multipleSelection: [],
      selectedRowKeys: [],
      currentRowKey: '',
      columnComponent: {},
      headerComponent: {},

    }
  },
  computed: {
    aTableColums () {
      let columns = this.transformColumns(this.columns)

      if (this.showOperation && !this.printRead) {
        columns.push({
          title: this.$i18n.locale == 'zh-cn' ? '操作' : 'Operation',
          key: 'operations',
          fixed: 'right',
          width: this.operations.width
        })
      }

      return columns
    },

    rowSelection () {
      if (this.selection && !this.printRead) {
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
    },
    tableSize () {
      if (this.size == 'default') {
        return 'middle'
      }
      return this.size
    },
    listPageSizes () {
      if (this.pagination.pageSizes && this.pagination.pageSizes.trim()) {
        return this.pagination.pageSizes.split(',')
          .map(value => value.trim())
          .filter(item => item !== "" && !isNaN(Number(item)))
          .map(value => parseInt(value))
      } else {
        return ['10','20','50','100']
      }
    }
  },
  emits: ['update:modelValue', 'on-current-row', 'on-page-change', 'on-operate', 'on-selection-change'],
  watch: {
    modelValue (val) {
      this.loadData()
    },
  },
  created () {
    this.loadComponents(this.columns)
    this.loadData()
  },
  beforeUnmount () {
    this.removeComponents()
  },
  methods: {
    onCustomRow (record, index) {
      return {
        onClick: (event) => {
          this.currentRowKey = record.fm_key
          this.$emit('on-current-row', {
            row: record,
          })
        }
      }
    },
    onRowClassName (record, index) {
      let rowClassName = ''

      if (this.stripe) {
        index % 2 === 1 && (rowClassName += ' table-striped')
      }
      if (this.highlight && this.currentRowKey) {
        record.fm_key === this.currentRowKey && (rowClassName += ' ant-table-row-selected')
      }
      return rowClassName
    },
    loadComponents (columns) {
      columns.forEach((column) => {
        if (column.defaultSlot) {
          this.$options.components[`component-column-${column.key}`] = {
            template: column.defaultSlotTemplate || '<span></span>',
            props: ['scope']
          }

          this.columnComponent[column.key] = `component-column-${column.key}`
        }
        if (column.headerSlot) {
          this.$options.components[`component-header-${column.key}`] = {
            template: column.headerSlotTemplate || '<span></span>'
          }

          this.headerComponent[column.key] = `component-header-${column.key}`
        }
        if (column.isParent) {
          this.loadComponents(column.children)
        }
      })
    },
    removeComponents () {
      Object.keys(this.$options.components).forEach(key => {
        this.$options.components[key] = null
      })

      this.columnComponent = {}
      this.headerComponent = {}
    },
    transformColumns (columns) {
      return columns.map(column => {
        let aColumn = {}

        if (column.isParent) {
          aColumn = {
            title: column.label,
            children: this.transformColumns(column.children),
            align: column.align,
            fixed: column.fixed ? column.fixedOption : false,
            key: column.key,
            ellipsis: column.ellipsis,
          }
        } else {
          aColumn = {
            title: column.label,
            dataIndex: column.prop,
            width: column.width,
            key: column.key,
            align: column.align,
            fixed: column.fixed ? column.fixedOption : false,
            ellipsis: column.ellipsis,
            customCell: column.isRowspan ? (_, index) => {
              return this._calcRowspan(index, column.prop)
            } : null,
          }
        }

        return aColumn
      })
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
          rowSpan: rowspan,
        }
      } else if (index < this.tableData.length){
        let curValue = this.tableData[index][key]
        if (this.tableData[index - 1][key] === curValue && this.tableData[index - 1][key] != undefined 
          && !(this.tableData[index - 1].children && this.tableData[index - 1].children.length)
          && !(this.tableData[index].children && this.tableData[index].children.length)
        ) {
          return {
            rowSpan: 0,
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
            rowSpan: rowspan,
          }
        }
      } else {
        return {
          rowSpan: 1,
        }
      }
    },
    loadData () {
      if (typeof this.modelValue === 'object') {
        if (Array.isArray(this.modelValue)) {
          this.tableData = this._generateDataKey(this.modelValue)

          this.total = this.isDesign ? 100 : 0
        } else {
          if (Array.isArray(this.modelValue[this.pagination.props.list])) {
            this.tableData = this._generateDataKey(this.modelValue[this.pagination.props.list])
          }

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
    _getSelectionRow (keys, data) {
      let res = []
      for (let i = 0; i < data.length; i++) {
        if (keys.includes(data[i].fm_key)) {
          res.push(data[i])
        }

        if (data[i].children && data[i].children.length) {
          res.push(...this._getSelectionRow(keys, data[i].children))
        }
      }

      return res
    },
    onSelectChange (keys) {
      this.selectedRowKeys = keys
      this.multipleSelection = this._getSelectionRow(keys, this.tableData)
      this.$emit('on-selection-change', this.multipleSelection)
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

    handleOperate (val, buttonIndex) {
      const funcKey = this.operations.buttons[buttonIndex].event
      if (funcKey) {
        this.$emit('on-operate', {
          funcKey: funcKey,
          column: val.column,
          record: val.record,
          row: val.record
        })
      }
    },

    handlePageChange (val) {
      this.$emit('on-page-change', {
        [this.pagination.props.current]: this.currentPage, 
        [this.pagination.props.size]: this.pageSize
      })
    },
    clearSelection () {
      this.selectedRowKeys = []
    },
    getSelectionRows () {
      return [...this.multipleSelection]
    },
    toggleAllSelection () {
      const allKeys = this._getAllRowKeys(this.tableData)

      if (this.selectedRowKeys.length < allKeys.length) {
        this.selectedRowKeys = allKeys
      } else {
        this.selectedRowKeys = []
      }

      this.multipleSelection = this._getSelectionRow(this.selectedRowKeys, this.tableData)
      this.$emit('on-selection-change', this.multipleSelection)
    },
    _getAllRowKeys (data) {
      let keys = []
      keys = data.map(item => item.fm_key)

      data.forEach(item => {
        if (item.children && item.children.length) {
          keys.push(...this._getAllRowKeys(item.children))
        }
      })

      return keys
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
        const _index = this.selectedRowKeys.findIndex(key => key === item.fm_key)

        if (_index >= 0) {
          this.selectedRowKeys.splice(_index, 1)
        } else {
          this.selectedRowKeys.push(item.fm_key)
        }
      })

      this.multipleSelection = this._getSelectionRow(this.selectedRowKeys, this.tableData)
      this.$emit('on-selection-change', this.multipleSelection)
    },
    setCurrentRow (row) {
      const result = this._filterMatchRow(this.tableData, row)

      if (result && result[0]) {
        this.currentRowKey = result[0].fm_key
        this.$emit('on-current-row', {
          row: result[0],
        })
      }
    }
  }
}
</script>

<style lang="scss">
.fm-antd-data-table-container{
  .ant-table-striped .table-striped td {
    background-color: #fafafa;
  }

  .table-pagination{
    padding-top: 10px;
  }
}

html.dark{
  .fm-antd-data-table-container{
    .ant-table-striped .table-striped td {
      background-color: rgb(29, 29, 29);
    }
  }
}
</style>
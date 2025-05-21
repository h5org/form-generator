import { updateClassName } from '../util/reuse-methods'
import {executeExpression, isExpression, extractExpression} from '../util/expression'
import _ from 'lodash'

export const formTableMixin = {
  props: ['config', 'columns', 'value', 'models', 'remote', 'blanks', 'disableddata', 'rules', 'name', 
    'remoteOption', 'preview', 'platform', 'dataSourceValue', 'eventFunction', 'widget', 
    'printRead', 'paging', 'pageSize', 'isDelete', 'isAdd', 'containerKey',
    'showControl', 'isDialog', 'dialogName', 'group', 'fieldNode'],
  emits: ['update:value'],
  data () {
    return {
      tableData: [],
      displayFields: {},
      disabledFields: {},
      changeItem: {},
      pagingData: [],
      pagingLength: 0,
      currentPage: 1,
      tableHideFields: [],
      tableDisabledFields: [],
      mobileScreen: window.innerWidth < 768,
      tableKey: Math.random().toString(36).slice(-8),
      checkAll: false,
      checkIndeterminate: false
    }
  },
  created () {
    for (let i = 0; i < this.columns.length; i++) {
      this.displayFields[this.columns[i].model] = !this.columns[i].options.hidden
      this.disabledFields[this.columns[i].model] = this.columns[i].options.disabled
    }

    this.tableData = this.value ? this.value.map(item => {
      return {
        ...item,
        fm_key: item['fm_key'] || Math.random().toString(36).slice(-8)
      }
    }) : []

    this.tableHideFields = this.value ? this.value.map(v => Object.fromEntries(Object.keys(this.displayFields).map(field => [field, !this.displayFields[field]]))) : []

    this.tableDisabledFields = this.value ? this.value.map(v => Object.fromEntries(Object.keys(this.disabledFields).map(field => [field, this.disabledFields[field]]))) : []

    window.addEventListener('resize', this.getMobileScreen)

    this.loadPagingData()
  },
  provide () {
    return {
      'setTableData': this.setTableData
    }
  },
  inject: ['onFormDisabled', 'dynamicHideFields', 'onFormHide', 'onFormDisplay', 'formContext'],
  methods: {
    columnDisplay (model, column) {
      let curField = this.group ? `${this.group}.${this.widget.model}.${model}` : `${this.widget.model}.${model}`

      if (this.dynamicHideFields[curField] != undefined) {
        return !this.dynamicHideFields[curField]
      }

      if (typeof column.options.hidden === 'boolean') {
        return !column.options.hidden
      } else {
        if (isExpression(column.options.hidden)) {
          return  !executeExpression(extractExpression(column.options.hidden), {}, this.formContext)
        }
      }

      return true
    },
    getMobileScreen () {
      this.mobileScreen = window.innerWidth < 768
    },
    setData (rowIndex, value) {
      if (typeof rowIndex !== 'number') {
        return new Promise((resolve) => {
          value = rowIndex

          this.tableData.forEach((_, index) => {
            Object.keys(value).forEach(item => {
              this.setTableData(value[item], index, item)
            })
          })

          resolve()
        })
      }
      return new Promise((resolve) => {
        this.$nextTick(() => {
          Object.keys(value).forEach(item => {
            this.setTableData(value[item], rowIndex, item)
          })
          resolve()
        })
      })
    },
    setTableData (value, rowIndex, field) {
      const newData = _.cloneDeep(this.tableData)
      newData[rowIndex][field] = value
      this.tableData = newData
    },
    handleAddRow () {
      let item = {}
      let hideItem = {}
      let disabledItem = {}

      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].type === 'blank') {
          item[this.columns[i].model] = this.columns[i].options.defaultType == 'String' ? '' : (this.columns[i].options.defaultType == 'Object' ? {} : [])
        } else if (this.columns[i].type === 'component' || this.columns[i].type === 'link' || this.columns[i].type === 'button') {
          item[this.columns[i].model] = undefined
        } else {
          item[this.columns[i].model] = _.cloneDeep(this.columns[i].options.defaultValue)
        }
        hideItem[this.columns[i].model] = !this.displayFields[this.columns[i].model]
        disabledItem[this.columns[i].model] = this.disabledFields[this.columns[i].model]
      }

      item['fm_key'] = Math.random().toString(36).slice(-8)

      this.tableData = [...this.tableData, {...item}]
      this.tableHideFields.push(hideItem)
      this.tableDisabledFields.push(disabledItem)

      this.changeItem = {}

      this.$nextTick(() => {

        if (this.widget && this.widget.events && this.widget.events.onRowAdd) {
          let funcKey = this.widget.events.onRowAdd

          this.eventFunction[funcKey]({
            rowIndex: this.tableData.length - 1, 
            field: this.widget.model,
            currentRef: this,
            group: this.group,
            fieldNode: this.fieldNode
          })
        }

        if (this.paging) {
          if (this.tableData.length > this.currentPage * this.pageSize) {
            this.currentPage = parseInt((this.tableData.length - 1) / this.pageSize) + 1
          }

          this.loadPagingData()
        }

        this.calcCheckStatus()
      })
    },
    hide (fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }

      fields.forEach(item => {
        this.onFormHide(`${this.fieldNode}.${item}`)
      })
    },
    display (fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        this.onFormDisplay(`${this.fieldNode}.${item}`)
      })
    },
    hideChild (rowIndex, fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        this.onFormHide(`${this.fieldNode}.${rowIndex}.${item}`)
      })
    },
    displayChild (rowIndex, fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        this.onFormDisplay(`${this.fieldNode}.${rowIndex}.${item}`)
      })
    },
    disabled (fields, disabled) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      for (let i = 0; i < this.columns.length; i++) {
        if (fields.indexOf(this.columns[i].model) >= 0) {
            
          this.columns[i].options.disabled = disabled

          this.disabledFields[this.columns[i].model] = disabled
        }
      }
      
      this.tableData.forEach((_, index) => {
        fields.forEach(field => {
          this.tableDisabledFields[index][field] = disabled
        })
      })
    },
    disabledChild (rowIndex, fields, disabled) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(field => {
        this.tableDisabledFields[rowIndex][field] = disabled

        this.onFormDisabled(`${this.fieldNode}.${rowIndex}.${field}`, disabled)
      })
    },
    setOptions (fields, options) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      for (let i = 0; i < this.columns.length; i++) {
        if (fields.indexOf(this.columns[i].model) >= 0) {

          Object.keys(options).forEach(key => {
            this.columns[i].options[key] = options[key]
          })
        }
      } 
    },
    addClassName (fields, className) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        updateClassName(this.columns, item.split('.'), className, 'add')
      })
    },
    removeClassName (fields, className) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        updateClassName(this.columns, item.split('.'), className, 'remove')
      })
    },
    handleTableChange (value) {
      this.changeItem = value
    },

    handlePageChange (val) {
      this.currentPage = val

      this.pagingData = []
      this.pagingLength = 0

      this.$nextTick(() => {
        this.loadPagingData()
      })

      if (this.widget && this.widget.events && this.widget.events.onPageChange) {
        let funcKey = this.widget.events.onPageChange

        this.eventFunction[funcKey]({
          currentPage: val, 
          field: this.widget.model,
          currentRef: this,
          group: this.group,
          fieldNode: this.fieldNode
        })
      }
    },
    loadPagingData () {
      let beginIndex = (this.currentPage - 1) * this.pageSize

      let endIndex = beginIndex + this.pageSize

      this.pagingData = this.tableData.slice(beginIndex, endIndex)

      this.pagingLength = this.pagingData.length
    },
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.getMobileScreen)
  },
  watch: {
    value (val) {
      val.forEach(item => {
        if (!item['fm_key']) {
          item['fm_key'] = Math.random().toString(36).slice(-8)
        }
      })
      this.tableData = val

      let hideFields = []
      let disabledFields = []
      for (let i = 0; i < this.value.length; i++) {
        let row = this.value[i]
        let rowArray = Object.keys(row)
        let hideRow = {}
        let disabledRow = {}
        for (let f = 0; f < rowArray.length; f++) {
          hideRow[rowArray[f]] = this.tableHideFields?.[i]?.[rowArray[f]] ?? false
          disabledRow[rowArray[f]] = this.tableDisabledFields?.[i]?.[rowArray[f]] ?? false
        }

        hideFields.push(hideRow)
        disabledFields.push(disabledRow)
      }

      this.tableHideFields = hideFields
      this.tableDisabledFields = disabledFields

      this.$nextTick(() => {
        this.calcCheckStatus()
      })
    },
    'tableData': {
      deep: true,
      handler (val) {
        this.loadPagingData()

        this.$emit('update:value', val)
      }
    }
  }
}
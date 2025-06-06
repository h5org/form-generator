import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToTH, generateKeyToCol, generateKeyToTab, fixDraggbleList, addClass, removeClass } from '../util'

export const widgetReportMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey', 'subform'],
  emits: ['select-change', 'update:select'],
  inject: ['getDragging', 'setDragging'],
  data () {
    return {
      selectWidget: this.select || {},
      selectR: -1,
      selectC: -1,
      selectIndex: -1
    }
  },
  created () {
    // 处理v3.5.8以前的表格
    if (!this.element.headerRow) {
      this.element.headerRow = this.element.rows[0].columns.map(item => ({
        type: 'th',
        options: {
          width: item.options.width
        },
        key: Math.random().toString(36).slice(-8)
      }))
    }
  },
  computed: {
    showRight () {
      if (this.selectR >=0 && this.selectC >= 0) {
        const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan
        const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan

        if (this.selectC + currentColspan < this.element.rows[this.selectR].columns.length) {
          const nextColumn = this.element.rows[this.selectR].columns[currentColspan + this.selectC]

          if (!nextColumn.options.invisible && currentRowspan == nextColumn.options.rowspan) {
            return true
          }
        }
      }

      return false
    },
    showBottom () {
      if (this.selectR >=0 && this.selectC >= 0) {
        const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan
        const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan

        if (currentRowspan + this.selectR < this.element.rows.length) {
          const nextColumn = this.element.rows[currentRowspan + this.selectR].columns[this.selectC]

          if (!nextColumn.options.invisible && currentColspan == nextColumn.options.colspan) {
            return true
          }
        }
      }

      return false
    },

    showRemoveRow () {
      if (this.element.rows.length > 1 && this.selectR >= 0 && this.selectC >= 0) {
        const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan
        if (currentRowspan == 1) {
          return true
        } else {
          let i = 0
          for (; i < this.element.rows[this.selectR].columns.length; i++) {
            if (currentRowspan != this.element.rows[this.selectR].columns[i].options.rowspan || this.element.rows[this.selectR].columns[i].options.invisible) {
              return false
            }
          }

          if (this.element.rows[this.selectR].columns.length == i) {
            return true
          }
        }
      }
      return false
    },

    showRemoveColumn () {
      if (this.selectR >= 0 && this.selectC >= 0 && this.element.rows[this.selectR].columns.length > 1) {
        const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan
        if (currentColspan == 1) {
          return true
        } else {
          let i = 0;
          for (; i < this.element.rows.length; i++) {
            if (currentColspan != this.element.rows[i].columns[this.selectC].options.colspan || this.element.rows[i].columns[this.selectC].options.invisible) {
              return false
            }
          }

          if (this.element.rows.length == i) {
            return true
          }
        }
      }

      return false
    },

    showSplitColumn () {
      if (this.selectR >= 0 && this.selectC >= 0) {
        return this.element.rows[this.selectR].columns[this.selectC].options.colspan > 1
      }
      return false
    },

    showSplitRow () {
      if (this.selectR >= 0 && this.selectC >= 0) {
        return this.element.rows[this.selectR].columns[this.selectC].options.rowspan > 1
      }
      return false
    }
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetReport'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetReport'], 'is-hover')
    },
    handleMouseoverTD (r, i) {
      !this.getDragging() && addClass(this.$refs[`widgetTD_${r}_${i}`][0], 'is-hover')
    },
    handleMouseoutTD (r, i) {
      removeClass(this.$refs[`widgetTD_${r}_${i}`][0], 'is-hover')
    },
    handleMouseoverTH (i) {
      !this.getDragging() && addClass(this.$refs[`widgetTH_${i}`][0], 'is-hover')
    },
    handleMouseoutTH (i) {
      removeClass(this.$refs[`widgetTH_${i}`][0], 'is-hover')
    },
    handlePut (a, b, c) {
      if (c.className.split(' ').indexOf('widget-dialog') >=0 || c.className.split(' ').indexOf('dialog-put') >= 0 || c.children[0].className.split(' ').indexOf('dialog-put') >= 0) {
        return false
      }
      return true
    },
    handleSelectWidget (index) {
      this.$emit('update:select', this.data.list[index])
    },
    handleSelectItemWidget (rowIndex, colIndex) {
      this.$emit('update:select', this.data.list[this.index].rows[rowIndex].columns[colIndex])
      this.selectR = rowIndex
      this.selectC = colIndex
    },
    handleSelectHeaderWidget (index) {
      this.$emit('update:select', this.data.list[this.index].headerRow[index])
    },
    handleWidgetDelete (index) {
      if (this.data.list.length == 1) {
        this.$emit('select-change', -1)
      } else {
        if (this.data.list.length - 1 == index) {
          this.$emit('select-change', index - 1)
        } else {
          this.$emit('select-change', index)
        }
      }
      
      this.data.list.splice(index, 1)

      setTimeout(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      }, 20)
    },
    handleWidgetItemAdd ($event, element, rowIndex, colIndex) {
      const newIndex = $event.newIndex

      fixDraggbleList(element.rows[rowIndex].columns[colIndex].list, newIndex)

      const key = Math.random().toString(36).slice(-8)

      element.rows[rowIndex].columns[colIndex].list[newIndex] = _.cloneDeep(element.rows[rowIndex].columns[colIndex].list[newIndex])
      element.rows[rowIndex].columns[colIndex].list[newIndex] = {
        ...element.rows[rowIndex].columns[colIndex].list[newIndex],
        options: {
          ...element.rows[rowIndex].columns[colIndex].list[newIndex].options,
          remoteFunc: element.rows[rowIndex].columns[colIndex].list[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: element.rows[rowIndex].columns[colIndex].list[newIndex].options.remoteOption || 'option_'+key,
          tableColumn: false,
          hideLabel: true,
          subform: this.subform ? true : false
        },
        key: element.rows[rowIndex].columns[colIndex].list[newIndex].key ? element.rows[rowIndex].columns[colIndex].list[newIndex].key : key,
        model: element.rows[rowIndex].columns[colIndex].list[newIndex].model ? element.rows[rowIndex].columns[colIndex].list[newIndex].model : element.rows[rowIndex].columns[colIndex].list[newIndex].type + '_' + key,
        rules: element.rows[rowIndex].columns[colIndex].list[newIndex].rules ? [...element.rows[rowIndex].columns[colIndex].list[newIndex].rules] : []
      }

      if (element.rows[rowIndex].columns[colIndex].list[newIndex].type == 'report') {
        element.rows[rowIndex].columns[colIndex].list[newIndex].rows = generateKeyToTD(element.rows[rowIndex].columns[colIndex].list[newIndex].rows)
        element.rows[rowIndex].columns[colIndex].list[newIndex].headerRow = generateKeyToTH(element.rows[rowIndex].columns[colIndex].list[newIndex].headerRow)
      }

      if (element.rows[rowIndex].columns[colIndex].list[newIndex].type == 'grid') {
        element.rows[rowIndex].columns[colIndex].list[newIndex].columns = generateKeyToCol(element.rows[rowIndex].columns[colIndex].list[newIndex].columns)
      }

      if (['tabs', 'collapse'].includes(element.rows[rowIndex].columns[colIndex].list[newIndex].type)) {
        element.rows[rowIndex].columns[colIndex].list[newIndex].tabs = generateKeyToTab(element.rows[rowIndex].columns[colIndex].list[newIndex].tabs)
      }

      setTimeout(() => {
        this.selectWidget = element.rows[rowIndex].columns[colIndex].list[newIndex]

        EventBus.$emit('on-history-add-' + this.formKey)
      }, 50)
    },
    handleWidgetItemUpdate () {
      EventBus.$emit('on-history-add-' + this.formKey)
    },
    handleReportClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index + 1])

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    },
    handleAddRow (index) {
      const columns = this.data.list[index].rows[this.data.list[index].rows.length - 1].columns.length

      this.data.list[index].rows.push({
        columns: Array.from({length: columns}, _ => {
          return {
            type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
            },
            key: Math.random().toString(36).slice(-8)
          }
        })
      })

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleAddColumns (index) {
      this.data.list[index].headerRow.push({
        type: 'th',
        options: {
          width: ''
        },
        key: Math.random().toString(36).slice(-8)
      })

      this.data.list[index].rows.forEach(item => {
        item.columns.push({
          type: 'td',
          list: [],
          options: {
            customClass: '',
            colspan: 1,
            rowspan: 1,
            align: 'left',
            valign: 'top',
            width: '',
            height: '',
          },
          key: Math.random().toString(36).slice(-8)
        })
      })

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    insertColumns (insertIndex) {
      this.element.headerRow.splice(insertIndex, 0,{
        type: 'th',
        options: {
          width: ''
        },
        key: Math.random().toString(36).slice(-8)
      })

      for (let i = 0; i < this.element.rows.length; i++) {
        const prevIndex = this.findPrevColIndex(i, insertIndex)

        if (prevIndex != insertIndex && this.element.rows[i].columns[insertIndex].options.invisible) {
          this.element.rows[i].columns.splice(insertIndex, 0, {
            type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
              invisible: true
            },
            key: Math.random().toString(36).slice(-8)
          })

          // 插入隐藏列后，进行标记计算
          const beforeColspan = this.element.rows[i].columns[prevIndex].options.colspan

          this.element.rows[i].columns[prevIndex].options.colspan = beforeColspan + 1

          for (let j = 0; j < beforeColspan + 1; j++) {
            this.element.rows[i].columns[prevIndex + j].options.markCol = j
          }
        } else {
          this.element.rows[i].columns.splice(insertIndex, 0, {
            type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
            },
            key: Math.random().toString(36).slice(-8)
          })
        }
      }
    },
    insertRow (insertIndex) {
      const rowArray = []

      for (let i = 0; i < this.element.rows[0].columns.length; i++) {
        const prevIndex = this.findPrevRowIndex(insertIndex, i)

        if (prevIndex != insertIndex && this.element.rows[insertIndex].columns[i].options.invisible) {
          rowArray.push({
            type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
              invisible: true
            },
            key: Math.random().toString(36).slice(-8)
          })

          this.element.rows[prevIndex].columns[i].options.rowspan = this.element.rows[prevIndex].columns[i].options.rowspan + 1
        } else {
          rowArray.push({
            type: 'td',
            list: [],
            options: {
              customClass: '',
              colspan: 1,
              rowspan: 1,
              align: 'left',
              valign: 'top',
              width: '',
              height: '',
            },
            key: Math.random().toString(36).slice(-8)
          })
        }
      }

      this.element.rows.splice(insertIndex, 0, {
        columns: rowArray
      })

      // 行插入成功后，处理标记
      this.$nextTick(() => {
        for (let i = 0; i < this.element.rows[insertIndex].columns.length; i++) {
          if (this.element.rows[insertIndex].columns[i].options.invisible) {
            const prevIndex = this.findPrevRowIndex(insertIndex - 1, i)

            if (!this.element.rows[prevIndex].columns[i].options.invisible) {
              this.markTableItem(prevIndex, i)
            }
          }
        }
      })
    },
    handleInsertLeft () {
      const insertIndex = this.selectC

      this.insertColumns(insertIndex)

      this.selectC =  this.selectC++

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleInsertRight () {
      const insertColIndex = this.element.rows[this.selectR].columns[this.selectC].options.colspan > 1 
        ? this.findNextColIndex(this.selectR, this.selectC + 1) : this.selectC + 1

      this.insertColumns(insertColIndex)

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleInserBefore () {
      const insertIndex = this.selectR

      this.insertRow(insertIndex)

      this.selectR = this.selectR++

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleInserAfter () {
      const insertRowIndex = this.element.rows[this.selectR].columns[this.selectC].options.rowspan > 1
        ? this.findNextRowIndex(this.selectR + 1, this.selectC) : this.selectR + 1

      this.insertRow(insertRowIndex)

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    // 合并的表格做上标记
    markTableItem (R, C) {
      const colspan = this.element.rows[R].columns[C].options.colspan
      const rowspan = this.element.rows[R].columns[C].options.rowspan

      for (let i = 0; i < rowspan; i++) {
        for (let j = 0; j < colspan; j++) {
          this.element.rows[R + i].columns[C + j].options.markCol = j
          this.element.rows[R + i].columns[C + j].options.markRow = i
        }
      }
    },

    handleRight (column) {
      if (!this.showRight) return

      const currentColspan = column.options.colspan
      const nextC = this.selectC + currentColspan
      const nextColspan = this.element.rows[this.selectR].columns[nextC].options.colspan

      column.options.colspan = currentColspan + nextColspan

      this.element.rows[this.selectR].columns[nextC].options.invisible = true // 将被合并项隐藏

      // 处理表格中元素

      const tempList = [...this.element.rows[this.selectR].columns[nextC].list] 

      this.element.rows[this.selectR].columns[nextC].list = []

      column.list = column.list.concat(tempList)

      // 将合并的表格做上标记
      this.markTableItem(this.selectR, this.selectC)

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleBottom (column) {
      if (!this.showBottom) return

      const currentRowspan = column.options.rowspan
      const nextR = this.selectR + currentRowspan
      const nextRowspan = this.element.rows[nextR].columns[this.selectC].options.rowspan

      column.options.rowspan = currentRowspan + nextRowspan

      this.element.rows[nextR].columns[this.selectC].options.invisible = true

      const tempList = [...this.element.rows[nextR].columns[this.selectC].list]

      this.element.rows[nextR].columns[this.selectC].list = []

      column.list = column.list.concat(tempList)

      // 将合并的表格做上标记
      this.markTableItem(this.selectR, this.selectC)

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleSplitColumn () {
      if (!this.showSplitColumn) return

      const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan
      const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan

      for (let i = 0; i < currentColspan; i++) {
        this.element.rows[this.selectR].columns[this.selectC + i].options.invisible = false
        this.element.rows[this.selectR].columns[this.selectC + i].options.colspan = 1
        this.element.rows[this.selectR].columns[this.selectC + i].options.rowspan = currentRowspan

        this.markTableItem(this.selectR, this.selectC + i)
      }

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleSplitRow () {
      if (!this.showSplitRow) return

      const currentColspan = this.element.rows[this.selectR].columns[this.selectC].options.colspan
      const currentRowspan = this.element.rows[this.selectR].columns[this.selectC].options.rowspan

      for (let i = 0; i < currentRowspan; i++) {
        this.element.rows[this.selectR + i].columns[this.selectC].options.invisible = false
        this.element.rows[this.selectR + i].columns[this.selectC].options.rowspan = 1
        this.element.rows[this.selectR + i].columns[this.selectC].options.colspan = currentColspan
        
        this.markTableItem(this.selectR + i, this.selectC)
      }

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    findPrevRowIndex (rowIndex, colIndex) {
      if (rowIndex >=  this.element.rows.length || !this.element.rows[rowIndex].columns[colIndex].options.markRow) {
        return rowIndex
      } else {
        return this.findPrevRowIndex(rowIndex - 1, colIndex)
      }
    },

    findPrevColIndex (rowIndex, colIndex) {

      if (colIndex >= this.element.rows[rowIndex].columns.length || !this.element.rows[rowIndex].columns[colIndex].options.markCol) {
        return colIndex
      } else {
        return this.findPrevColIndex(rowIndex, colIndex - 1)
      }
    },

    findNextColIndex (rowIndex, colIndex) {
      if (colIndex >= this.element.rows[rowIndex].columns.length || !this.element.rows[rowIndex].columns[colIndex].options.markCol) {
        return colIndex
      } else {
        return this.findNextColIndex(rowIndex, colIndex + 1)
      }
    },

    findNextRowIndex (rowIndex, colIndex) {
      if (rowIndex >= this.element.rows.length || !this.element.rows[rowIndex].columns[colIndex].options.markRow) {
        return rowIndex
      } else {
        return this.findNextRowIndex(rowIndex + 1, colIndex)
      }
    },

    handleRemoveRow () {
      if (!this.showRemoveRow) return

      for (let j = 0; j < this.element.rows[this.selectR].columns.length; j++) {
        const currentRowspan = this.element.rows[this.selectR].columns[j].options.rowspan
        const currentcolspan = this.element.rows[this.selectR].columns[j].options.colspan
        const invisible = this.element.rows[this.selectR].columns[j].options.invisible

        if (invisible) {

          const prevIndex = this.findPrevRowIndex(this.selectR, j)

          if (prevIndex != this.selectR && this.element.rows[prevIndex].columns[j].options.rowspan > 1) {
            this.element.rows[prevIndex].columns[j].options.rowspan = this.element.rows[prevIndex].columns[j].options.rowspan - 1
          }

        } else if (currentRowspan > 1) {
          this.element.rows[this.selectR + 1].columns[j].list = [...this.element.rows[this.selectR].columns[j].list]
          this.element.rows[this.selectR + 1].columns[j].options.invisible = false
          this.element.rows[this.selectR + 1].columns[j].options.rowspan = currentRowspan - 1
          this.element.rows[this.selectR + 1].columns[j].options.colspan = currentcolspan

          // 重新计算标记
          this.markTableItem(this.selectR + 1, j)
        } else {
          
        }
      }

      this.element.rows.splice(this.selectR, 1)

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleRemoveColumn () {
      if (!this.showRemoveColumn) return 

      for (let i = 0; i < this.element.rows.length; i++) {
        
        const currentColspan = this.element.rows[i].columns[this.selectC].options.colspan
        const currentRowspan = this.element.rows[i].columns[this.selectC].options.rowspan
        const invisible = this.element.rows[i].columns[this.selectC].options.invisible

        if (invisible) {
          const prevIndex = this.findPrevColIndex(i, this.selectC)

          if (prevIndex != this.selectC && this.element.rows[i].columns[prevIndex].options.colspan > 1) {
            this.element.rows[i].columns[prevIndex].options.colspan = this.element.rows[i].columns[prevIndex].options.colspan - 1
          }
        } else if (currentColspan > 1) {
          this.element.rows[i].columns[this.selectC + 1].list = [...this.element.rows[i].columns[this.selectC].list]
          this.element.rows[i].columns[this.selectC + 1].options.invisible = false
          this.element.rows[i].columns[this.selectC + 1].options.colspan = currentColspan - 1
          this.element.rows[i].columns[this.selectC + 1].options.rowspan = currentRowspan

          // 重新计算标记
          this.markTableItem(i, this.selectC + 1)
        } else {
        }

        this.element.rows[i].columns.splice(this.selectC, 1)
      }

      this.element.headerRow.splice(this.selectC, 1)

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleSetColumnWidth () {
      this.$emit('update:select', this.data.list[this.index].headerRow[this.selectC])
    },

    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (
          this.$emit('update:select', item.list[index])
        ) : (
          this.$emit('update:select', this.data.list[this.index])
        )
      })
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
      
      this.element.headerRow && (this.selectIndex = this.element.headerRow.findIndex(item => item.key === val.key))
    },
    selectWidget (val) {
      this.$emit('update:select', val)

      this.element.headerRow && (this.selectIndex = this.element.headerRow.findIndex(item => item.key === val.key))
    }
  }
}

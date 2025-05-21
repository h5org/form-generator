import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToCol, generateKeyToTab, generateKeyToTH } from '../util'
import _ from 'lodash'
import { ElMessage } from '../util/message.js'

export const widgetFormMixin = {
  props: ['data', 'select', 'platform', 'formKey'],
  emits: ['update:select'],
  inject: ['changeConfigTab', 'setDragging'],
  data () {
    return {
      selectWidget: this.select || {}
    }
  },
  mounted () {
    document.body.ondrop = function (event) {
      let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
      if (isFirefox) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    EventBus.$on('on-field-add-' + this.formKey, item => {

      const key = Math.random().toString(36).slice(-8)
      let widgetItem = _.cloneDeep({
        ...item,
        options: {
          ...item.options,
          remoteFunc: 'func_' + key,
          remoteOption: 'option_' + key
        },
        key,
        model: item.type + '_' + key,
        rules: []
      })

      if (widgetItem.type == 'report') {
        widgetItem.rows = generateKeyToTD(widgetItem.rows)
        widgetItem.headerRow = generateKeyToTH(widgetItem.headerRow)
      }

      if (widgetItem.type == 'grid') {
        widgetItem.columns = generateKeyToCol(widgetItem.columns)
      }

      if (widgetItem.type == 'tabs') {
        widgetItem.tabs = generateKeyToTab(widgetItem.tabs)
      }

      widgetItem.options.subform = this.selectWidget?.options?.subform
      widgetItem.options.tableColumn = this.selectWidget?.options?.tableColumn

      this._addWidget(this.data.list, widgetItem)
    })
  },
  beforeUnmount () {
    EventBus.$off('on-field-add-' + this.formKey)
  },
  methods: {
    _addWidget (list, widget, isTable = false) {
      
      if (isTable 
        && (widget.type == 'subform' 
          || widget.type == 'grid' 
          || widget.type == 'table' 
          || widget.type == 'tabs' 
          || widget.type == 'collapse' 
          || widget.type == 'divider' 
          || widget.type == 'report' 
          || widget.type == 'inline'
          || widget.type == 'dialog'
          || widget.type == 'card'
        )) {
        ElMessage({
          message: this.$t('fm.message.noPut'),
          type: 'warning'
        }, this)
        return 'table'
      }

      if (this.selectWidget && this.selectWidget.key) {
        const index = list.findIndex(item => item.key == this.selectWidget.key)

        if (index >= 0) {
          list.splice(index + 1, 0, widget)

          this.selectWidget = list[index + 1]

          setTimeout(() => {
            this.scrollTo()
          }, 200)

          this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
        } else {
          for (let l = 0; l < list.length; l++) {
            let item = list[l]

            if (item.type === 'grid') {
              item.columns.forEach(column => {
                this._addWidget(column.list, widget)
              })
            }
            if (item.type === 'table') {
              if ('table' == this._addWidget(item.tableColumns, widget, true)) {
                return 'table'
              }
            }
            if (item.type === 'subform') {
              if ('table' == this._addWidget(item.list, widget, true)) {
                return 'table'
              }
            }
            if (item.type === 'tabs') {
              item.tabs.forEach(tab => {
                this._addWidget(tab.list, widget)
              })
            }
            if (item.type === 'collapse') {
              item.tabs.forEach(tab => {
                this._addWidget(tab.list, widget)
              })
            }
            if (item.type === 'report') {

              for (let i = 0; i < item.rows.length; i++) {
                for (let j = 0; j < item.rows[i].columns.length; j++) {
                  widget.options.hideLabel = true
                  if ('table' == this._addWidget(item.rows[i].columns[j].list, widget, false)){
                    return 'table'
                  }
                }
              }
            }
            if (item.type === 'inline') {
              if ('table' == this._addWidget(item.list, widget, true)) {
                return 'table'
              }
            }

            if (item.type === 'dialog') {
              if ('table' == this._addWidget(item.list, widget, true)) {
                return 'table'
              }
            }

            if (item.type === 'card') {
              if ('table' == this._addWidget(item.list, widget, true)) {
                return 'table'
              }
            }

            if (item.type === 'group') {
              if ('table' == this._addWidget(item.list, widget, true)) {
                return 'table'
              }
            }
          }
        }
      } else {
        list.push(widget)

        this.selectWidget = list[list.length - 1]

        setTimeout(() => {
          this.scrollTo()
        }, 200)

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      }
    },
    handleMoveStart () {
      this.setDragging(true)
    },
    handleMoveEnd () {
      this.setDragging(false)
    },
    handleWidgetUpdate (evt) {
      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleWidgetAdd (evt) {
      const newIndex = evt.newIndex
      const to = evt.to

      this.data.list[newIndex] = _.cloneDeep(this.data.list[newIndex])
      
      //为拖拽到容器的元素添加唯一 key
      const key = Math.random().toString(36).slice(-8)
      this.data.list[newIndex] = {
        ...this.data.list[newIndex],
        options: {
          ...this.data.list[newIndex].options,
          remoteFunc: this.data.list[newIndex].options.remoteFunc || 'func_' + key,
          remoteOption: this.data.list[newIndex].options.remoteOption || 'option_' + key,
          tableColumn: false,
          subform: false
        },
        key: this.data.list[newIndex].key ? this.data.list[newIndex].key : key,
        // 绑定键值
        model: this.data.list[newIndex].model ? this.data.list[newIndex].model : this.data.list[newIndex].type + '_' + key,
        rules: this.data.list[newIndex].rules ? [...this.data.list[newIndex].rules] : []
      }

      if (this.data.list[newIndex].type == 'report') {
        this.data.list[newIndex].rows = generateKeyToTD(this.data.list[newIndex].rows)
        this.data.list[newIndex].headerRow = generateKeyToTH(this.data.list[newIndex].headerRow)
      }

      if (this.data.list[newIndex].type == 'grid') {
        this.data.list[newIndex].columns = generateKeyToCol(this.data.list[newIndex].columns)
      }

      if (['tabs', 'collapse'].includes(this.data.list[newIndex].type)) {
        this.data.list[newIndex].tabs = generateKeyToTab(this.data.list[newIndex].tabs)
      }

      this.$nextTick(() => {
        this.selectWidget = this.data.list[newIndex]
        EventBus.$emit('on-history-add-' + this.formKey)  
      })

    },
    handleWidgetDelete (index) {
      if (this.data.list.length - 1 === index) {
        if (index === 0) {
          this.selectWidget = {}
        } else {
          this.selectWidget = this.data.list[index - 1]
        }
      } else {
        this.selectWidget = this.data.list[index + 1]
      }

      this.$nextTick(() => {
        this.data.list.splice(index, 1)

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    },
    handleSelectChange (index) {
      setTimeout(() => {
        index >=0 ? (this.selectWidget = this.data.list[index]) : (this.selectWidget = {})
      })
    },
    scrollTo () {
      let activeElement = document.querySelector('.widget-form-container .active')

      if (!activeElement) {
        return false
      }
      
      let activeTop = activeElement.getBoundingClientRect().top

      let activeHeight = activeElement.offsetHeight

      let containerHeight = document.querySelector('.widget-form-container').offsetHeight

      let containerTop = document.querySelector('.widget-form-container').getBoundingClientRect().top

      let scorllTop = document.querySelector('.widget-form-container .el-scrollbar__view').getBoundingClientRect().top

      let y = activeTop - scorllTop

      let top = scorllTop - containerTop

      if ( y + activeHeight  > -top + containerHeight || y  < -top ) {
        this.$refs.formScrollRef.scrollTo({top: y - 5, behavior: "smooth"})
      }
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
      if (Object.keys(val).length) {
        this.changeConfigTab('widget')
      } else {
        this.changeConfigTab('form')
      }
    },
    selectWidget (val) {
      this.$emit('update:select', val)
    }
  }
}
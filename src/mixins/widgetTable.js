import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { addClass, removeClass } from '../util'

export const widgetTableMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey'],
  emits: ['select-change', 'update:select'],
  inject: ['setDragging', 'getDragging'],
  data () {
    return {
      selectWidget: this.select || {},
      columnsWidthStyle: '200px'
    }
  },
  mounted () {
    this.calcTableColumnsWidth()
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetTable'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetTable'], 'is-hover')
    },
    handleSelectWidget (index) {
      this.$emit('update:select', this.data.list[index])
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
    handleTableClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index + 1])

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    },
    handleWidgetTableUpdate (evt) {
      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    calcTableColumnsWidth () {

      this.columnsWidthStyle = 'calc(200px)'

      let widthArray = []

      for (let i = 0; i < this.element.tableColumns.length; i++) {
        if (!this.element.tableColumns[i].options.width) {
          widthArray.push('200px')
        } else {
          widthArray.push(this.element.tableColumns[i].options.width)
        }
      }

      widthArray.length && (this.columnsWidthStyle = `calc(200px + ${widthArray.join(' + ')})`)
    },
    handlePut (a, b, c) {
      
      if (c.className.split(' ').indexOf('widget-col') >=0 || 
        c.className.split(' ').indexOf('widget-table') >= 0 || 
        c.className.split(' ').indexOf('widget-tab') >= 0 ||
        c.className.split(' ').indexOf('widget-report') >= 0 ||
        c.className.split(' ').indexOf('widget-inline') >= 0 ||
        c.className.split(' ').indexOf('widget-subform') >= 0 ||
        c.className.split(' ').indexOf('widget-dialog') >= 0 ||
        c.className.split(' ').indexOf('widget-card') >= 0 ||
        c.className.split(' ').indexOf('widget-group') >= 0 ||
        c.className.split(' ').indexOf('no-put') >= 0 || 
        c.children[0].className.split(' ').indexOf('no-put') >= 0) {
        return false
      }
      return true
    },
    handleWidgetTableAdd ($event, table) {
      const newIndex = $event.newIndex
      const key = Math.random().toString(36).slice(-8)
      table.tableColumns[newIndex] = _.cloneDeep(table.tableColumns[newIndex])
      table.tableColumns[newIndex] = {
        ...table.tableColumns[newIndex],
        options: {
          ...table.tableColumns[newIndex].options,
          remoteFunc: table.tableColumns[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: table.tableColumns[newIndex].options.remoteOption || 'option_'+key,
          tableColumn: true,
          subform: this.subform ? true : false
        },
        novalid: {
          ...table.tableColumns[newIndex].novalid,
        },
        key: table.tableColumns[newIndex].key ? table.tableColumns[newIndex].key : key,
        model: table.tableColumns[newIndex].model ? table.tableColumns[newIndex].model : table.tableColumns[newIndex].type + '_' + key,
        rules: table.tableColumns[newIndex].rules ? [...table.tableColumns[newIndex].rules] : []
      }

      this.$nextTick(() => {         
        this.selectWidget = table.tableColumns[newIndex]
        EventBus.$emit('on-history-add-' + this.formKey)       
      })
    },
    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (
          this.$emit('update:select', this.element.tableColumns[index])
        ) : (
          this.$emit('update:select', this.data.list[this.index])
        )
      })
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget (val) {
      this.$emit('update:select', val)
    },
    element: {
      deep: true,
      handler (val) {
        
        this.calcTableColumnsWidth()
      }
    }
  }
}
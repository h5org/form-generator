import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { addClass, removeClass } from '../util'

export const widgetInlineMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey', 'subform'],
  emits: ['select-change', 'update:select'],
  inject: ['setDragging', 'getDragging'],
  data () {
    return {
      selectWidget: this.select || {}
    }
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetInline'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetInline'], 'is-hover')
    },
    handleSelectWidget (index) {
      this.selectWidget = this.data.list[index]
    },
    handlePut (a, b, c) {
      
      if (c.className.split(' ').indexOf('widget-col') >=0 || 
        c.className.split(' ').indexOf('widget-table') >= 0 || 
        c.className.split(' ').indexOf('widget-tab') >= 0 ||
        c.className.split(' ').indexOf('widget-inline') >= 0 ||
        c.className.split(' ').indexOf('widget-report') >=0 ||
        c.className.split(' ').indexOf('widget-dialog') >= 0 ||
        c.className.split(' ').indexOf('widget-card') >= 0 ||
        c.className.split(' ').indexOf('no-put') >= 0 || 
        c.children[0].className.split(' ').indexOf('no-put') >= 0) {
        return false
      }
      return true
    },
    handleWidgetInlineAdd ($event, table) {
      const newIndex = $event.newIndex
      const key = Math.random().toString(36).slice(-8)
      table.list[newIndex] = _.cloneDeep(table.list[newIndex])
      table.list[newIndex] = {
        ...table.list[newIndex],
        options: {
          ...table.list[newIndex].options,
          remoteFunc: table.list[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: table.list[newIndex].options.remoteOption || 'option_'+key,
          subform: this.subform ? true : false,
          tableColumn: false
        },
        key: table.list[newIndex].key ? table.list[newIndex].key : key,
        model: table.list[newIndex].model ? table.list[newIndex].model : table.list[newIndex].type + '_' + key,
        rules: table.list[newIndex].rules ? [...table.list[newIndex].rules] : []
      }

      this.$nextTick(() => {         
        this.selectWidget = table.list[newIndex]
        EventBus.$emit('on-history-add-' + this.formKey)       
      })
    },
    handleInlineClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
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
    handleWidgetInlineUpdate () {
      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (this.selectWidget = item.list[index]) : (this.selectWidget = this.data.list[this.index])
      })
    }
  },
  watch: {
    select (val) {
      this.selectWidget = val
    },
    selectWidget (val) {
      this.$emit('update:select', val)
    }
  }
}
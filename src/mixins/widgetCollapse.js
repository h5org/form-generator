import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToTH, generateKeyToCol, generateKeyToTab, fixDraggbleList, addClass, removeClass } from '../util'

export const widgetCollapseMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey', 'subform'],
  emits: ['select-change', 'update:select'],
  inject: ['getDragging', 'setDragging'],
  data () {
    return {
      tabActive: this.element.tabs.map(t => t.name),
      selectWidget: this.select || {}
    }
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetCollapse'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetCollapse'], 'is-hover')
    },
    handlePut (a, b, c) {
      if (c.className.split(' ').indexOf('widget-dialog') >=0 || c.className.split(' ').indexOf('dialog-put') >= 0 || c.children[0].className.split(' ').indexOf('dialog-put') >= 0) {
        return false
      }
      return true
    },
    handleSelectWidget (index) {
      this.selectWidget = this.data.list[index]
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
    handleTabClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.selectWidget = this.data.list[index + 1]

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    },
    handleWidgetTabUpdate (evt) {
      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },
    handleWidgetTabAdd ($event, element, tabIndex) {
      const newIndex = $event.newIndex

      const key = Math.random().toString(36).slice(-8)

      fixDraggbleList(element.tabs[tabIndex].list, newIndex)

      element.tabs[tabIndex].list[newIndex] = _.cloneDeep(element.tabs[tabIndex].list[newIndex])
      element.tabs[tabIndex].list[newIndex] = {
        ...element.tabs[tabIndex].list[newIndex],
        options: {
          ...element.tabs[tabIndex].list[newIndex].options,
          remoteFunc: element.tabs[tabIndex].list[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: element.tabs[tabIndex].list[newIndex].options.remoteOption || 'option_'+key,
          tableColumn: false,
          subform: this.subform ? true : false
        },
        key: element.tabs[tabIndex].list[newIndex].key ? element.tabs[tabIndex].list[newIndex].key : key,
        model: element.tabs[tabIndex].list[newIndex].model ? element.tabs[tabIndex].list[newIndex].model : element.tabs[tabIndex].list[newIndex].type + '_' + key,
        rules: element.tabs[tabIndex].list[newIndex].rules ? [...element.tabs[tabIndex].list[newIndex].rules] : []
      }

      if (element.tabs[tabIndex].list[newIndex].type == 'report') {
        element.tabs[tabIndex].list[newIndex].rows = generateKeyToTD(element.tabs[tabIndex].list[newIndex].rows)
        element.tabs[tabIndex].list[newIndex].headerRow = generateKeyToTH(element.tabs[tabIndex].list[newIndex].headerRow)
      }

      if (element.tabs[tabIndex].list[newIndex].type == 'grid') {
        element.tabs[tabIndex].list[newIndex].columns = generateKeyToCol(element.tabs[tabIndex].list[newIndex].columns)
      }

      if (['tabs', 'collapse'].includes(element.tabs[tabIndex].list[newIndex].type)) {
        element.tabs[tabIndex].list[newIndex].tabs = generateKeyToTab(element.tabs[tabIndex].list[newIndex].tabs)
      }

      setTimeout(() => {
        this.selectWidget = element.tabs[tabIndex].list[newIndex]
        EventBus.$emit('on-history-add-' + this.formKey)   
      }, 50)
    },
    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (this.selectWidget = item.list[index]) : (this.selectWidget = {})
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
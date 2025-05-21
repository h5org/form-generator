import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToTH, generateKeyToCol, generateKeyToTab, fixDraggbleList, addClass, removeClass } from '../util'

export const widgetCardMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey', 'subform'],
  emits: ['select-change', 'update:select'],
  inject: ['getDragging', 'setDragging'],
  data () {
    return {
      selectWidget: this.select || {}
    }
  },
  computed: {
    padding () {
      return this.element.options.padding || '20px'
    }
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetCard'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetCard'], 'is-hover')
    },
    handlePut (a, b, c) {
      if (
        c.className.split(' ').indexOf('widget-dialog') >= 0 ||
        c.className.split(' ').indexOf('dialog-put') >= 0 || 
        c.children[0].className.split(' ').indexOf('dialog-put') >= 0) {
        return false
      }
      return true
    },
    handleSelectWidget (index) {
      this.$emit('update:select', this.data.list[index])
    },
    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (
          this.$emit('update:select', this.element.list[index])
        ) : (
          this.$emit('update:select', this.data.list[this.index])
        )
      })
    },
    handleWidgetClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])

      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index + 1])

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
    handleWidgetCardAdd ($event, element) {
      const newIndex = $event.newIndex

      const key = Math.random().toString(36).slice(-8)

      fixDraggbleList(element.list, newIndex)

      element.list[newIndex] = _.cloneDeep(element.list[newIndex])
      element.list[newIndex] = {
        ...element.list[newIndex],
        options: {
          ...element.list[newIndex].options,
          remoteFunc: element.list[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: element.list[newIndex].options.remoteOption || 'option_'+key,
          tableColumn: false,
          subform: false
        },
        key: element.list[newIndex].key ? element.list[newIndex].key : key,
        model: element.list[newIndex].model ? element.list[newIndex].model : element.list[newIndex].type + '_' + key,
        rules: element.list[newIndex].rules ? [...element.list[newIndex].rules] : []
      }

      if (element.list[newIndex].type == 'report') {
        element.list[newIndex].rows = generateKeyToTD(element.list[newIndex].rows)
        element.list[newIndex].headerRow = generateKeyToTH(element.list[newIndex].headerRow)
      }

      if (element.list[newIndex].type == 'grid') {
        element.list[newIndex].columns = generateKeyToCol(element.list[newIndex].columns)
      }

      if (['tabs', 'collapse'].includes(element.list[newIndex].type)) {
        element.list[newIndex].tabs = generateKeyToTab(element.list[newIndex].tabs)
      }

      this.$nextTick(() => {
        this.selectWidget = element.list[newIndex]
        EventBus.$emit('on-history-add-' + this.formKey) 
      })
    },
    handleWidgetCardUpdate () {
      EventBus.$emit('on-history-add-' + this.formKey)
    },
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
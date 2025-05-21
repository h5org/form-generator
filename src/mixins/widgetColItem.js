import _ from 'lodash'
import { CloneLayout } from '../util/layout-clone.js'
import { EventBus } from '../util/event-bus.js'
import { generateKeyToTD, generateKeyToTH, generateKeyToCol, generateKeyToTab, fixDraggbleList, addClass, removeClass } from '../util'

export const widgetColItemMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey', 'subform'],
  emits: ['select-change', 'update:select'],
  inject: ['getDragging', 'setDragging'],
  data () {
    return {
      selectWidget: this.select || {},
      selectIndex: -1
    }
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetCol'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetCol'], 'is-hover')
    },
    handleMouseoverCol (i) {
      !this.getDragging() && addClass(this.$refs['widgetColItem'][i].$el, 'is-hover')
    },
    handleMouseoutCol (i) {
      removeClass(this.$refs['widgetColItem'][i].$el, 'is-hover')
    },
    handlePut (a, b, c) {
      if (c.className.split(' ').indexOf('widget-dialog') >=0 || c.className.split(' ').indexOf('dialog-put') >= 0 || c.children[0].className.split(' ').indexOf('dialog-put') >= 0) {
        return false
      }
      return true
    },
    getColSpan (options) {
      
      if (this.platform == 'pc') {
        return options && options.md
      }
      if (this.platform == 'pad') {
        return options && options.sm
      }
      if (this.platform == 'mobile') {
        return options && options.xs
      }
    },
    handleSelectWidget (index) {
      this.$emit('update:select',  this.data.list[index])
    },
    handleSelectItemWidget (i) {
      this.$emit('update:select', this.data.list[this.index].columns[i])

      this.selectIndex = i
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

    handleColItemDelete (index, i) {
      this.data.list[index].columns.splice(i, 1)

      if (i == 0) {
        this.$emit('update:select', this.data.list[index].columns[0])
      } else {
        this.$emit('update:select', this.data.list[index].columns[i - 1])
      }

      setTimeout(() => {
        EventBus.$emit('on-history-add-' + this.formKey)
      }, 20)
    },

    handleAddCol (index) {
      this.data.list[index].columns.push({
        type: 'col',
        options: {
          span: 12,
          offset: 0,
          push: 0,
          pull: 0,
          xs: 24,
          sm: 12,
          md: 12,
          lg: 12,
          xl: 12,
          customClass: ''
        },
        list: [],
        key: Math.random().toString(36).slice(-8)
      })

      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleColClone (index) {
      let cloneData = _.cloneDeep(this.data.list[index])
      this.data.list.splice(index + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.data.list[index + 1]

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    },

    handleColItemClone (index, i) {
      let cloneData = _.cloneDeep(this.data.list[index].columns[i])
      this.data.list[index].columns.splice(i + 1, 0, CloneLayout(cloneData))

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index].columns[i + 1])

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    },

    handleWidgetColUpdate (evt) {
      this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
    },

    handleWidgetColAdd ($event, row, colIndex) {

      const newIndex = $event.newIndex

      fixDraggbleList(row.columns[colIndex].list, newIndex)

      row.columns[colIndex].list[newIndex] = _.cloneDeep(row.columns[colIndex].list[newIndex])
      
      const key = Math.random().toString(36).slice(-8)
      row.columns[colIndex].list[newIndex] = {
        ...row.columns[colIndex].list[newIndex],
        options: {
          ...row.columns[colIndex].list[newIndex].options,
          remoteFunc: row.columns[colIndex].list[newIndex].options.remoteFunc || 'func_'+key,
          remoteOption: row.columns[colIndex].list[newIndex].options.remoteOption || 'option_'+key,
          tableColumn: false,
          subform: this.subform ? true : false
        },
        novalid: {
          ...row.columns[colIndex].list[newIndex].novalid,
        },
        key: row.columns[colIndex].list[newIndex].key ? row.columns[colIndex].list[newIndex].key : key,
        model: row.columns[colIndex].list[newIndex].model ? row.columns[colIndex].list[newIndex].model : row.columns[colIndex].list[newIndex].type + '_' + key,
        rules: row.columns[colIndex].list[newIndex].rules ? [...row.columns[colIndex].list[newIndex].rules] : []
      }

      if (row.columns[colIndex].list[newIndex].type == 'report') {
        row.columns[colIndex].list[newIndex].rows = generateKeyToTD(row.columns[colIndex].list[newIndex].rows)
        row.columns[colIndex].list[newIndex].headerRow = generateKeyToTH(row.columns[colIndex].list[newIndex].headerRow)
      }

      if (row.columns[colIndex].list[newIndex].type == 'grid') {
        row.columns[colIndex].list[newIndex].columns = generateKeyToCol(row.columns[colIndex].list[newIndex].columns)
      }

      if (['tabs', 'collapse'].includes(row.columns[colIndex].list[newIndex].type)) {
        row.columns[colIndex].list[newIndex].tabs = generateKeyToTab(row.columns[colIndex].list[newIndex].tabs)
      }

      setTimeout(() => {
        this.selectWidget = row.columns[colIndex].list[newIndex]
        EventBus.$emit('on-history-add-' + this.formKey)  
      }, 50)
    },
    handleSelectChange (index, item) {
      setTimeout(() => {
        index >=0 ? (
          this.$emit('update:select', item.list[index])
        ) : (
          this.$emit('update:select', {})
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
    }
  }
}
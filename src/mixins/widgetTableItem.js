import _ from 'lodash'
import { EventBus } from '../util/event-bus.js'
import { addClass, removeClass } from '../util'

export const widgetTableItemMixin = {
  props: ['element', 'select', 'index', 'data', 'platform', 'formKey'],
  emits: ['select-change', 'update:select'],
  data () {
    return {
      selectWidget: this.select || {}
    }
  },
  methods: {
    handleMouseover (e) {
      addClass(this.$refs['widgetTableItem'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetTableItem'], 'is-hover')
    },
    handleSelectWidget (index) {
      this.$emit('update:select', this.data[index])
    },
    handleWidgetDelete (index) {
      if (this.data.length == 1) {
        this.$emit('select-change', -1)
      } else {
        if (this.data.length - 1 == index) {
          this.$emit('select-change', index - 1)
        } else {
          this.$emit('select-change', index)
        }
      }

      this.$nextTick(() => {
        this.data.splice(index, 1)

        setTimeout(() => {
          EventBus.$emit('on-history-add-' + this.formKey)
        }, 20)
      })
    },
    handleWidgetClone (index) {
      const key = Math.random().toString(36).slice(-8)
      let cloneData = {
        ..._.cloneDeep(this.data[index]),
        key,
        model: this.data[index].type + '_' + key,
      }

      this.data.splice(index + 1, 0, cloneData)

      this.$nextTick(() => {
        this.$emit('update:select', this.data[index + 1])

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
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
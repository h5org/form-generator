import _ from 'lodash'
import { EventBus } from '../util/event-bus.js'
import { addClass, removeClass } from '../util/index'

export const widgetFormItemMixin = {
  props: ['element', 'select', 'index', 'data', 'formKey'],
  emits: ['select-change', 'update:data', 'update:select'],
  inject: ['getDragging'],
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    handleMouseover (e) {
      !this.getDragging() && addClass(this.$refs['widgetFormItem'], 'is-hover')
    },
    handleMouseout (e) {
      removeClass(this.$refs['widgetFormItem'], 'is-hover')
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

      this.$nextTick(() => {
        this.data.list.splice(index, 1)

        setTimeout(() => {
          
          EventBus.$emit('on-history-add-' + this.formKey)
        }, 20)
      })
    },
    handleWidgetClone (index) {
      const key = Math.random().toString(36).slice(-8)
      let cloneData = {
        ..._.cloneDeep(this.data.list[index]),
        key,
        model: this.data.list[index].type + '_' + key,
      }
      
      this.data.list.splice(index + 1, 0, cloneData)

      this.$nextTick(() => {
        this.$emit('update:select', this.data.list[index + 1])

        this.$nextTick(() => {         EventBus.$emit('on-history-add-' + this.formKey)       })
      })
    }
  },
  watch: {
  }
}
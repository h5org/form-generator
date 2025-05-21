import {executeExpression, isExpression, extractExpression} from '../util/expression'
import {defineComponent} from 'vue'

export const ErrorBoundary = defineComponent({
  template: `
    <div>
      <slot v-if="!error"></slot>
      <div v-else>发生错误: {{ error.message }}</div>
    </div>
  `,
  data() {
    return {
      error: null
    };
  },
  errorCaptured(err) {
    this.error = err; // 捕获错误
    return false; // 防止向上传递
  }
})

export const widgetElementItemMixin = {
  props: ['element', 'isTable'],
  data () {
    return {
      key: Math.random().toString(36).slice(-8),
      elementKey: Math.random().toString(36).slice(-8),
    }
  },
  computed: {
    elementDisabled () {
      if (isExpression(this.element.options.disabled)) {
        return true
      }

      return this.element.options.disabled
    },

    extendProps () {
      let obj = {}

      this.element.options.extendProps && Object.keys(this.element.options.extendProps).forEach(key => {
        let value = this.element.options.extendProps[key]

        if (!isExpression(value)) {
          obj[key] = value
        } else {
          obj[key] = executeExpression(extractExpression(value), {}, null)
        }
      })

      return obj
    },
  },
  created () {
    if (this.element.type == 'component') {
      this.$options.components[`component-${this.element.key}`] = {
        template: (`<ErrorBoundary>${this.element.options.template}</ErrorBoundary>`).replace(/formState(\.\w+)+/g, (match) => {
          return match.replace(/\./g, '?.');
        }),
        props: ['modelValue'],
        components: {
          ErrorBoundary
        },
        data: () => ({
          dataModel: this.modelValue,
          formState: {}
        }),
        errorCaptured(err) {
          return false
        }
      }
    }
  },
  beforeUnmount () {
    if (this.$options && this.$options.components && this.$options.components[`component-${this.element.key}`]) {
      this.$options.components[`component-${this.element.key}`] = null
    }
  },
  watch: {
    'element.options.template': function (val) {

      setTimeout(() => {
        this.$options.components[`component-${this.element.key}`] = {
          template: (`<ErrorBoundary>${val}</ErrorBoundary>`).replace(/formState(\.\w+)+/g, (match) => {
            return match.replace(/\./g, '?.');
          }),
          props: ['modelValue'],
          components: {
            ErrorBoundary
          },
          data: () => ({
            dataModel: this.modelValue,
            formState: {}
          }),
          errorCaptured(err) {
            return false
          }
        }
  
        this.key = Math.random().toString(36).slice(-8)
      })
    },
    'element.options.defaultValue': function (val) {
      this.elementKey = Math.random().toString(36).slice(-8)
      
    }
  }
}
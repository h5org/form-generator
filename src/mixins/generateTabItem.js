import {executeExpression, isExpression, extractExpression} from '../util/expression'

export const generateTabItemMixin = {
  props: ['config', 'element', 'model', 'rules', 'remote', 'blanks', 'display', 'edit', 'remoteOption', 'platform', 'preview', 'containerKey', 'dataSourceValue', 'eventFunction', 'printRead', 'isSubform', 'rowIndex', 'subName', 'subHideFields', 'subDisabledFields', 'isDialog', 'dialogName', 'isGroup', 'group', 'fieldNode'],
  data () {
    return {
      dataModels: this.model,
      tabActive: this.element.tabs.length ? this.element.tabs[0].name : '',
    }
  },
  computed: {
    currentOptions () {
      if (this.isSubform) {
        return {
          fieldNode: this.fieldNode ? `${this.fieldNode}.${this.element.model}` : this.element.model,
          rowIndex: this.rowIndex,
          row: this.model
        }
      } else {
        return {
          fieldNode: this.fieldNode ? `${this.fieldNode}.${this.element.model}` : this.element.model,
        }
      }
    },
    elementDisplay () {
      let curFullField = this.fieldNode ? this.fieldNode + '.' + this.element.model : this.element.model
      let curField = this.group ? this.group + '.' + this.element.model : this.element.model

      if (this.dynamicHideFields[curFullField] != undefined) {
        return !this.dynamicHideFields[curFullField]
      }

      if (this.dynamicHideFields[curField] != undefined) {
        return !this.dynamicHideFields[curField]
      }

      if (typeof this.element.options.hidden === 'boolean') {
        return !this.element.options.hidden
      } else {
        if (isExpression(this.element.options.hidden)) {
          return  !executeExpression(extractExpression(this.element.options.hidden), this.currentOptions, this.formContext)
        }
      }

      return true
    }
  },
  inject: ['generateComponentInstance', 'deleteComponentInstance', 'dynamicHideFields', 'formContext'],
  mounted () {
    this.generateComponentInstance && this.generateComponentInstance(this.fieldNode ? `${this.fieldNode}.${this.element.model}` : this.element.model, this)
  },
  beforeUnmount () {
    this.deleteComponentInstance && this.deleteComponentInstance(this.fieldNode ? `${this.fieldNode}.${this.element.model}` : this.element.model)
  },
  methods: {
    activateTab (label) {
      const currentTab = this.element.tabs.find(item => item.label == label)

      if (currentTab) {
        this.tabActive = currentTab.name
      }
    }
  },
  watch: {
    model: {
      deep: true,
      handler (val) {
        this.dataModels = this.model
      }
    }
  }
}
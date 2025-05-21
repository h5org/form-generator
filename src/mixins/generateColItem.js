import {executeExpression, isExpression, extractExpression} from '../util/expression'

export const generateColItemMixin = {
  props: ['config', 'element', 'model', 'rules', 'remote', 'blanks', 'display', 'edit', 'remoteOption', 'platform', 'preview', 'containerKey', 'dataSourceValue', 'eventFunction', 'printRead', 'isSubform', 'rowIndex', 'subName', 'subHideFields', 'subDisabledFields', 'isDialog', 'dialogName', 'group', 'fieldNode', 'isGroup'],
  data () {
    return {
      dataModels: this.model,
      hideCols: []
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
    getColXS (options) {
      if (this.preview) {
        if (this.platform == 'pc') {
          return options.md
        }
        if (this.platform == 'pad') {
          return options.sm
        }
        if (this.platform == 'mobile') {
          return options.xs
        }
      } else {
        return options.xs
      }
    },
    getColSM (options) {
      if (this.preview) {
        if (this.platform == 'pc') {
          return options.md
        }
        if (this.platform == 'pad') {
          return options.sm
        }
        if (this.platform == 'mobile') {
          return options.xs
        }
      } else {
        return options.sm
      }
    },
    getColMD (options) {
      if (this.preview) {
        if (this.platform == 'pc') {
          return options.md
        }
        if (this.platform == 'pad') {
          return options.sm
        }
        if (this.platform == 'mobile') {
          return options.xs
        }
      } else {
        return options.md
      }
    },
    hideCol (index) {
      !this.hideCols.includes(index) && this.hideCols.push(index)
    },
    displayCol (index) {
      if (this.hideCols.includes(index)) {
        this.hideCols.splice(this.hideCols.indexOf(index), 1)
      }
    }
  },
  watch: {
    model: {
      deep: true,
      handler (val) {
        this.dataModels = val
      }
    }
  }
}
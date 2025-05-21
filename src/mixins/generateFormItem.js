import _ from 'lodash'
import {executeExpression, isExpression, extractExpression} from '../util/expression'

export const generateFormItemMixin = {
  props: ['config', 'widget', 'models', 'rules', 'remote', 'blanks', 'display', 'edit', 
    'remoteOption', 'platform', 'preview', 'containerKey', 'dataSourceValue', 'eventFunction', 
    'printRead', 'isSubform', 'rowIndex', 'subName', 'subHideFields', 'subDisabledFields', 
    'isDialog', 'dialogName', 'group', 'fieldNode', 'isGroup', 'isTable', 'isMobile', 'tableName'],

  data () {
    return {
      dataModel: Object.keys(this.models).includes(this.widget.model) ? this.models[this.widget.model] : _.cloneDeep(this.widget.options.defaultValue),
      dataModels: this.models
    }
  },
  computed: {
    labelWidth () {
      return this.widget.options.hideLabel ? '0px' : (this.widget.options.isLabelWidth ? this.widget.options.labelWidth + 'px' : this.config.labelWidth + 'px')
    },
    ruleProp () {
      let currentProp = this.widget.model

      if (this.group) {
        currentProp = this.group + '.' + currentProp
      }

      return currentProp
    },
    currentOptions () {
      if (this.isTable || this.isSubform) {
        return {
          value: this.dataModel,
          fieldNode: this.fieldNode ? this.fieldNode + '.' + this.widget.model : this.widget.model,
          currentRef: this.$refs['generateElementItem']?.$refs[`fm-${this.widget.model}`],
          rowIndex: this.rowIndex,
          row: _.cloneDeep(this.models),
          field: this.widget.model,
          group: this.group
        }
      } else {
        return {
          value: this.dataModel,
          fieldNode: this.fieldNode ? this.fieldNode + '.' + this.widget.model : this.widget.model,
          currentRef: this.$refs['generateElementItem']?.$refs[`fm-${this.widget.model}`],
          field: this.widget.model,
          group: this.group
        }
      }
    },
    elementDisplay () {
      let curFullField = this.fieldNode ? this.fieldNode + '.' + this.widget.model : this.widget.model
      let curField = this.group ? this.group + '.' + this.widget.model : this.widget.model

      if (this.dynamicHideFields[curFullField] != undefined) {
        return !this.dynamicHideFields[curFullField]
      }

      if (this.dynamicHideFields[curField] != undefined) {
        return !this.dynamicHideFields[curField]
      }

      if (typeof this.widget.options.hidden === 'boolean') {
        return !this.widget.options.hidden
      } else {
        if (isExpression(this.widget.options.hidden)) {
          return  !executeExpression(extractExpression(this.widget.options.hidden), this.currentOptions, this.formContext)
        }
      }

      return true
    },
    groupNode () {
      return this.group ? this.group + '.' + this.widget.model : this.widget.model
    },
    elementNode () {
      return this.fieldNode ? this.fieldNode + '.' + this.widget.model : this.widget.model
    }
  },
  inject: {
    setSubformData: {
      default: () => {}
    },
    setDialogData: {
      default: () => {}
    },
    setGroupData: {
      default: () => {}
    },
    setTableData: {
      default: () => {}
    },
    getFormComponent: {
      default: () => { return null }
    },
    onChange: {
      default: () => {}
    },
    dynamicHideFields: {
      default: {}
    },
    dynamicValueData: {
      default: []
    },
    formContext: {
      default: {}
    },
    generateFormItemContext: {
      default: () => {}
    },
    deleteFormItemContext: {
      default: () => {}
    },
    sendRequest: {
      default: () => {}
    }
  },
  created () {
    this.refreshDynamicValue()
  },
  mounted () {
    this.generateFormItemContext(this.elementNode, this)
  },
  beforeUnmount () {
    this.deleteFormItemContext(this.elementNode)
  },
  methods: {
    refreshDynamicValue (args) {
      return new Promise((resolve, reject) => {
        if (this.widget.options.isDynamicValue 
          && this.widget.options.dynamicValueType == 'datasource'
          && this.widget.options.dynamicValueDataSource) {

          let key = this.group ? this.group + '.' + this.widget.model + '.' + this.widget.options.dynamicValueDataSource
            : this.widget.model + '.' + this.widget.options.dynamicValueDataSource

          let curArgs = {...this.widget.options.dynamicValueArgs}

          for (let key in curArgs) {
            if (isExpression(curArgs[key])) {
              curArgs[key] = executeExpression(extractExpression(curArgs[key]), this.currentOptions, this.formContext)
            }
          }

          if (args && typeof args === 'object') {
            curArgs = {...curArgs, ...args}
          }

          let _data = this.dynamicValueData.find(item => item.key === key && _.isEqual(item.args, curArgs))

          if (_data) {

            if (this.widget.options.dynamicValueStruct) {
              try {
                this.dataModel = (new Function('data', `return data.${this.widget.options.dynamicValueStruct}`))(_data.value)
                resolve(this.dataModel)
              } catch (e) {reject(e)}
            } else {
              this.dataModel = _data.value
              resolve(this.dataModel)
            }
          } else {
            this.sendRequest(this.widget.options.dynamicValueDataSource, curArgs).then(resData => {
              if (this.widget.options.dynamicValueStruct) {
                try{
                  this.dataModel = (new Function('data', `return data.${this.widget.options.dynamicValueStruct}`))(resData)
                  resolve(this.dataModel)
                } catch (e) {reject(e)}
              } else {
                this.dataModel = resData
                resolve(this.dataModel)
              }
            })
          }
        }
        if (this.widget.options.isDynamicValue
        && this.widget.options.dynamicValueType == 'fx'
        && this.widget.options.dynamicValueFx) {
          
          let value = executeExpression(this.widget.options.dynamicValueFx, this.currentOptions, this.formContext)

          if (value !== null) {
            this.$nextTick(() => {
              this.dataModel = value
            })
          }

          resolve(value)
        }
      })
    },
  },
  watch: {
    dataModel: {
      deep: true,
      handler (val, oldValue) {
        
        if (val == oldValue || JSON.stringify(val) == JSON.stringify(oldValue)) {
          return false
        }

        if (this.isTable) {
          this.setTableData(val, this.rowIndex, this.widget.model)
        } else if (this.isSubform) {
          this.setSubformData(val, this.rowIndex, this.widget.model)
        } else if (this.isDialog) {
          this.setDialogData(val, this.widget.model)
        } else if (this.isGroup) {
          this.setGroupData(val, this.widget.model)
        } else {
          this.onChange(val, this.widget.model)
        }
        
        // 执行 onChange 方法
        this.$nextTick(() => {
          this.eventFunction['onFormChange'] && this.eventFunction['onFormChange'](this.currentOptions)

          if (this.widget.events && this.widget.events.onChange) {
            let funcKey = this.widget.events.onChange

            this.eventFunction[funcKey](this.currentOptions)
          }
        })
      }
    },
    models: {
      deep: true,
      handler (val) {
        this.dataModels = val
        this.dataModel = Object.keys(val).includes(this.widget.model) ? val[this.widget.model] : _.cloneDeep(this.widget.options.defaultValue)
      }
    }
  }
}
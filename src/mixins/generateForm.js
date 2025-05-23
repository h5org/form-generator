import {loadJs, updateStyleSheets, splitStyleSheets, clearStyleSheets, consoleError, getBindModels } from '../util/index.js'
import { updateClassName } from '../util/reuse-methods.js'
import { EventBus } from '../util/event-bus.js'
import _ from 'lodash'
import axios from 'axios'
import { exportPDF } from '../util/export.js'
import { ruleToFunction } from '../util/rule-funcs.js'
import { isExpression, extractExpression, executeExpression } from '../util/expression'

export const generateFormMixin = {
  props: {
    data: {
      type: Object,
      default: () => ({
        "list": [],
        "config": {
          "labelWidth": 100,
          "labelPosition": "right",
          "size": "small",
          "customClass": "",
          "ui": "element",
          "layout": "horizontal",
        }
      })
    },
    remote: {
      type: Object,
      default: () => ({})
    },
    value: {
      type: Object,
      default: () => ({})
    },
    edit: {
      type: Boolean,
      default: true
    },
    printRead: {
      type: Boolean,
      default: false
    },
    remoteOption: {
      type: Object,
      default: () => ({})
    },
    preview: {
      type: Boolean,
      default: false
    },
    platform: {
      type: String,
      default: 'pc'
    }
  },
  emits: ['on-change'],
  data () {
    return {
      formData: {},
      models: {},
      rules: {},
      blanks: [],
      displayFields: {},
      dataBindFields: {},
      generateShow: false,
      resetModels: {},
      formKey: Math.random().toString(36).slice(-8),
      formStyleKey: Math.random().toString(36).slice(-8),
      formValue: this.value,
      formShow: false,
      formRef: Math.random().toString(36).slice(-8) + 'Form',
      containerKey: Math.random().toString(36).slice(-8),
      dataSourceValue: [],
      eventFunction: {},
      instanceObject: {},
      dataSourceInterface: [],
      dynamicHideFields: {},
      dynamicValueData: [],
      dynamicValueFxInterface: {},
      dynamicOptionFxInterface: {},
      formItemContexts: {},
    }
  },
  created () {
    this._initForm()
  },
  mounted () {
    this.$nextTick(() => {
      this.eventFunction['mounted'] && this.eventFunction['mounted']({})
    })
  },
  beforeUnmount () {
    let head = '.fm-' + this.formStyleKey + ' '
    clearStyleSheets(head)
  },
  provide() {
    return {
      'generateComponentInstance': this.generateComponentInstance,
      'deleteComponentInstance': this.deleteComponentInstance,
      'eventScriptConfig': this.getEventScriptConfig,
      'getFormComponent': this.getFormComponent,
      'onChange': this._changeFormValue,
      'onFormDisabled': this.disabled,
      'dynamicHideFields': this.dynamicHideFields,
      'onFormHide': this.hide,
      'onFormDisplay': this.display,
      'dynamicValueData': this.dynamicValueData,
      'dynamicOptionData': this.dynamicOptionData,
      'formContext': this,
      'generateFormItemContext': this.generateFormItemContext,
      'deleteFormItemContext': this.deleteFormItemContext,
      'sendRequest': this.sendRequest
    }
  },
  methods: {
    getFormComponent () {
      return this.$refs[this.formRef]
    },
    _changeFormValue (value, field) {
      this.models[field] = value

      this.$emit('on-change', field, value, this.models)
    },
    _initForm () {
      this.formShow = false
      this.formData = _.cloneDeep(this.data)

      this.models = {}
      this.rules = {}
      this.blanks = []
      this.displayFields = {}
      this.dataBindFields = {}
      this.resetModels = {}
      this.dataSourceValue = []
      this.eventFunction = []
      this.instanceObject = {}
      this.dataSourceInterface = []
      // 不能直接设置为[], 防止响应式丢失
      this.dynamicValueData.splice(0, this.dynamicValueData.length)
      Object.keys(this.dynamicHideFields).forEach(key => delete this.dynamicHideFields[key])
      this.dynamicValueFxInterface = {}
      this.dynamicOptionFxInterface = {}

      if (Object.keys(this.data).length) {
        this.generateModel(this.formData.list)
      } else {
        this.generateModel([])
      }

      this.models = {...this.models}

      return new Promise((resolve) => {
        this.$nextTick(() => {
          this.formShow = true

          if (this.formData.config && this.formData.config.styleSheets) {
            let head = '.fm-' + this.formStyleKey + ' '

            updateStyleSheets(splitStyleSheets(this.formData.config.styleSheets), head)
          }

          this.loadDataSource()

          this.loadDynamicValueFx()

          this.loadEvents()

          this.$nextTick(() => {
            this.eventFunction['refresh'] && this.eventFunction['refresh']({})

            this.resetModels = _.cloneDeep(this.models)

            resolve()
          })
        })
      })
    },
    getEventScriptConfig () {
      return this.data?.config?.eventScript ?? []
    },
    loadEvents () {
      if (this.formData.config && this.formData.config.eventScript) {
        for (let i = 0; i < this.formData.config.eventScript.length; i++) {
          let currentScript = this.formData.config.eventScript[i]

          if (currentScript.type === 'rule') {
            // 加载异步方法
            // console.log(ruleToFunction(currentScript.rules))
            const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
            this.eventFunction[currentScript.key] = new AsyncFunction(ruleToFunction(currentScript.rules)).bind(this)
          } else {
            this.eventFunction[currentScript.key] = Function(currentScript.func).bind(this)
          }
        }
      }
    },
    triggerEvent (eventName, args) {
      if (this.formData.config && this.formData.config.eventScript) {
        let eventScript = this.formData.config.eventScript.find(item => item.name == eventName)

        if (eventScript) {
          return this.eventFunction[eventScript.key](args)
        }
      }
    },
    refreshDynamicValueAll () {
      this.refreshDynamicValue()
    },
    refreshDynamicValue (fields, args) {
      if (fields === undefined) {

        let refreshItems = []

        Object.keys(this.dynamicValueFxInterface).forEach(field => {

          if (this.formItemContexts[field]) {
            if (Array.isArray(this.formItemContexts[field])) {
              this.formItemContexts[field].forEach(fItem => {
                refreshItems.push(fItem)
              })
            } else {
              refreshItems.push(this.formItemContexts[field])
            }
          } else {
            let groupFormItems = []
            Object.keys(this.formItemContexts).forEach(key => {
              if (this.formItemContexts[key].groupNode == field) {
                groupFormItems.push(this.formItemContexts[key])
              }
            })
            groupFormItems.forEach(fItem => {
              refreshItems.push(fItem)
            })
          }
        })

        for (let i = 0; i < this.dataSourceInterface.length; i++) {
          let curRequest = this.dataSourceInterface[i]

          if (curRequest.dynamicValueFields.length) {

            curRequest.dynamicValueFields.forEach(({field, struct}) => {
              if (this.formItemContexts[field]) {
                if (Array.isArray(this.formItemContexts[field])) {
                  this.formItemContexts[field].forEach(fItem => {
                    refreshItems.push(fItem)
                  })
                } else {
                  refreshItems.push(this.formItemContexts[field])
                }
              } else {
                let groupFormItems = []
                Object.keys(this.formItemContexts).forEach(key => {
                  if (this.formItemContexts[key].groupNode == field) {
                    groupFormItems.push(this.formItemContexts[key])
                  }
                })
                groupFormItems.forEach(fItem => {
                  refreshItems.push(fItem)
                })
              }
            })
          }
        }

        return new Promise((resolve, reject) => {
          Promise.all(refreshItems.map(item => item.refreshDynamicValue())).then(values => {
            resolve(values)
          }).catch(e => {
            reject(e)
          })
        })
      }

      if (typeof fields === 'string') {
        fields = [fields]
      }
      let refreshItems = []
      const curArgs = (args && typeof args === 'object') ? {...args} : {}
      fields.forEach(field => {

        if (this.formItemContexts[field]) {
          if (Array.isArray(this.formItemContexts[field])) {
            this.formItemContexts[field].forEach(fItem => {
              refreshItems.push(fItem)
            })
          } else {
            refreshItems.push(this.formItemContexts[field])
          }
        } else {
          let groupFormItems = []
          Object.keys(this.formItemContexts).forEach(key => {
            if (this.formItemContexts[key].groupNode == field) {
              groupFormItems.push(this.formItemContexts[key])
            }
          })
          groupFormItems.forEach(fItem => {
            refreshItems.push(fItem)
          })
        }
      })

      return new Promise((resolve, reject) => {
        Promise.all(refreshItems.map(item => item.refreshDynamicValue(curArgs))).then(values => {
          resolve(values)
        }).catch(e => {
          reject(e)
        })
      })
    },
    loadDataSource () {
      for (let i = 0; i < this.dataSourceInterface.length; i++) {
        let curRequest = this.dataSourceInterface[i]
        let requestObj = this.formData.config.dataSource.find(item => item.key == curRequest.key)
        if (requestObj && requestObj.auto)
        requestObj.name && this.sendRequest(requestObj.name, {...curRequest.args}).then(data => {
          let curArgs = {...curRequest.args}
          for (let key in curArgs) {
          if (isExpression(curArgs[key])) {
              curArgs[key] = executeExpression(extractExpression(curArgs[key]), {}, this)
            }
          }

          curRequest.fields.forEach(field => {
            let curKey = field + '.' + curRequest.key
            let sourceValue = this.dataSourceValue.find(item => item.key === curKey)

            if (sourceValue) {
              sourceValue.value = data
            } else {
              this.dataSourceValue.push({
                key: curKey, 
                args: curArgs,
                value: data
              })
            }
          })

          curRequest.dynamicValueFields.forEach(({field, struct}) => {
            let curKey = field + '.' + curRequest.key

            let sourceValue = this.dynamicValueData.find(item => item.key === curKey)

            if (sourceValue) {
              sourceValue.value = data
            } else {
              this.dynamicValueData.push({
                key: curKey, 
                args: curArgs,
                value: data
              })
            }
          })
        })
      }
      // 处理需要初始化请求但没有进行绑定的数据源
      if (this.formData.config?.dataSource?.length > 0) {
        for (let i = 0; i < this.formData.config.dataSource.length; i++) {
          let currentDataSource = this.formData.config.dataSource[i]

          if (currentDataSource.auto && this.dataSourceInterface.findIndex(item => item.key == currentDataSource.key) < 0) {
            this.sendRequest(currentDataSource.name, {})
          }
        }
      }
    },
    loadDynamicValueFx () {
      Object.keys(this.dynamicValueFxInterface).forEach(field => {

        if (this.formItemContexts[field]) {
          if (Array.isArray(this.formItemContexts[field])) {
            this.formItemContexts[field].forEach(fItem => {
              fItem.refreshDynamicValue()
            })
          } else {
            this.formItemContexts[field].refreshDynamicValue()
          }
        } else {
          let groupFormItems = []
          Object.keys(this.formItemContexts).forEach(key => {
            if (this.formItemContexts[key].groupNode == field) {
              groupFormItems.push(this.formItemContexts[key])
            }
          })
          groupFormItems.forEach(fItem => {
            fItem.refreshDynamicValue()
          })
        }
      })
    },
    refreshFieldOptionData (fields, args) {
      if (fields === undefined) return Promise.resolve([])
      if (typeof fields === 'string') {
        fields = [fields]
      }

      let refreshInstances = []
      const curArgs = (args && typeof args === 'object') ? {...args} : {}
      fields.forEach(field => {
        if (this.instanceObject[field]) {
          if (Array.isArray(this.instanceObject[field])) {
            this.instanceObject[field].forEach(fItem => {
              fItem?.$parent && refreshInstances.push(fItem?.$parent)
            })
          } else {
            this.instanceObject[field]?.$parent && refreshInstances.push(this.instanceObject[field]?.$parent)
          }
        } else {
          let groupFormItems = []
          Object.keys(this.instanceObject).forEach(key => {
            if (this.instanceObject[key]?.$parent?.groupNode == field) {
              groupFormItems.push(this.instanceObject[key])
            }
          })
          groupFormItems.forEach(fItem => {
            fItem?.$parent && refreshInstances.push(fItem?.$parent)
          })
        }
      })

      return new Promise((resolve, reject) => {
        Promise.all(refreshInstances.map(item => item.refreshOptionData(curArgs))).then(values => {
          resolve(values)
        }).catch(e => {
          reject(e)
        })
      })
    },
    refreshFieldDataSource (field, args) {
      let curRequest = this.dataSourceInterface.find(item => item.fields.includes(field))

      return new Promise((resolve, reject) => {
        if (curRequest) {
          let requestName = this.formData.config.dataSource.find(item => item.key == curRequest.key)?.name
          requestName && this.sendRequest(requestName, {...curRequest.args, ...args}).then(data => {
            let curKey = field + '.' + curRequest.key
            let sourceValue = this.dataSourceValue.find(item => item.key === curKey)

            if (sourceValue) {
              sourceValue.value = data
            } else {
              this.dataSourceValue.push({
                key: curKey, 
                value: data
              })
            }

            resolve(data)
          }).catch(() => {
            reject()
          })
        } else {
          resolve()
        }
      })
    },
    getFieldDataSource (field) {
      let curRequest = this.dataSourceInterface.find(item => item.fields.includes(field))

      if (curRequest) {
        let curKey = field + '.' + curRequest.key

        let sourceValue = this.dataSourceValue.find(item => item.key === curKey)

        if (sourceValue) {
          return sourceValue.value
        }
      }

      return null
    },
    sendRequest(name, args = {}) {
      return new Promise((resolve, reject) => {
        let currentDataSource = this.formData.config.dataSource.find(item => item.name === name)

        if (!currentDataSource) {
          currentDataSource = this.formData.config.dataSource.find(item => item.key === name)
        }

        if (currentDataSource) {
          for (let key in args) {
            if (isExpression(args[key])) {
              args[key] = executeExpression(extractExpression(args[key]), {}, this)
            }
          }

          let options = {
            method: currentDataSource.method,
            url: currentDataSource.url,
            headers: {},
            params: {},
            data: {}
          }

          let optionsHeaders = {}
          currentDataSource.headers && Object.keys(currentDataSource.headers).forEach(key => {
            if (isExpression(currentDataSource.headers[key])) {
              optionsHeaders[key] = executeExpression(extractExpression(currentDataSource.headers[key]),args, this)
            } else {
              optionsHeaders[key] = currentDataSource.headers[key]
            }
          })

          Object.keys(optionsHeaders).length && (options['headers'] = optionsHeaders)
          
          let optionsParams = {}
          currentDataSource.params && Object.keys(currentDataSource.params).forEach(key => {
            if (isExpression(currentDataSource.params[key])) {
              optionsParams[key] = executeExpression(extractExpression(currentDataSource.params[key]),args, this)
            } else {
              optionsParams[key] = currentDataSource.params[key]
            }
          })

          if (options.method === 'POST' || options.method === 'PUT') {
            options['data'] = optionsParams
          } else {
            options['params'] = optionsParams
          }

          //请求发送前处理函数
          if (currentDataSource.requestFunc) {
            const requestDynamicFunc = Function('config, args', currentDataSource.requestFunc).bind(this)

            options = requestDynamicFunc(options, args)
          }

          axios(options).then(res => {

            let data = res

            if (currentDataSource.responseFunc) {
              const dynamicFunc = Function('res, args', currentDataSource.responseFunc).bind(this)

              data = dynamicFunc(res.data, args)

              resolve(data)
            } else {
              resolve(res.data)
            }
          }).catch((error) => {
            //请求错误处理函数
            if (currentDataSource.errorFunc) {
              const errorDynamicFunc = Function('error', currentDataSource.errorFunc).bind(this)

              errorDynamicFunc(error)
            }

            reject(error)
          })
        }
      })
    },
    generateSubformModel (subName, genList, dataBindFields) {
      for (let i = 0; i < genList.length; i++) {

        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateSubformModel(subName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateSubformModel(subName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'collapse') {
          genList[i].tabs.forEach(item => {
            this.generateSubformModel(subName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach(row => {
            row.columns.forEach(column => {
              this.generateSubformModel(subName, column.list, dataBindFields)
            })
          })
        } else if (genList[i].type === 'inline') {
          this.generateSubformModel(subName, genList[i].list, dataBindFields)
        } else if (genList[i].type === 'card') {
          this.generateSubformModel(subName, genList[i].list, dataBindFields)
        } else {

          if (genList[i].type === 'blank') {
            this.blanks.push({
              name: genList[i].model
            })
          }

          if (genList[i].options.dataBind) {
            if (['subform', 'group', 'table'].includes(genList[i].type)) {
              dataBindFields[genList[i].model] = {}
            } else {
              dataBindFields[genList[i].model] = true
            }
          }

          genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
            if (item.type === 'blank') {
              this.blanks.push({
                name: item.model
              })
            }

            if (item.options.dataBind && genList[i].options.dataBind) {
              dataBindFields[genList[i].model][item.model] = true
            }

            // 处理 rules
            this._generateRules(`${subName}.${genList[i].model}.${item.model}`, item.rules)

            // 处理子表单中的DataSource
            this._generateDataSource(item, `${subName}.${genList[i].model}.${item.model}`)
          })

          if (genList[i].type == 'subform') {
            this.generateSubformModel(`${subName}.${genList[i].model}`, genList[i].list, dataBindFields[genList[i].model] || {})
          }

          if (genList[i].type == 'group') {
            this.generateGroupModel(`${subName}.${genList[i].model}`, genList[i].list, dataBindFields[genList[i].model] || {})
          }

          this._generateRules(`${subName}.${genList[i].model}`, genList[i].rules)

          // 处理子表单中的DataSource
          this._generateDataSource(genList[i], `${subName}.${genList[i].model}`)
        }
      }
    },
    generateDialogModel (dialogName, genList, dataBindFields) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateDialogModel(dialogName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateDialogModel(dialogName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'collapse') {
          genList[i].tabs.forEach(item => {
            this.generateDialogModel(dialogName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach(row => {
            row.columns.forEach(column => {
              this.generateDialogModel(dialogName, column.list, dataBindFields)
            })
          })
        } else if (genList[i].type === 'inline') {
          this.generateDialogModel(dialogName, genList[i].list, dataBindFields)
        } else if (genList[i].type === 'card') {
          this.generateDialogModel(dialogName, genList[i].list, dataBindFields)
        } else {

          if (genList[i].type === 'blank') {
            this.blanks.push({
              name: genList[i].model
            })
          }

          if (genList[i].options.dataBind) {
            if (['subform', 'group', 'table'].includes(genList[i].type)) {
              dataBindFields[genList[i].model] = {}
            } else {
              dataBindFields[genList[i].model] = true
            }
          }

          if (genList[i].type == 'subform') {
            this.generateSubformModel(`${dialogName}.${genList[i].model}`, genList[i].list, dataBindFields[genList[i].model] || {})
          }

          if (genList[i].type == 'group') {
            this.generateGroupModel(`${dialogName}.${genList[i].model}`, genList[i].list, dataBindFields[genList[i].model] || {})
          }

          genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
            if (item.type === 'blank') {
              this.blanks.push({
                name: item.model
              })
            }

            if (item.options.dataBind && genList[i].options.dataBind) {
              dataBindFields[genList[i].model][item.model] = true
            }

            // 处理 rules
            this._generateRules(`${dialogName}.${genList[i].model}.${item.model}`, item.rules)

            // 处理子表单中的DataSource
            this._generateDataSource(item, `${dialogName}.${genList[i].model}.${item.model}`)
          })

          this._generateRules(`${dialogName}.${genList[i].model}`, genList[i].rules)

          // 处理弹框中的DataSource
          this._generateDataSource(genList[i], `${dialogName}.${genList[i].model}`)
        }
      }
    },
    generateGroupModel (groupName, genList, dataBindFields) {
      for (let i = 0; i < genList.length; i++) {
        
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateGroupModel(groupName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateGroupModel(groupName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'collapse') {
          genList[i].tabs.forEach(item => {
            this.generateGroupModel(groupName, item.list, dataBindFields)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach(row => {
            row.columns.forEach(column => {
              this.generateGroupModel(groupName, column.list, dataBindFields)
            })
          })
        } else if (genList[i].type === 'inline') {
          this.generateGroupModel(groupName, genList[i].list, dataBindFields)
        } else if (genList[i].type === 'card') {
          this.generateGroupModel(groupName, genList[i].list, dataBindFields)
        } else {

          if (genList[i].type === 'blank') {
            this.blanks.push({
              name: genList[i].model
            })
          }

          if (genList[i].options.dataBind) {
            if (['subform', 'group', 'table'].includes(genList[i].type)) {
              dataBindFields[genList[i].model] = {}
            } else {
              dataBindFields[genList[i].model] = true
            }
          }

          if (genList[i].type == 'subform') {
            this.generateSubformModel(`${groupName}.${genList[i].model}`, genList[i].list, dataBindFields[genList[i].model] || {})
          }

          if (genList[i].type == 'group') {
            this.generateGroupModel(`${groupName}.${genList[i].model}`, genList[i].list, dataBindFields[genList[i].model] || {})
          }

          genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
            if (item.type === 'blank') {
              this.blanks.push({
                name: item.model
              })
            }

            if (item.options.dataBind && genList[i].options.dataBind) {
              dataBindFields[genList[i].model][item.model] = true
            }

            // 处理 rules
            this._generateRules(`${groupName}.${genList[i].model}.${item.model}`, item.rules)

            // 处理子表单中的DataSource
            this._generateDataSource(item, `${groupName}.${genList[i].model}.${item.model}`)
          })

          this._generateRules(`${groupName}.${genList[i].model}`, genList[i].rules)

          // 处理弹框中的DataSource
          this._generateDataSource(genList[i], `${groupName}.${genList[i].model}`)
        }
      }
    },
    generateModel (genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          this.displayFields[genList[i].model] = !genList[i].options.hidden

          genList[i].columns.forEach(item => {
            this.generateModel(item.list)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateModel(item.list)
          })

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else if (genList[i].type === 'collapse') {
          genList[i].tabs.forEach(item => {
            this.generateModel(item.list)
          })

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach(row => {
            row.columns.forEach(column => {
              this.generateModel(column.list)
            })
          })

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else if (genList[i].type === 'inline') {
          this.generateModel(genList[i].list)

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else if (genList[i].type === 'card') {
          this.generateModel(genList[i].list)

          this.displayFields[genList[i].model] = !genList[i].options.hidden
        } else {
          if (Object.keys(this.formValue).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.formValue[genList[i].model]
            
            this.displayFields[genList[i].model] = !genList[i].options.hidden

            if (genList[i].type === 'blank') {
              this.blanks.push({
                name: genList[i].model
              })
            }

          } else {
            if (genList[i].type === 'blank') {
              // bound the default value
              this.models[genList[i].model] = genList[i].options.defaultType === 'String' ? '' : (genList[i].options.defaultType === 'Object' ? {} : [])
              this.displayFields[genList[i].model] = !genList[i].options.hidden

              this.blanks.push({
                name: genList[i].model
              })
            } else {
              this.models[genList[i].model] = _.cloneDeep(genList[i].options.defaultValue)
              this.displayFields[genList[i].model] = !genList[i].options.hidden
            }
          }

          if ((Object.keys(genList[i].options).indexOf('dataBind') < 0 || genList[i].options.dataBind) && genList[i].key && genList[i].model) {
            
            if (['subform', 'table', 'dialog', 'group'].includes(genList[i].type)) {
              this.dataBindFields[genList[i].model] = {}
            } else {
              this.dataBindFields[genList[i].model] = true
            }
          }

          if (genList[i].type == 'subform') {
            this.generateSubformModel(genList[i].model, genList[i].list, this.dataBindFields[genList[i].model] || {})
          }

          if (genList[i].type == 'dialog') {
            this.generateDialogModel(genList[i].model, genList[i].list, this.dataBindFields[genList[i].model] || {})
          }

          if (genList[i].type == 'group') {
            this.generateGroupModel(genList[i].model, genList[i].list, this.dataBindFields[genList[i].model] || {})
          }

          genList[i].tableColumns && genList[i].tableColumns.length && genList[i].tableColumns.forEach(item => {
            if (item.type === 'blank') {
              this.blanks.push({
                name: item.model
              })
            }

            if (item.options.dataBind && genList[i].options.dataBind) {
              this.dataBindFields[genList[i].model][item.model] = true
            }

            // 处理 rules
            this._generateRules(`${genList[i].model}.${item.model}`, item.rules)

            // 处理子表单中的DataSource
            this._generateDataSource(item, `${genList[i].model}.${item.model}`)
          })

          this._generateRules(genList[i].model, genList[i].rules)

          // 处理DataSource
          this._generateDataSource(genList[i], genList[i].model)
        }
      }
    },
    _generateDataSource (element, model) {
      if (element.options.remote && element.options.remoteType === 'datasource' && element.options.remoteDataSource) {
        this._setDataSourceInterface(model, element.options.remoteArgs, element.options.remoteDataSource)
      }
      if (element.options.remote && element.options.remoteType === 'fx' && element.options.remoteFx) {
        this.dynamicOptionFxInterface[model] = element.options.remoteFx
      }
      if ((element.type == 'imgupload' || element.type == 'fileupload')
        && element.options.tokenType == 'datasource' && element.options.tokenDataSource
      ) {
        this._setDataSourceInterface(model, element.options.remoteArgs, element.options.tokenDataSource)
      }
      if (element.options.isDynamicValue && element.options.dynamicValueType === 'datasource' && element.options.dynamicValueDataSource) {
        this._setDynamicValueInterface(model, element.options.dynamicValueArgs, element.options.dynamicValueDataSource, element.options.dynamicValueStruct)
      }
      if (element.options.isDynamicValue && element.options.dynamicValueType === 'fx') {
        this.dynamicValueFxInterface[model] = element.options.dynamicValueFx
      }
    },
    _generateRules (model, rules) {
      if (this.rules[model]) {
        this.rules[model] = [
          ...this.rules[model],
          ...(rules ? rules.map(im => {
            if (im.pattern) {
              return {...im, pattern: eval(im.pattern)}
            } else if (im.func) {

              const validatorFunc = Function('rule', 'value', 'callback', im.func).bind(this)

              return {...im, validator: validatorFunc}
            } else {
              return {...im}
            }
          }) : [])
        ]
      } else {
        
        this.rules[model] = [
          ...(rules ? rules.map(im => {
            if (im.pattern) {
              return {...im, pattern: eval(im.pattern)}
            } else if (im.func) {
              const validatorFunc = Function('rule', 'value', 'callback', im.func).bind(this)

              return {...im, validator: validatorFunc}
            } else {
              return {...im}
            }
          }) : [])
        ]
      }
    },
    _setDataSourceInterface (field, args, key) {
      let argsObj
      if (typeof args == 'string') {
        argsObj =  (new Function('"use strict";return (' + (args || '{}') + ')').bind(this))()
      } else {
        argsObj =  {...args}
      }

      for (let key in argsObj) {
        if (isExpression(argsObj[key])) {
          argsObj[key] = executeExpression(extractExpression(argsObj[key]), {}, this)
        }
      }

      let findCurInterfaceIndex = this.dataSourceInterface.findIndex(item => item.key == key && _.isEqual(item.args, argsObj))

      if (findCurInterfaceIndex >= 0) {
        this.dataSourceInterface[findCurInterfaceIndex].fields.push(field)
      } else {
        this.dataSourceInterface.push({
          key: key,
          args: argsObj,
          fields: [field],
          dynamicValueFields: []
        })
      }
    },
    _setDynamicValueInterface (field, args, key, struct) {
      let findCurInterfaceIndex = this.dataSourceInterface.findIndex(item => item.key == key && _.isEqual(item.args, args))

      if (findCurInterfaceIndex >= 0) {
        this.dataSourceInterface[findCurInterfaceIndex].dynamicValueFields.push({field, struct})
      } else {
        this.dataSourceInterface.push({
          key,
          args,
          dynamicValueFields: [{field, struct}],
          fields: []
        })
      }
    },
    _setSubDisabled (genList, fields, disabled) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this._setSubDisabled(item.list, fields, disabled)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this._setSubDisabled(item.list, fields, disabled)
          })
        } else if (genList[i].type === 'collapse') {
          genList[i].tabs.forEach(item => {
            this._setSubDisabled(item.list, fields, disabled)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach(row => {
            row.columns.forEach(column => {
              this._setSubDisabled(column.list, fields, disabled)
            })
          })
        } else if (genList[i].type === 'inline') {
          this._setSubDisabled(genList[i].list, fields, disabled)
        } else if (genList[i].type === 'card') {
          this._setSubDisabled(genList[i].list, fields, disabled)
        } else {
          if (fields.length === 1) {
            if (genList[i].model === fields[0]) {
              genList[i].options.disabled = disabled
            }
          } else {
            if (genList[i].model !== fields[0]) continue

            let newFields = [...fields]
            newFields.splice(0, 1)
            if (genList[i].type === 'table') {
              this._setSubDisabled(genList[i].tableColumns, newFields, disabled)
            }
            if (genList[i].type === 'subform') {
              this._setSubDisabled(genList[i].list, newFields, disabled)
            }
            if (genList[i].type === 'group') {
              this._setSubDisabled(genList[i].list, newFields, disabled)
            }
            if (genList[i].type === 'dialog') {
              this._setSubDisabled(genList[i].list, newFields, disabled)
            }
          }
        }
      }
    },
    _setSubOptions (genList, fields, opts) {
      for (let i = 0; i < genList.length; i++) {
        if (fields.length === 1) {
          if (genList[i].model === fields[0]) {
            Object.keys(opts).forEach(key => {
              genList[i].options[key] = opts[key]
            })
          } else {
            if (genList[i].type === 'grid') {
              genList[i].columns.forEach(item => {
                this._setSubOptions(item.list, fields, opts)
              })
            } else if (genList[i].type === 'tabs') {
              genList[i].tabs.forEach(item => {
                this._setSubOptions(item.list, fields, opts)
              })
            } else if (genList[i].type === 'collapse') {
              genList[i].tabs.forEach(item => {
                this._setSubOptions(item.list, fields, opts)
              })
            } else if (genList[i].type === 'report') {
              genList[i].rows.forEach(row => {
                row.columns.forEach(column => {
                  this._setSubOptions(column.list, fields, opts)
                })
              })
            } else if (genList[i].type === 'inline') {
              this._setSubOptions(genList[i].list, fields, opts)
            } else if (genList[i].type === 'card') {
              this._setSubOptions(genList[i].list, fields, opts)
            }
          }
        } else {

          if (genList[i].type === 'grid') {
            genList[i].columns.forEach(item => {
              this._setSubOptions(item.list, fields, opts)
            })
          } else if (genList[i].type === 'tabs') {
            genList[i].tabs.forEach(item => {
              this._setSubOptions(item.list, fields, opts)
            })
          } else if (genList[i].type === 'collapse') {
            genList[i].tabs.forEach(item => {
              this._setSubOptions(item.list, fields, opts)
            })
          } else if (genList[i].type === 'report') {
            genList[i].rows.forEach(row => {
              row.columns.forEach(column => {
                this._setSubOptions(column.list, fields, opts)
              })
            })
          } else if (genList[i].type === 'inline') {
            this._setSubOptions(genList[i].list, fields, opts)
          } else if (genList[i].type === 'card') {
            this._setSubOptions(genList[i].list, fields, opts)
          } else {
            if (genList[i].model !== fields[0]) continue

            let newFields = [...fields]
            newFields.splice(0, 1)
            
            if (genList[i].type === 'table') {
              this._setSubOptions(genList[i].tableColumns, newFields, opts)
            }
            if (genList[i].type === 'subform') {
              this._setSubOptions(genList[i].list, newFields, opts)
            }
            if (genList[i].type === 'group') {
              this._setSubOptions(genList[i].list, newFields, opts)
            }
            if (genList[i].type === 'dialog') {
              this._setSubOptions(genList[i].list, newFields, opts)
            }
          }
        }
      }
    },
    _getSubOptions(genList, fields) {
      for (let i = 0; i < genList.length; i++) {
        if (fields.length === 1) {
          if (genList[i].model === fields[0]) {
            return genList[i].options
          } else {
            if (genList[i].type === 'grid') {
              for (const item of genList[i].columns) {
                const options = this._getSubOptions(item.list, fields)
                if (options) return options
              }
            } else if (genList[i].type === 'tabs') {
              for (const item of genList[i].tabs) {
                const options = this._getSubOptions(item.list, fields)
                if (options) return options
              }
            } else if (genList[i].type === 'collapse') {
              for (const item of genList[i].tabs) {
                const options = this._getSubOptions(item.list, fields)
                if (options) return options
              }
            } else if (genList[i].type === 'report') {
              for (const row of genList[i].rows) {
                for (const column of row.columns) {
                  const options = this._getSubOptions(column.list, fields)
                  if (options) return options
                }
              }
            } else if (genList[i].type === 'inline') {
              const options = this._getSubOptions(genList[i].list, fields)
              if (options) return options
            } else if (genList[i].type === 'card') {
              const options = this._getSubOptions(genList[i].list, fields)
              if (options) return options
            }
          }
        } else {

          if (genList[i].type === 'grid') {
            for (const item of genList[i].columns) {
              const options = this._getSubOptions(item.list, fields)
              if (options) return options
            }
          } else if (genList[i].type === 'tabs') {
            for (const item of genList[i].tabs) {
              const options = this._getSubOptions(item.list, fields)
              if (options) return options
            }
          } else if (genList[i].type === 'collapse') {
            for (const item of genList[i].tabs) {
              const options = this._getSubOptions(item.list, fields)
              if (options) return options
            }
          } else if (genList[i].type === 'report') {
            for (const row of genList[i].rows) {
              for (const column of row.columns) {
                const options = this._getSubOptions(column.list, fields)
                if (options) return options
              }
            }
          } else if (genList[i].type === 'inline') {
            const options = this._getSubOptions(genList[i].list, fields)
            if (options) return options
          } else if (genList[i].type === 'card') {
            const options = this._getSubOptions(genList[i].list, fields)
            if (options) return options
          } else {
            if (genList[i].model !== fields[0]) continue

            let newFields = [...fields]
            newFields.splice(0, 1)
            
            if (genList[i].type === 'table') {
              const options = this._getSubOptions(genList[i].tableColumns, newFields)
              if(options) return options
            }
            if (genList[i].type === 'subform') {
              const options = this._getSubOptions(genList[i].list, newFields)
              if (options) return options
            }
            if (genList[i].type === 'group') {
              const options = this._getSubOptions(genList[i].list, newFields)
              if (options) return options
            }
            if (genList[i].type === 'dialog') {
              const options = this._getSubOptions(genList[i].list, newFields)
              if (options) return options
            }
          }
        }
      }
      return null
    },
    validate (fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      return new Promise((resolve, reject) => {
        if (fields && fields.length) {
          this.$refs[this.formRef].validateField(fields, (valid, error) => {
            if (valid) {
              resolve()
            } else {
              reject(error)
            }
          })
        } else {
          this.$refs[this.formRef].validate((valid, error) => {
            if (valid) {
              resolve()
            } else {
              reject(error)
            }
          })
        }
      })
    },
    getData (isValidate = true) {
      return new Promise((resolve, reject) => {
        if (isValidate) {
          this.$refs[this.formRef].validate(valid => {
            if (valid) {
              
              resolve(getBindModels(this.models, this.dataBindFields))
            } else {
              reject(new Error(this.$t('fm.message.validError')).message)
            }
          })
        } else {
          resolve(getBindModels(this.models, this.dataBindFields))
        }
      })
    },
    reset () {
      return new Promise((resolve) => {
        this.setData(_.cloneDeep(this.resetModels)).then(() => {
          setTimeout(() => {
            this.$refs[this.formRef].clearValidate()
            resolve()
          })
        })
      })
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
      this.$emit(`on-${field}-change`, value)
    },
    display (fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(field => {
        this.dynamicHideFields[field] = false
      })
    },
    hide (fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }

      fields.forEach(field => {
        this.dynamicHideFields[field] = true
      })
    },
    disabled (fields, disabled) {
      if (typeof fields === 'string') {
        fields = [fields]
      }

      fields.forEach(item => {
        let currentComponent = this.instanceObject[item]

        if (currentComponent) {
          if (Array.isArray(currentComponent)) {
            currentComponent.forEach(cc => {
              cc.$parent?.disabledElement(disabled)
            })
          } else {
            currentComponent.$parent?.disabledElement(disabled)
          }
        } else {
          this._setSubDisabled(this.formData.list, item.split('.'), disabled)
        }
      })
    },
    addClassName (fields, className) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        updateClassName(this.formData.list, item.split('.'), className, 'add')
      })
    },
    removeClassName (fields, className) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        updateClassName(this.formData.list, item.split('.'), className, 'remove')
      })
    },
    async refresh () {
      await this._initForm()
    },
    setData (value) {
      const _setNestedValue = (currentObj, keys, value) => {
        const key = keys.shift()

        if (keys.length === 0) {
          currentObj[key] = value
        } else {
          if (key in currentObj) {
            if (Array.isArray(currentObj[key])) {
              if (Number.isNaN(Number(keys[0]))) {
                currentObj[key].forEach(cur => {
                  _setNestedValue(cur, [...keys], value)
                })
              } else {
                const indexKey = keys.shift()
                currentObj[key].length > Number(indexKey) && _setNestedValue(currentObj[key][Number(indexKey)], [...keys], value)
              }
            } else {
              _setNestedValue(currentObj[key], [...keys], value)
            }
          }
        }
      }

      return new Promise((resolve) => {
        this.$nextTick(() => {
          Object.keys(value).forEach(item => {
            _setNestedValue(this.models, item.split('.'), value[item])
          })
          resolve()
        })
      })
    },
    getComponent (name) {
      if (name === undefined) {
        return this.instanceObject
      }
      if (this.instanceObject[name]) {
        return this.instanceObject[name]
      } else {
        consoleError('No component instance found with ' + name)
        return null
      }
    },
    getValues () {
      return _.cloneDeep(this.models)
    },
    getValue (fieldName) {
      const resModels = _.cloneDeep(this.models)

      let fieldArray = fieldName.split('.')

      const _getFieldRes = (res, array) => {
        if (array.length === 1) {
          return res[array[0]]
        } else {
          let newRes = res[array[0]]

          let newFields = [...array]
          newFields.splice(0, 1)

          return _getFieldRes(newRes, newFields)
        }
      }

      return _getFieldRes(resModels, fieldArray)
    },
    setRules (field, rules) {

      this.rules[field] = [...rules]

      this.$nextTick(() => {
        if (field?.split('.').length > 1) {
          const tableRowLength = this.getValue(field.split('.')[0])?.length
          if (tableRowLength) {
            for (let i= 0; i < tableRowLength; i++) {
              this.$refs[this.formRef].validateField([`${field.split('.')[0]}.${i}.${field.split('.')[1]}`])
            }
          }
        } else {
          this.$refs[this.formRef].validateField([field])
        }
      })
    },
    setOptions (fields, options) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(item => {
        this._setSubOptions(this.formData.list, item.split('.'), options)
      })
    },
    getOptions (field, key) {
      const result = this._getSubOptions(this.formData.list, field.split('.'))

      if (key) {
        return result[key]
      } else {
        return result
      }
    },
    generateComponentInstance (key, instance) {
      if (this.instanceObject[key]) {
        if (Array.isArray(this.instanceObject[key])) {
          this.instanceObject[key] = [...this.instanceObject[key], instance]
        } else {
          this.instanceObject[key] = [this.instanceObject[key], instance]
        }
      } else {
        this.instanceObject[key] = instance
      }
    },
    deleteComponentInstance (key) {
      if (this.instanceObject[key]) {
        delete this.instanceObject[key]
      }
    },
    generateFormItemContext (key, instance) {
      if (this.formItemContexts[key]) {
        if (Array.isArray(this.formItemContexts[key])) {
          this.formItemContexts[key] = [...this.formItemContexts[key], instance]
        } else {
          this.formItemContexts[key] = [this.formItemContexts[key], instance]
        }
      } else {
        this.formItemContexts[key] = instance
      }
    },
    deleteFormItemContext (key) {
      if (this.formItemContexts[key]) {
        delete this.formItemContexts[key]
      }
    },
    setOptionData (fields, data) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      fields.forEach(field => {
        const curRef = this.instanceObject[field]
        curRef?.$parent?.loadOptions(data)
      })
    },
    getOptionData (field) {
      const curRef = this.instanceObject[field]
      return curRef?.$parent?.getOptions()
    },
    exportPDF () {
      if (this.printRead) {
        return exportPDF(document.querySelector('.fm-'+this.formStyleKey))
      } else {
        return Promise.reject()
      }
    },
    print () {
      if (this.printRead) {
        return new Promise((resolve, reject) => {
          exportPDF(document.querySelector('.fm-'+this.formStyleKey)).then(data => {
            const pdfUrl = URL.createObjectURL(data)

            const iframeclass = 'fmiframe-print-container'

            Array.from(document.getElementsByClassName(iframeclass)).forEach(item => {
              document.body.removeChild(item)
            })

            let iframe = document.createElement('iframe')

            iframe.style.display = 'none'
            iframe.src = pdfUrl
            iframe.className = iframeclass

            iframe.onload = function() {
              setTimeout(() => {

                iframe.contentWindow.print()

                resolve(data)
              }, 100)
            }

            document.body.appendChild(iframe)
          })
        })
      } else {
        return Promise.reject('Set the print-read attribute to true for printing.')
      }
    },
    openDialog (dialogField) {
      const dialogComponent = this.getComponent(dialogField)

      if (dialogComponent) {
        dialogComponent.open()
      }
    },
    closeDialog (dialogField) {
      const dialogComponent = this.getComponent(dialogField)

      if (dialogComponent) {
        dialogComponent.close()
      } 
    },
    getDynamicValue (key) {
      return this.dynamicValueData.find(item => item.key == key)
    }
  }
}
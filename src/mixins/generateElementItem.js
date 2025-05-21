import _ from 'lodash'
import {executeExpression, isExpression, extractExpression} from '../util/expression'
import { EventBus } from '../util/event-bus'

export const generateElementItemMixin = {
  props: ['config','widget', 'modelValue', 'models', 'remote', 'isTable', 'blanks', 'disabled', 'edit', 
    'remoteOption', 'rules', 'platform', 'preview', 'dataSourceValue', 'eventFunction', 
    'rowIndex', 'tableName', 'printRead', 'isMobile', 'isSubform', 'subName', 
    'isDialog', 'dialogName', 'group', 'fieldNode', 'containerKey', 'isGroup'],
  emits: ['update:modelValue', 'on-table-change'],
  data () {
    return {
      dataModel: this.modelValue,
      dataModels: this.models,
      key: new Date().getTime(),
      modelName: this.widget.model,
      remoteOptions: [],
      dynamicEvents: this.handleOnDynamicEvent(),
      generateDisabled: undefined,
      remoteToken: ''
    }
  },
  computed: {
    elementDisabled () {
      let currentDisabled = this.widget.options.disabled

      if (isExpression(this.widget.options.disabled)) {
        currentDisabled = executeExpression(extractExpression(this.widget.options.disabled), this.currentOptions, this.formContext)
      }

      if (typeof this.generateDisabled === 'boolean') {
        return !this.edit || this.generateDisabled
      } else {
        return !this.edit || Boolean(currentDisabled)
      }
    },

    currentOptions () {
      if (this.isTable || this.isSubform) {
        return {
          value: this.dataModel,
          fieldNode: this.fieldNode,
          currentRef: this.$refs['fm-'+this.widget.model],
          rowIndex: this.rowIndex,
          row: _.cloneDeep(this.models),
          field: this.widget.model,
          group: this.group
        }
      } else {
        return {
          value: this.dataModel,
          fieldNode: this.fieldNode,
          currentRef: this.$refs['fm-'+this.widget.model],
          field: this.widget.model,
          group: this.group
        }
      }
    },

    extendProps () {
      let obj = {}

      this.widget.options.extendProps && Object.keys(this.widget.options.extendProps).forEach(key => {
        let value = this.widget.options.extendProps[key]

        if (!isExpression(value)) {
          obj[key] = value
        } else {
          obj[key] = executeExpression(extractExpression(value), this.currentOptions, this.formContext)
        }
      })

      return obj
    },

    groupNode () {
      return this.group ? this.group + '.' + this.widget.model : this.widget.model
    }
  },
  inject: ['generateComponentInstance', 'deleteComponentInstance', 'eventScriptConfig', 'dynamicValueData', 'formContext', 'sendRequest'],
  created () {

    if (!this.widget.options.remote) {
      if (this.widget.type == 'steps') {
        this.loadOptions(this.widget.options.steps)
      } else if (this.widget.type == 'transfer') {
        this.loadOptions(this.widget.options.data)
      } else {
        this.loadOptions(this.widget.options.options)
      }
    }

    if (this.widget.options.remote 
      && (Object.keys(this.widget.options).indexOf('remoteType') >= 0 ? this.widget.options.remoteType == 'func' : true)
      && this.remote[this.widget.options.remoteFunc]) {

      this.remote[this.widget.options.remoteFunc]((data) => {
        this.loadOptions(data)
      })
    }

    if (this.widget.options.remote 
      && this.widget.options.remoteType == 'option' 
      && this.remoteOption[this.widget.options.remoteOption]) {
      
      this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
    }

    if (this.widget.options.remote 
      && this.widget.options.remoteType == 'datasource' 
      && this.dataSourceValue) {

      let options = this.getDataSourceOptions()
      
      options && options.value && this.loadOptions(options.value)
    }

    if (this.widget.options.remote && this.widget.options.remoteType == 'fx' ) {
      let options = executeExpression(this.widget.options.remoteFx, {}, this.formContext)

      options && this.loadOptions(options)
    }

    if ((this.widget.type === 'imgupload' || this.widget.type === 'fileupload') && this.widget.options.isQiniu) {
      
      this.loadUploadConfig()
    }

    if (this.widget.type == 'component') {

      const _pthis = this

      this.$options.components[`component-${this.widget.key}-${this.key}`] = {
        template: `${this.widget.options.template}`,
        props: ['modelValue'],
        emits: ['update:modelValue'],
        data: () => ({
          dataModel: this.modelValue,
          formState: this.formContext
        }),
        watch: {
          dataModel (val) {

            if (this.ui == 'antd') {
              EventBus.$emit('on-field-change', this.$attrs.id, val)
            } else {
              this.$emit('update:modelValue', val)
            }
          },
          modelValue (val) {
            this.dataModel = val
          }
        },
        methods: {
          triggerEvent (eventName, arg) {
            if (_pthis.eventScriptConfig()) {
              let currentEventScript = _pthis.eventScriptConfig().find(item => item.name == eventName)

              if (currentEventScript) {
                _pthis.eventFunction[currentEventScript.key]({
                  ..._pthis.currentOptions,
                  $eventArgs: arg})
              }
            }
          }
        }
      }
    }
  },
  mounted () {
    this.generateComponentInstance && this.generateComponentInstance(
      this.fieldNode, 
      this.$refs['fm-'+this.widget.model]
    )

    this.handleOnMounted()
  },
  beforeUnmount () {
    this.deleteComponentInstance && this.deleteComponentInstance(this.fieldNode)

    if (this.$options.components[`component-${this.widget.key}-${this.key}`]) {
      this.$options.components[`component-${this.widget.key}-${this.key}`] = null
    }
  },
  methods: {
    handleOnDynamicEvent () {
      let currentEvents = {}

      for (let i in this.widget.events) {

        let funcKey = this.widget.events[i]

        funcKey && (
          currentEvents[i] = this.callbackDynamicFunc(funcKey)
        )
      }

      return currentEvents
    },
    callbackDynamicFunc (funcKey) {
      let callback = (...arg) => {
        this.eventFunction[funcKey]({
          ...this.currentOptions,
          $eventArgs: arg})
      }
      return callback
    },
    refreshOptionData (args) {
      return new Promise((resolve, reject) => {
        if (this.widget.options.remote && this.widget.options.remoteType === 'fx' && this.widget.options.remoteFx) {
          let value = executeExpression(this.widget.options.remoteFx, this.currentOptions, this.formContext)

          if (value !== null) {
            this.loadOptions(value)
          }

          resolve(value)
        }

        if (this.widget.options.remote && this.widget.options.remoteType === 'datasource' && this.widget.options.remoteDataSource) {
          let curArgs = typeof this.widget.options.remoteArgs === 'string' ? {} : {...this.widget.options.remoteArgs}

          for (let key in curArgs) {
            if (isExpression(curArgs[key])) {
              curArgs[key] = executeExpression(extractExpression(curArgs[key]), this.currentOptions, this.formContext)
            }
          }

          if (args && typeof args === 'object') {
            curArgs = {...curArgs, ...args}
          }

          let key = this.group ? this.group + '.' + this.widget.model + '.' + this.widget.options.remoteDataSource
            : this.widget.model + '.' + this.widget.options.remoteDataSource

          let sourceValue = this.dataSourceValue.find(item => item.key === key && _.isEqual(item.args, curArgs))

          if (sourceValue) {
            this.loadOptions(sourceValue.value)

            resolve(sourceValue.value)
          } else {
            this.sendRequest(this.widget.options.remoteDataSource, curArgs).then(resData => {
              this.loadOptions(resData)

              resolve(resData)
            }).catch(e => {
              reject(e)
            })
          }
        }
      })
    },
    loadOptions (data) {
      if (!Array.isArray(data)) return

      if (!this.widget.options.remote) {
        this.remoteOptions = data
        return
      }

      this.remoteOptions = data.map(item => {
        if (this.widget.options.props.children 
              && this.widget.options.props.children.length 
              && Object.keys(item).includes(this.widget.options.props.children)) {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
            children: this.processRemoteProps(item[this.widget.options.props.children], this.widget.options.props)
          }
        } else {
          if (this.widget.type == 'steps') {
            return {
              title: item[this.widget.options.props.title] + '', 
              description: item[this.widget.options.props.description]
            }
          } else if (this.widget.type == 'transfer') {
            return item
          } else {
            return {
              value: item[this.widget.options.props.value],
              label: item[this.widget.options.props.label]
            }
          }
        }
        
      })
    },
    getOptions () {
      return JSON.parse(JSON.stringify(this.remoteOptions))
    },
    processRemoteProps (children, props) {
      if (children && children.length) {
        return children.map(item => {
          if (this.processRemoteProps(item[props.children], props).length) {
            return {
              value: item[props.value],
              label: item[props.label],
              children: this.processRemoteProps(item[props.children], props)
            }
          } else{
            return {
              value: item[props.value],
              label: item[props.label],
            }
          }
        })
      } else {
        return []
      }
    },
    getCascaderText (value, options, texts = []) {
      if (value.length >= 1) {
        let currentOpt = options?.find(opt => opt.value == value[0])
        if (currentOpt) {
          texts.push(currentOpt.label)
        }
        value.splice(0, 1)
        return this.getCascaderText(value, currentOpt?.children, texts)
      } else if (value.length == 0) {
        return texts
      }
    },
    getTreeText (value, options) {
      for (let i = 0; i < options.length; i++) {
        let currentOpt = options[i]

        if (currentOpt.value == value) {
          return currentOpt.label
        }

        if (currentOpt.children && currentOpt.children.length > 0) {
          let res = this.getTreeText(value, currentOpt.children)

          if (res == '-') {
            continue
          } else {
            return res
          }
        }
      }

      return '-'
    },
    loadUploadConfig () {
      if (this.widget.options.tokenType === 'func') {
        !this.widget.options.token && this.remote[this.widget.options.tokenFunc]((data) => {
          this.remoteToken = data
        })
      } else if (this.widget.options.tokenType === 'fx') {
        let token = executeExpression(this.widget.options.tokenFx, this.currentOptions, this.formContext)

        token && (this.remoteToken = token)
      } else {
        if (this.dataSourceValue) {
          let token = this.getDataSourceOptions('tokenDataSource')

          token && token.value && (this.remoteToken = token.value)
        }
      }
    },
    handleOnMounted () {
      this.execFunction('onMounted', {})
    },
    handleOnClick () {
      this.execFunction('onClick', {})
    },
    handleOnFocus () {
      this.execFunction('onFocus', {})
    },
    handleOnBlur () {
      this.execFunction('onBlur', {})
    },
    handleOnUploadSelect (file) {
      return this.execFunction('onSelect', {file: file})
    },
    handleOnUploadSuccess (file) {
      this.execFunction('onUploadSuccess', {file: file})
    },
    handleOnUploadError (file) {
      this.execFunction('onUploadError', {file: file})
    },
    handleOnUploadProgress (file) {
      this.execFunction('onUploadProgress', {file: file})
    },
    handleOnUploadRemove (file) {
      this.execFunction('onRemove', {file: file})
    },
    handlePageChange (val) {
      this.execFunction('onPageChange', val)
    },
    handleCurrentRow (val) {
      this.execFunction('onCurrentRow', val)
    },
    handleSelectionChange (val) {
      this.execFunction('onSelectionChange', {
        selection: val
      })
    },
    handleOperate ({funcKey, $index, column, row}) {
      return this.eventFunction[funcKey]({
        field: this.widget.model, 
        currentRef: this.$refs['fm-'+this.widget.model], 
        group: this.group,
        fieldNode: this.fieldNode,
        rowIndex: $index,
        $index: $index,
        column: column,
        row: {...row}
      })
    },
    execFunction (method, arg) {
      if (this.widget.events && this.widget.events[method]) {
        let funcKey = this.widget.events[method]

        return this.eventFunction[funcKey]({
          ...this.currentOptions,
          ...arg,
        })
      }
    },
    getDataSourceOptions (remoteName = 'remoteDataSource') {

      let key = this.group ? this.group + '.' + this.widget.model + '.' + this.widget.options[remoteName]
        : this.widget.model + '.' + this.widget.options[remoteName]

      return this.dataSourceValue.find(item => item.key === key)
    },
    disabledElement (disabled) {
      this.generateDisabled = disabled
    },
  },
  watch: {
    modelValue (val) {
      this.dataModel = val
    },
    dataModel (val, oldValue) {
      if (JSON.stringify(val) != JSON.stringify(oldValue)) {
        this.$emit('update:modelValue', val)
      }
    },
    'remoteOption': {
      deep: true,
      handler: function (val) {
        if (Object.keys(this.remoteOption).indexOf(this.widget.options.remoteOption) >= 0
          && this.widget.options.remote 
          && this.widget.options.remoteType == 'option' 
        ) {
          this.loadOptions(this.remoteOption[this.widget.options.remoteOption])
        }
      }
    },
    'dataSourceValue': {
      deep: true,
      handler: function(val) {
        if (this.dataSourceValue) {
          let options = this.getDataSourceOptions()
      
          options && options.value && this.loadOptions(options.value)
        }

        if ((this.widget.type === 'imgupload' || this.widget.type === 'fileupload') && this.widget.options.isQiniu) {
      
          this.loadUploadConfig()
        }
      }
    }
  }
}

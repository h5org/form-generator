<template>
  <el-container class="event-script-container">
    <el-aside width="300px" class="event-script-aside">
      <el-container>
        <el-header height="42px">
          <el-button link type="primary" size="default" @click="handleAdd"><i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>{{$t('fm.eventscript.config.add')}}</el-button>
        </el-header>
        <el-main>
          <el-scrollbar>
            <el-menu class="event-script-aside-menu" :default-active="selectKey"> 

              <draggable
                :list="list" 
                v-bind="{group:'peo1', ghostClass: 'ghost11',animation: 200, handle: '.drag-widget'}"
                :no-transition-on-drag="true"
                item-key="key"
              >
                <template #item="{element: item, index}">
                  <el-menu-item 
                    :class="{
                      'is-disabled': !saved || isFormChange(),
                      'is-active2': selectKey == item.key
                    }"
                    :index="item.key" :key="item.key" @click="handleSelect(item.key)" >
                
                    <template #title>
                      <div>
                        <el-badge is-dot style="position: absolute; top: 2px; left: 2px;" v-if="(isFormChange() || !saved) && selectKey == item.key"></el-badge>
                        <span class="event-script-menu-i" :class="{'is-vis': item.type == 'rule'}">{{item.type == 'rule' ? 'VIS' : 'JS'}}</span>
                        <div class="event-script-menu-label">{{item.name}}</div>
                        <div class="event-script-menu-action" 
                          
                        >
                          <i v-if="!readonlyFunctions.includes(item.name)" class="fm-iconfont icon-icon_clone" @click.stop="handleClone(index)" :title="$t('fm.tooltip.clone')"></i>
                          <i v-if="!readonlyFunctions.includes(item.name)" class="fm-iconfont icon-trash" @click.stop="handleRemove(index)" :title="$t('fm.tooltip.trash')"></i>
                          <i class="fm-iconfont icon-icon_bars drag-widget"></i>
                        </div>
                      </div>
                    </template>
                  </el-menu-item>
                </template>
              </draggable>
            </el-menu>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-aside>
    <el-main class="event-script-main">
      <el-container v-if="selectIndex >= 0">
        <el-header height="42px">
          <div class="event-script-action">
            <el-button type="primary" size="default" @click="handleSave(true)" v-if="this.eventType">{{$t('fm.eventscript.config.confirm')}}</el-button>
            <el-button type="primary" size="default" @click="handleSave(false)">{{$t('fm.eventscript.config.save')}}</el-button>
            <el-button size="default" @click="handleCancal">{{$t('fm.eventscript.config.cancel')}}</el-button>
          </div>
        </el-header>
        <el-main>
          <el-form ref="dataForm" :model="formData" :rules="formRules" :label-width="'125px'" size="default" label-position="left" :key="selectKey" @submit.prevent>
            <el-form-item :label="$t('fm.eventscript.config.name')" :label-width="$i18n.locale == 'zh-cn' ? '100px' : '125px'" prop="name">
              <el-input v-model="formData.name" :disabled="readonlyFunctions.includes(formData.name)"></el-input>
            </el-form-item>
            <el-form-item label-width="0" v-if="formData.type">
              <el-radio-group v-model="formData.type">
                <el-radio-button label="rule" value="rule">{{$t('fm.eventscript.config.rules')}}</el-radio-button>
                <el-radio-button label="js" value="js">{{$t('fm.eventscript.config.js')}}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label-width="0" prop="func" style="margin-bottom: 0px;" v-if="!formData.type || formData.type == 'js'">
              <div class="code-line">Function () {</div>
                  
              <code-editor v-model="formData.func" mode="javascript" :height="formData.type ? '350px' : '400px'"></code-editor>
              <div class="code-line">}</div>
            </el-form-item>
            <template v-if="formData.type == 'rule'">
              <event-rule v-model="formData.rules"></event-rule>
            </template>
          </el-form>
        </el-main>
      </el-container>
    </el-main>
  </el-container>
</template>

<script>
import Draggable from 'vuedraggable/src/vuedraggable'
import CodeEditor from '../CodeEditor/index.vue'
import { ElMessage } from '../../util/message.js'
import EventRule from './rule.vue'
import _ from 'lodash'
import { ruleToFunction } from '../../util/rule-funcs.js'

export default {
  components: {
    Draggable,
    CodeEditor,
    EventRule
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'on-confirm-event'],
  data () {
    return {
      formData: {
        key: '',
        name: '',
        func: '',
        type: 'rule'
      },
      tmpData: {},
      formRules: {
        name: [
          {required: true, message: ' '},
          { validator: (rule, value, callback) => {
            let currentItem = this.historyList.find(item => item.name ==value)

            if (currentItem && currentItem.key != this.selectKey) {
              callback(new Error(this.$t('fm.eventscript.message.repeat')))
            } else {
              callback()
            }
          }}
        ]
      },
      list: [...this.modelValue],
      selectIndex: -1,
      selectKey: '',
      historyList: [...this.modelValue],
      saved: true,
      eventType: '',
      readonlyFunctions: ['mounted', 'refresh', 'onFormChange']
    }
  },
  provide () {
    return {
      'getEventsArray': this.getEventsArray
    }
  },
  methods: {

    handleSave (confirm) {
      return new Promise((resolve, reject) => {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {

            try {
              if (this.formData.type === 'rule') {
                const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
                new AsyncFunction(ruleToFunction(this.formData.rules))
              } else {
                new Function(this.formData.func)
              }

              this.list[this.list.findIndex(item => item.key === this.selectKey)] = this.formData

              this.historyList = [...this.list]

              this.saved = true

              this.tmpData = _.cloneDeep(this.formData)

              this.$emit('update:modelValue', this.historyList)

              if (confirm) {
                this.$emit('on-confirm-event', {...this.formData, type: this.eventType})
              } else {
                ElMessage({
                  message: this.$t('fm.eventscript.message.saveSuccess'),
                  type: 'success'
                }, this)
              }

              setTimeout(() => {
                resolve()
              }, 300)
            } catch(error) {
              ElMessage({
                message: this.$t('fm.message.eventSaveError') + error.message,
                type: 'error'
              }, this)
            }
          } else {
            reject()
          }
        })
      })
    },

    handleAdd () {
      if (!this.saved || this.isFormChange()) {
        ElMessage({
          message: this.$t('fm.eventscript.message.saveError'),
          type: 'warning'
        }, this)
        return;
      }

      let key = Math.random().toString(36).slice(-8)

      this.list.push({
        key: key,
        name: 'func_'+key,
        func: '',
        type: 'rule'
      })
      this.selectKey = key

      this.saved = false
    },

    loadNewFunction (name) {
      let key = Math.random().toString(36).slice(-8)

      this.list.push({
        key: key,
        name: name + '_' + key,
        func: '',
        type: 'rule'
      })

      this.selectKey = key

      this.saved = false

      this.eventType = name
    },

    loadForm () {
      let currentData = _.cloneDeep(this.list[this.selectIndex])

      this.formData = {
        ...currentData,
        type: currentData.type || 'js'
      }

      this.tmpData = _.cloneDeep(this.formData)
    },

    handleSelect (key) {
      if (key === this.selectKey) {
        return
      }
      if (!this.saved || this.isFormChange()) {
        ElMessage({
          message: this.$t('fm.eventscript.message.saveError'),
          type: 'warning'
        }, this)
        return;
      }

      this.selectKey = key
    },

    isFormChange () {
      if (this.selectKey && Object.keys(this.tmpData).length) {
        return !_.isEqual(this.formData, this.tmpData)
      } else {
        return false
      }
    },

    loadFunction (key, name) {
      this.selectKey = key

      if (name) {
        this.eventType = name
      }
    },

    handleCancal () {
      this.beforeClose(() => {
        this.selectKey = ''

        this.list = [...this.historyList]

        this.saved = true
      })
    },

    handleClone (index) {
      if (!this.saved || this.isFormChange()) {
        ElMessage({
          message: this.$t('fm.eventscript.message.saveError'),
          type: 'warning'
        }, this)
        return;
      }
      let currentData = this.list[index]

      let key = Math.random().toString(36).slice(-8)

      let cloneData = {
        ...currentData,
        key,
        name: currentData.name + '_copy'
      }

      this.list.push(cloneData)

      this.selectKey = key

      this.saved = false
    },

    handleRemove (index) {
      let currentData = this.list[index]

      this.$msgbox.confirm(`${this.$t('fm.eventscript.message.confirmRemove')} [${currentData.name}] ?`, '', {
        type: 'warning'
      }).then(() => {
        if (currentData.key === this.selectKey) {
          this.selectKey = ''
          this.saved = true
        }
        this.list.splice(index, 1)
        if (index < this.historyList.length) {
          this.historyList.splice(index, 1)
        }

        this.$emit('update:modelValue', this.historyList)
      }).catch(() => {})
    },

    getEventsArray () {
      return this.list.map(item => ({key: item.key, name: item.name, type: item.type})).filter(item => item.key != 'mounted' && item.key != 'refresh' && item.key != this.selectKey)
    },

    beforeClose (done) {
      if (this.isFormChange() || !this.saved) {
        this.$msgbox.confirm(
          this.$t('fm.eventscript.message.saveConfirm'),
          'Confirm',
          {
            distinguishCancelAndClose: true,
            confirmButtonText: this.$t('fm.eventscript.config.save'),
            cancelButtonText: this.$t('fm.eventscript.config.notSave'),
            type: 'warning'
          }
        )
          .then(() => {
            this.handleSave().then(() => {
              done()
            })
            
          })
          .catch((action) => {

            if (action === 'cancel') {
              done()
            }
          })
      } else {
        done()
      }
    }
  },
  watch: {
    selectKey (val) {
      if (val) {
        this.selectIndex = this.list.findIndex(item => item.key === val)

        if (this.selectIndex >= 0) {
          this.loadForm()
        }
      } else {
        this.selectIndex = -1
      }
    }
  }
}
</script>

<style lang="scss">
.event-script-container{
  .event-script-main{
    padding: 0;

    >.el-container{
      display: flex;
      height: 100%;

      >.el-header{
        padding: 5px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-border-color-extra-light);
      }
    }
    
    .event-script-action{
      text-align: right;
    }

    .code-line{
      font-size: 14px;
      color: var(--el-color-primary);
      font-weight: 500;
    }

    .code-desc{
      margin-left: 2px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }

    .el-collapse-item{
      border: 1px solid var(--el-border-color-lighter);
    }

    .el-collapse-item__header{
      background: var(--el-border-color-lighter);
      // border: 0;
      height: 36px;
      line-height: 36px;
      padding: 5px;
    }

    .el-collapse-item__wrap{
      border: 0;

      .el-collapse-item__content{
        padding: 5px;
      }
    }
  }

  .event-script-aside{
    border-right: 1px solid var(--el-border-color-lighter);

    >.el-container{
      display: flex;
      height: 100%;

      >.el-main{
        margin: 0;
        padding: 0;
      }

      >.el-header{
        padding: 5px;
        border-bottom: 1px solid var(--el-border-color-lighter);
        background: var(--el-border-color-extra-light);
      }
    }

    .event-script-aside-menu{
      margin: 10px;
      border-right: 0;

      .el-menu-item{
        border: 1px solid var(--el-border-color);
        background: var(--el-bg-color);
        border-radius: 3px;
        padding: 10px !important;
        height: auto;
        line-height: 1;
        cursor: default;
        position: relative;

        &.ghost11{
          border: 2px solid var(--fm-drag-color);
          outline-width: 0;
        }

        &.is-disabled{
          opacity: 1;
          cursor: default;
          background: var(--el-bg-color);
        }

        &.is-active2{
          background: var(--el-border-color-light) !important;
          color: var(--el-text-color-primary);
        }

        &.is-active.is-disabled{
          color: var(--el-menu-text-color);
        }

        +.el-menu-item{
          margin-top: 6px;
        }
      }

      .event-script-menu-label{
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
        display: inline-block;
        width: 170px;
        margin-left: 30px;
      }

      .event-script-menu-i{
        position: absolute;
        font-size: 12px;
        left: 5px;
        top: 13px;
        width: 30px;
        text-align: left;
        padding-left: 5px;
        color: #67C23A;
        font-style: italic;

        &.is-vis{
          color: #e6a23c;
        }
      }

      .event-script-menu-action{
        display: inline-block;
        padding-right: 10px;
        color: var(--el-text-color-regular);
        font-weight: 600;
        text-align: right;
        width: 70px;

        >i{
          cursor: pointer;
          margin-left: 5px;
        }

        >.drag-widget{
          cursor: move;
        }
      }
    }
  }
}
</style>
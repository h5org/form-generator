<template>
  <a-modal
    v-model:open="visible"
    :title="element.options.title"
    :width="element.options.width || '50%'"
    :mask-closable="false"
    :closable="element.options.showClose"
    destroy-on-close
    :ref="`generate-dialog-${element.model}`"
    :style="{
      top: element.options.top || '15vh'
    }"
    :z-index="3000"
    :wrap-class-name="'fm-generate-ant-dialog ' 
      + ((!element.options.showCancel && !element.options.showOk) ? 'no-footer ' : '')
      + (element.options.center ? 'center ' : '')
      + (element.options?.customClass ? element.options?.customClass : '')"
    @cancel="close"
  >
    <div >
      <template v-for="item in element.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          :key="`grid-${item.key}`"
          :model="dialogModel"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="item.type == 'tabs'"
          :key="`tabs-${item.key}`"
          :model="dialogModel"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-tab-item>

        <generate-collapse
          v-else-if="item.type == 'collapse'"
          :key="`collapse-${item.key}`"
          :model="dialogModel"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-collapse>

        <generate-report
          v-else-if="item.type == 'report'"
          :key="`report-${item.key}`"
          :model="dialogModel"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-report>

        <generate-card
          v-else-if="item.type == 'card'"
          :key="`card-${item.key}`"
          :model="dialogModel"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-card>

        <generate-inline
          v-else-if="item.type == 'inline'"
          :key="`inline-${item.key}`"
          :model="dialogModel"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-inline>

        <generate-form-item
          v-else
          :key="`form-item-${item.key}`"
          :models="dialogModel"
          :rules="rules"
          :widget="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :is-dialog="true"
          :dialog-name="element.model"
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </div>
    <template #footer>
      <div>
        <a-button key="back" v-if="element.options.showCancel" @click="handleCancel">{{element.options.cancelText}}</a-button>
        <a-button key="submit" type="primary" v-if="element.options.showOk" :loading="element.options.confirmLoading" @click="handleConfirm">{{element.options.okText}}</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateReport from './GenerateReport.vue'
import GenerateInline from './GenereteInline.vue'
import GenerateCollapse from './GenerateCollapse.vue'
import GenerateCard from './GenerateCard.vue'
import { generateDialogMixin } from '../../mixins/generateDialog'

export default {
  name: 'generate-dialog',
  components: {
    GenerateColItem,
    GenerateFormItem,
    GenerateInline,
    GenerateReport,
    GenerateTabItem,
    GenerateCollapse,
    GenerateCard
  },
  mixins: [generateDialogMixin],
  props: ['config', 'models', 'rules', 'element', 'remote', 'blanks', 'edit', 'remoteOption', 'platform', 'preview', 'containerKey', 'dataSourceValue', 'eventFunction', 'printRead', 'group', 'fieldNode'],
  data () {
    return {
      activeElement: ''
    }
  },
  mounted () {
    this.generateComponentInstance && this.generateComponentInstance(this.element.model, this.$refs[`generate-dialog-${this.element.model}`].$parent)

    this.$nextTick(() => {
      window.document.querySelector('.fm-generate-ant-dialog')?.removeAttribute('tabindex')

      setTimeout(() => {
        this.clearValidate()
      })
    })
  },
  methods: {
    open () {
      this.activeElement = document.activeElement
      document.activeElement && document.activeElement.blur()
      this.visible = true

      if (this.element && this.element.events && this.element.events.onOpen) {
        let funcKey = this.element.events.onOpen

        this.$nextTick(() => {
          this.eventFunction[funcKey]({field: this.element.model, currentRef: this})
        })
      }
    },
    close () {
      if (this.activeElement) {
        this.activeElement.focus()
        this.activeElement = ''
      }
      this.visible = false

      if (this.element && this.element.events && this.element.events.onClose) {
        let funcKey = this.element.events.onClose

        this.eventFunction[funcKey]({field: this.element.model, currentRef: this})
      }
    },
    validate () {
      return new Promise((resolve, reject) => {
        let realFields = this._getAllRuleFields()

        this.getFormComponent().validate(realFields).then(() => {
          resolve()
        }).catch(()=> {
          reject()
        })
      })
    },
    clearValidate () {
      let realFields = this._getAllRuleFields()

      this.getFormComponent().clearValidate(realFields)
    },
    _getAllRuleFields () {
      let realFields = []

      Object.keys(this.dialogModel).forEach((v) => {
        if (Array.isArray(this.dialogModel[v])) {
          const currentArray = this.dialogModel[v]

          currentArray.forEach((o, i) => {
            Object.keys(o).forEach((key) => {
              realFields.push(`${this.element.model}.${v}.${i}.${key}`)
            })
          })
        } else {
          realFields.push(`${this.element.model}.${v}`)
        }
      })

      return realFields.map(item => item.split('.'))
    }
  }
}
</script>

<style lang="scss">
.fm-generate-ant-dialog{
  &.no-footer{
    .ant-modal-footer{
      display: none;
    }
  }

  &.center{
    .ant-modal-header{
      text-align: center;
    }

    .ant-modal-footer{
      text-align: center;
    }
  }

  .ant-form-item{
    .ant-pagination{
      float: right;
    }
  }
}
</style>
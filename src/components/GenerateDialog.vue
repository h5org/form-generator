<template>
  <el-dialog
    v-model="visible"
    :title="element.options.title"
    :width="element.options.width || '50%'"
    :top="element.options.top || '15vh'"
    :close-on-click-modal='false'
    :show-close="element.options.showClose"
    :center="element.options.center"
    destroy-on-close
    :ref="`generate-dialog-${element.model}`"
    class="fm-generate-dialog"
    :class="{
      [element.options && element.options.customClass]: element.options && element.options.customClass ? true : false
    }"
    @open="handleOpen"
    @close="handleClose"
  >
    <div >
      <template v-for="item in element.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          :key="item.key"
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
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </div>
    <template #footer v-if="element.options.showCancel || element.options.showOk">
      <div>
        <el-button v-if="element.options.showCancel" @click="handleCancel">{{element.options.cancelText}}</el-button>
        <el-button type="primary" v-if="element.options.showOk" :loading="element.options.confirmLoading" @click="handleConfirm">{{element.options.okText}}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateReport from './GenerateReport.vue'
import GenerateInline from './GenerateInline.vue'
import GenerateCollapse from './GenerateCollapse.vue'
import GenerateCard from './GenerateCard.vue'
import { generateDialogMixin } from '../mixins/generateDialog'

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
  methods: {
    validate () {
      return new Promise((resolve, reject) => {
        let realFields = this._getAllRuleFields()

        this.getFormComponent().validateField(realFields, (valid, error) => {
          if (valid) {
            resolve()
          } else {
            reject(error)
          }
        })
      })
    },
    handleOpen () {
      if (this.element && this.element.events && this.element.events.onOpen) {
        let funcKey = this.element.events.onOpen

        this.$nextTick(() => {
          this.eventFunction[funcKey]({
            field: this.element.model,
            currentRef: this
          })
        })
      }
    },
    handleClose () {
      if (this.element && this.element.events && this.element.events.onClose) {
        let funcKey = this.element.events.onClose

        this.eventFunction[funcKey]({
          field: this.element.model,
          currentRef: this
        })
      }
    },
  }
}
</script>

<style lang="scss">
.fm-generate-dialog{
  .el-dialog__footer{
    text-align: right;
  }

  &.el-dialog--center{
    .el-dialog__footer{
      text-align: center;
    }
  }
}
</style>
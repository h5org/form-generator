<template>
  <div :style="{width: formData.config && formData.config.width}" class="fm-form"
    :class="{
      ['fm-'+formStyleKey]: true,
      'is-print': printRead
    }"
  >
    <a-form :ref="formRef"
      :model="models" 
      :rules="rules" 
      :key="formKey"
      v-if="formShow"
      :class="{
        [formData.config?.customClass]: formData.config?.customClass?true: false,
        'no-label-form': formData.config?.labelWidth == 0
      }"
      
      :label-align="formData.config?.labelPosition != 'top' ? formData.config?.labelPosition : 'left'"
      :layout="formData.config?.labelPosition == 'top' ? 'vertical' : 'horizontal'"
      validateOnRuleChange
      scrollToFirstError
    >
      <template v-for="item in formData.list" :key="item.key">
        <generate-col-item
          v-if="item.type == 'grid'"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="item.type == 'tabs'"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-tab-item>

        <generate-collapse
          v-else-if="item.type == 'collapse'"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-collapse>

        <generate-report
          v-else-if="item.type == 'report'"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-report>

        <generate-card
          v-else-if="item.type == 'card'"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-card>

        <generate-inline
          v-else-if="item.type == 'inline'"
          :model="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-inline>

        <generate-dialog
          v-else-if="item.type == 'dialog'"
          v-model:models="models"
          :rules="rules"
          :element="item"
          :remote="remote"
          :blanks="blanks"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-dialog>

        <generate-form-item
          v-else
          :models="models"
          :rules="rules"
          :widget="item"
          :remote="remote"
          :blanks="blanks"
          :display="displayFields"
          @input-change="onInputChange"
          :edit="edit"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :config="formData.config"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </a-form>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateReport from './GenerateReport.vue'
import GenerateInline from './GenereteInline.vue'
import GenerateCollapse from './GenerateCollapse.vue'
import GenerateDialog from './GenerateDialog.vue'
import GenerateCard from './GenerateCard.vue'
import { generateFormMixin } from '../../mixins/generateForm.js'
import { getBindModels } from '../../util/index.js'
import _ from 'lodash'

export default {
  name: 'fm-generate-antd-form',
  components: {
    GenerateFormItem,
    GenerateColItem,
    GenerateTabItem,
    GenerateReport,
    GenerateInline,
    GenerateCollapse,
    GenerateDialog,
    GenerateCard
  },
  mixins: [generateFormMixin],
  methods: {
    validate (fields) {
      if (typeof fields === 'string') {
        fields = [fields]
      }
      return new Promise((resolve, reject) => {
        if (fields && fields.length) {
          this.$refs[this.formRef].validate(fields.map(item => item.split('.'))).then(() => {
            resolve()
          }).catch(()=> {
            reject()
          })
        } else {
          this.$refs[this.formRef].validate().then(() => {
            resolve()
          }).catch(()=> {
            reject()
          })
        }
        
      })
    },
    clearValidate (fields) {
      this.$refs[this.formRef].clearValidate(fields)
    },
    getData (isValidate = true) {
      
      return new Promise((resolve, reject) => {
        if (isValidate) {
          this.$refs[this.formRef].validate().then(() => {
            resolve(getBindModels(this.models, this.dataBindFields))
          }).catch((error) => {
            reject(new Error(this.$t('fm.message.validError')).message)
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
          }, 10)
        })
      })
    },
    onInputChange (value, field) {
      this.$emit('on-change', field, value, this.models)
      // this.$emit(`on-${field}-change`, value)
    },
    setRules (field, rules) {

      this.rules[field] = [...rules]

      this.$nextTick(() => {
        if (field?.split('.').length > 1) {
          const tableRowLength = this.getValue(field.split('.')[0])?.length
          if (tableRowLength) {
            for (let i= 0; i < tableRowLength; i++) {
              setTimeout(() => {
                this.$refs[this.formRef].validate([[field.split('.')[0],i,field.split('.')[1]]])
              })
            }
          }
        } else {
          setTimeout(() => {
            this.$refs[this.formRef].validate([field])
          })
        }
      })
    },
  }
}
</script>


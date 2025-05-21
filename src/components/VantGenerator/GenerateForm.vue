<template>
  <div class="fm-form fm-vant-form"
    :class="{
      ['fm-'+formStyleKey]: true,
      'is-print': printRead
    }"
  >
    <van-form
      :ref="formRef"
      :key="formKey"
      v-if="formShow"
      :label-align="formData.config?.labelPosition"
      :label-width="formData.config?.labelWidth + 'px'"
      :class="{
        [formData.config && formData.config.customClass]:  (formData.config && formData.config.customClass) ? true : false,
      }"
      :colon="formData.config?.labelSuffix ? true : false"
      :disabled="!edit"
      scroll-to-error	
      show-error
    >
      <template v-for="item in formData.list">
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
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-dialog>

        <generate-form-item
          v-else
          :key="item.key"
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
          :group="''"
          :field-node="''"
          :config="formData.config"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </van-form>

    <van-number-keyboard safe-area-inset-bottom />
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateCollapse from './GenerateCollapse.vue'
import GenerateInline from './GenerateInline.vue'
import GenerateCard from './GenerateCard.vue'
import GenerateDialog from './GenerateDialog.vue'
import {generateFormMixin} from '../../mixins/generateForm.js'
import _ from 'lodash'
import { getBindModels } from '../../util/index.js'

export default {
  name: 'fm-generate-vant-form',
  components: {
    GenerateFormItem,
    GenerateColItem,
    GenerateTabItem,
    GenerateCollapse,
    GenerateInline,
    GenerateCard,
    GenerateDialog
  },
  mixins: [generateFormMixin],
  methods: {
    _convertValidator (oldValidator) {
      return (value, rule) => {
        return new Promise((resolve, reject) => {
          oldValidator(rule, value, (error) => {
            if (error || error !== undefined) {
              resolve(error?.message || error)
            } else {
              resolve(true)
            }
          })
        })
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

              return {...im, validator: this._convertValidator(validatorFunc)}
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

              return {...im, validator: this._convertValidator(validatorFunc)}
            } else {
              return {...im}
            }
          }) : [])
        ]
      }
    },
    validate (fields) {
      return new Promise((resolve, reject) => {
        if (fields && fields.length > 0) {
          this.$refs[this.formRef].validate(fields).then(() => {
            resolve()
          }).catch(error => {
            reject()
          })
        } else {
          this.$refs[this.formRef].validate().then(() => {
            resolve()
          }).catch(error => {
            reject()
          })
        }
      })
    },
    clearValidate (fields) {
      this.$refs[this.formRef].resetValidation(fields)
    },
    reset () {
      return new Promise((resolve) => {
        this.setData(_.cloneDeep(this.resetModels)).then(() => {
          this.clearValidate()
          resolve()
        })
      })
    },
    getData (isValidate = true) {
      return new Promise((resolve, reject) => {
        if (isValidate) {
          this.validate().then(() => {
            resolve(getBindModels(this.models, this.dataBindFields))
          }).catch((error) => {
            reject(new Error(this.$t('fm.message.validError')).message)
          })
        } else {
          resolve(getBindModels(this.models, this.dataBindFields))
        }
      })
    },
  }
}
</script>

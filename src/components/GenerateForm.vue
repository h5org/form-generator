<template>
  <div :style="{width: formData.config && formData.config.width}" class="fm-form"
    :class="{
      ['fm-'+formStyleKey]: true,
      'is-print': printRead
    }"
  >
    <el-form :ref="formRef"
      @submit.prevent
      :key="formKey"
      v-if="formShow"
      :class="{
        [formData.config && formData.config.customClass]:  (formData.config && formData.config.customClass) ? true : false,
        'no-label-form': formData.config && (formData.config.labelWidth == 0)
      }"
      :size="formData.config && formData.config.size"
      :model="models" 
      :rules="rules" 
      :label-position="formData.config && formData.config.labelPosition" 
      :disabled="!edit"
      :label-width="formData.config && formData.config.labelWidth + 'px'"
      :validate-on-rule-change="false"
      :label-suffix="formData.config?.labelSuffix ? ' : ' : ' '"
    >

      <template v-for="item in formData.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          :key="`grid-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-col-item>

        <generate-tab-item
          v-else-if="item.type == 'tabs'"
          :key="`tab-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-tab-item>

        <generate-collapse
          v-else-if="item.type == 'collapse'"
          :key="`collapse-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-collapse>

        <generate-report
          v-else-if="item.type == 'report'"
          :key="`report-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-report>

        <generate-inline
          v-else-if="item.type == 'inline'"
          :key="`inline-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-inline>

        <generate-dialog
          v-else-if="item.type == 'dialog'"
          :key="`dialog-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-dialog>

        <generate-card
          v-else-if="item.type == 'card'"
          :key="`card-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-card>

        <generate-form-item
          v-else
          :key="`form-item-${item.key}`"
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
          :form-component="$refs[formRef]"
          :group="''"
          :field-node="''"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateReport from './GenerateReport.vue'
import GenerateInline from './GenerateInline.vue'
import GenerateCollapse from './GenerateCollapse.vue'
import GenerateDialog from './GenerateDialog.vue'
import GenerateCard from './GenerateCard.vue'
import { generateFormMixin } from '../mixins/generateForm.js'

export default {
  name: 'fm-generate-form',
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
  mixins: [generateFormMixin]
}
</script>

<template>
  <div class="fm-inline-container"
    v-if="elementDisplay"
    :class="{
      [element.options && element.options.customClass]: element.options && element.options.customClass ? true : false
    }"
  >
    <template v-for="item in element.list" :key="item.key">

      <generate-form-item
        :models="dataModels"
        :rules="rules"
        :widget="item"
        :remote="remote"
        :blanks="blanks"
        :display="display"
        :sub-hide-fields="subHideFields"
        :sub-disabled-fields="subDisabledFields"
        :edit="edit"
        :remote-option="remoteOption"
        :platform="platform"
        :preview="preview"
        :container-key="containerKey"
        :data-source-value="dataSourceValue"
        :event-function="eventFunction"
        :print-read="printRead"
        :config="config"
        :is-subform="isSubform"
        :row-index="rowIndex"
        :sub-name="subName"
        :is-dialog="isDialog"
        :dialog-name="dialogName"
        :is-group="isGroup"
        :group="group"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-form-item>
    </template>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import { generateInlineMixin } from '../../mixins/generateInline'

export default {
  name: 'generate-inline',
  components: {
    GenerateFormItem
  },
  mixins: [generateInlineMixin],
}
</script>
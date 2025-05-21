<template>
  <div class="fm-inline-container"
    v-if="elementDisplay"
    :class="{
      [element.options && element.options.customClass]: element.options && element.options.customClass ? true : false
    }"
    :style="{
      display: element.options.flex ? 'flex' : 'block',
      'flex-direction': 'row',
      'flex-wrap': 'wrap',
      'justify-content': element.options.flexJustify || 'normal',
      'align-items': element.options.flexAlign || 'normal'
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
        :style="{'margin-right': element.options.spaceSize+'px'}"
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
import { generateInlineMixin } from '../mixins/generateInline'

export default {
  name: 'generate-inline',
  components: {
    GenerateFormItem
  },
  mixins: [generateInlineMixin],
}
</script>

<style lang="scss">
.fm-inline-container{
  > *{
    display: inline-block;
    vertical-align: top;
  }
}
</style>
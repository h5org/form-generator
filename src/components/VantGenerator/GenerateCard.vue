<template>
  <div style="margin: 10px;">
    <van-cell-group
      :title="element.options.showHeader ? element.options.title : ''"
      :border="element.options.bordered"
      :class="{
        [element.options?.customClass]: element.options?.customClass ? true: false
      }"
    >
      <template v-for="item in element.list">
          <generate-col-item
            v-if="item.type == 'grid'"
            :key="`grid-${item.key}`"
            :model="dataModels"
            :rules="rules"
            :element="item"
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
          </generate-col-item>

          <generate-tab-item
            v-else-if="item.type == 'tabs'"
            :key="`tabs-${item.key}`"
            :model="dataModels"
            :rules="rules"
            :element="item"
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
          </generate-tab-item>

          <generate-collapse
            v-else-if="item.type == 'collapse'"
            :key="`collapse-${item.key}`"
            :model="dataModels"
            :rules="rules"
            :element="item"
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
          </generate-collapse>

          <generate-inline
            v-else-if="item.type == 'inline'"
            :key="`inline-${item.key}`"
            :model="dataModels"
            :rules="rules"
            :element="item"
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
          </generate-inline>

          <generate-card
            v-else-if="item.type == 'card'"
            :key="`card-${item.key}`"
            :model="dataModels"
            :rules="rules"
            :element="item"
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
          </generate-card>

          <generate-form-item
            v-else
            :key="`form-item-${item.key}`"
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
    </van-cell-group>
  </div>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateInline from './GenerateInline.vue'
import { defineAsyncComponent } from 'vue'
import { generateCardMixin } from '../../mixins/generateCard'

export default {
  name: 'generate-card',
  components: {
    GenerateFormItem,
    GenerateInline,
    GenerateTabItem: defineAsyncComponent(() => import('./GenerateTabItem.vue')),
    GenerateCollapse: defineAsyncComponent(() => import('./GenerateCollapse.vue')),
    GenerateColItem: defineAsyncComponent(() => import('./GenerateColItem.vue')),
  },
  mixins: [generateCardMixin],
}
</script>
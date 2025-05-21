<template>
  <van-row
    :class="{
      [element.options && element.options.customClass]: element.options && element.options.customClass?true: false
    }"
    :gutter="element.options.gutter || 0"
    :justify="element.options.justify"
    :align="element.options.align"
    v-if="elementDisplay"
  >
    <template v-for="(item, index) in element.columns" :key="index">
      <van-col
        v-if="!hideCols.includes(index)"
        :class="{
          [item.options && item.options.customClass]: item.options && item.options.customClass?true: false
        }"
        :span="getColSpan(item.options)"
        :offset="item.options ? item.options.offset : 0"
        :push="item.options ? item.options.push : 0"
        :pull="item.options ? item.options.pull : 0"
      >
        <template v-for="col in item.list">
          <generate-col-item
            v-if="col.type == 'grid'"
            :key="`grid-${col.key}`"
            :model="dataModels"
            :rules="rules"
            :element="col"
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
            v-else-if="col.type == 'tabs'"
            :key="`tabs-${col.key}`"
            :model="dataModels"
            :rules="rules"
            :element="col"
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
            v-else-if="col.type == 'collapse'"
            :key="`collapse-${col.key}`"
            :model="dataModels"
            :rules="rules"
            :element="col"
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

          <generate-card
            v-else-if="col.type == 'card'"
            :key="`card-${col.key}`"
            :model="dataModels"
            :rules="rules"
            :element="col"
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

          <generate-inline
            v-else-if="col.type == 'inline'"
            :key="`inline-${col.key}`"
            :model="dataModels"
            :rules="rules"
            :element="col"
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

          <generate-form-item
            v-else
            :key="`form-item-${col.key}`"
            :models="dataModels"
            :rules="rules"
            :widget="col"
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
      </van-col>
    </template>
  </van-row>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateInline from './GenerateInline.vue'
import { defineAsyncComponent } from 'vue'
import { generateColItemMixin } from '../../mixins/generateColItem'

export default {
  name: 'generate-col-item',
  components: {
    GenerateFormItem,
    GenerateInline,
    GenerateCollapse: defineAsyncComponent(() => import('./GenerateCollapse.vue')),
    GenerateTabItem: defineAsyncComponent(() => import('./GenerateTabItem.vue')),
    GenerateCard: defineAsyncComponent(() => import('./GenerateCard.vue')),
  },
  mixins: [generateColItemMixin],
  methods: {
    getColSpan (options) {
      
      if (this.platform == 'pc') {
        return options && options.md
      }
      if (this.platform == 'pad') {
        return options && options.sm
      }
      if (this.platform == 'mobile') {
        return options && options.xs
      }
    },
  }
}
</script>
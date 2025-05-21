<template>
  <div
    :style="{
      width: element.options.width,
    }"
    :ref="`generate-group-${element.model}`"
  >
    <template v-for="item in element.list">
      <generate-col-item
        v-if="item.type == 'grid'"
        :key="item.key"
        :model="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-col-item>

      <generate-tab-item
        v-else-if="item.type == 'tabs'"
        :key="`tabs-${item.key}`"
        :model="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-tab-item>

      <generate-collapse
        v-else-if="item.type == 'collapse'"
        :key="`collapse-${item.key}`"
        :model="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-collapse>

      <generate-report
        v-else-if="item.type == 'report'"
        :key="`report-${item.key}`"
        :model="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-report>

      <generate-card
        v-else-if="item.type == 'card'"
        :key="`card-${item.key}`"
        :model="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-card>

      <generate-inline
        v-else-if="item.type == 'inline'"
        :key="`inline-${item.key}`"
        :model="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
        :field-node="fieldNode"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-inline>

      <generate-form-item
        v-else
        :key="`form-item-${item.key}`"
        :models="groupModel"
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
        :is-group="true"
        :is-subform="false"
        :group="group ? group + '.' + element.model : element.model"
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
import { defineAsyncComponent } from 'vue'
import { generateGroupMixin } from '../mixins/generateGroup'

export default {
  name: 'fm-group',
  components: {
    GenerateColItem: defineAsyncComponent(() => import('./GenerateColItem.vue')),
    GenerateFormItem: defineAsyncComponent(() => import('./GenerateFormItem.vue')),
    GenerateInline: defineAsyncComponent(() => import('./GenerateInline.vue')),
    GenerateReport: defineAsyncComponent(() => import('./GenerateReport.vue')),
    GenerateTabItem: defineAsyncComponent(() => import('./GenerateTabItem.vue')),
    GenerateCollapse: defineAsyncComponent(() => import('./GenerateCollapse.vue')),
    GenerateCard: defineAsyncComponent(() => import('./GenerateCard.vue'))
  },
  mixins: [generateGroupMixin],
}
</script>

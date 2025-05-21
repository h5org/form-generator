<template>
  <van-cell-group
    :style="{
      width: '100%',
    }"
    :ref="`generate-group-${element.model}`"
  >
    <template v-for="item in element.list" :key="`form-item-${item.key}`">
      <generate-col-item
        v-if="item.type == 'grid'"
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
        :config="config"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-col-item>

      <generate-tab-item
        v-else-if="item.type == 'tabs'"
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
        :config="config"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-tab-item>

      <generate-collapse
        v-else-if="item.type == 'collapse'"
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
        :config="config"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-collapse>

      <generate-card
        v-else-if="item.type == 'card'"
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
        :config="config"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-card>

      <generate-inline
        v-else-if="item.type == 'inline'"
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
        :config="config"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-inline>

      <generate-form-item
        v-else
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
        :config="config"
      >
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </generate-form-item>
    </template>
  </van-cell-group>
</template>

<script>
import { generateGroupMixin } from '../../mixins/generateGroup';
import { defineAsyncComponent } from 'vue';

export default {
  name: 'FmVantGroup',
  mixins: [generateGroupMixin],
  components: {
    GenerateFormItem: defineAsyncComponent(() => import('./GenerateFormItem.vue')),
    GenerateColItem: defineAsyncComponent(() => import('./GenerateColItem.vue')),
    GenerateInline: defineAsyncComponent(() => import('./GenerateInline.vue')),
    GenerateTabItem: defineAsyncComponent(() => import('./GenerateTabItem.vue')),
    GenerateCollapse: defineAsyncComponent(() => import('./GenerateCollapse.vue')),
    GenerateCard: defineAsyncComponent(() => import('./GenerateCard.vue'))
  }
}
</script>

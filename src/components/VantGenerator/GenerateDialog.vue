<template>
  <fm-vant-dialog
    v-model="visible"
    :title="element.options.title"
    :ref="`generate-dialog-${element.model}`"
    :closable="element.options.showClose"
    :class="{
      [element.options && element.options.customClass]: element.options && element.options.customClass ? true : false
    }"
    @open="handleOpen"
    @close="handleClose"
  >
    <div>
      <template v-for="item in element.list">
        <generate-col-item
          v-if="item.type == 'grid'"
          :key="`grid-${item.key}`"
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
          :config="config"
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
          :config="config"
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
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-collapse>

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
          :config="config"
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
          :config="config"
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
          :config="config"
          :group="element.model"
          :field-node="element.model"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </generate-form-item>
      </template>
    </div>
    <template #footer>
      <van-button block @click="handleCancel" v-if="element.options.showCancel">{{element.options.cancelText}}</van-button>
      <van-button block type="primary" @click="handleConfirm" :loading="element.options.confirmLoading" v-if="element.options.showOk">{{element.options.okText}}</van-button>
    </template>
  </fm-vant-dialog>
</template>

<script>
import GenerateFormItem from './GenerateFormItem.vue'
import GenerateColItem from './GenerateColItem.vue'
import GenerateTabItem from './GenerateTabItem.vue'
import GenerateInline from './GenerateInline.vue'
import GenerateCollapse from './GenerateCollapse.vue'
import GenerateCard from './GenerateCard.vue'
import FmVantDialog from './components/Dialog.vue'
import { generateDialogMixin } from '../../mixins/generateDialog'

export default {
  name: 'generate-dialog',
  components: {
    GenerateColItem,
    GenerateFormItem,
    GenerateInline,
    GenerateTabItem,
    GenerateCollapse,
    GenerateCard,
    FmVantDialog
  },
  mixins: [generateDialogMixin],
  methods: {
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
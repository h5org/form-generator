<template>
  <el-dialog
    v-model="visible"
    @on-close="handleClose"
    ref="formulaDialog"
    width="800px"
    :close-on-click-modal="false"
    :show-close="false"
    draggable
    destroy-on-close
    append-to-body	
    class="fm-formula-dialog"
  >
    <div class="fm-formula-panel-dialog-container">
      <FormulaPanelIndex v-model="formulaValue" :showArguments="showArguments" :showRow="showRow"></FormulaPanelIndex>
    </div>
    <template #footer>
      <span >
        <el-button @click="handleClose">{{$t('fm.actions.cancel')}}</el-button>
        <el-button type="primary" @click="handleSubmit" >{{$t('fm.actions.confirm')}}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import CusDialog from '../CusDialog.vue'
import FormulaPanelIndex from './index.vue'
import { ElMessage } from '../../util/message'

export default {
  components: {
    CusDialog,
    FormulaPanelIndex
  },
  emits: ['dialog-close', 'dialog-confirm'],
  data: () => ({
    visible: false,
    scriptList: [],
    formulaValue: '',
    showArguments: true,
    showRow: true
  }),
  methods: {
    open (val, opts = {showArguments: true, showRow: true}) {
      this.formulaValue = val ?? ''
      this.visible = true

      this.showArguments = opts?.showArguments ?? true
      this.showRow = opts?.showRow ?? true
    },

    handleClose () {
      this.$emit('dialog-close')
      this.visible = false
    },

    handleSubmit () {

      try {
        new Function('args', `return ${this.formulaValue}`)

        this.$emit('dialog-confirm', this.formulaValue)
        this.visible = false
      } catch (error) {
        ElMessage({
          message: this.$t('fm.message.jsError') + error.message,
          type: 'error'
        }, this)
      }
    }
  }
}
</script>

<style lang="scss">
.fm-condition-panel-dialog-container{
  border: 1px solid var(--el-border-color-lighter);
}
.fm-formula-dialog{
  .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
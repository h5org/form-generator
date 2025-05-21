<template>
  <div class="form-table" style="width: 100%;">
    <TransitionGroup name="tableitem">
      <div
        v-for="(t, index) in (paging ? pagingLength : tableData)"
        :key="tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key']"
      >
        <van-cell-group border
          style="margin-bottom: 8px;"
        >
          <template #title v-if="showControl">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center;">
                <van-checkbox 
                  v-if="widget.options.selection" 
                  style="margin-right: 10px;" 
                  shape="square"
                  :modelValue="selectedRowKeys.includes(tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key'])"
                  @update:modelValue="handleCheckSelectChange((paging ? pageSize * (currentPage - 1) : 0) + index, $event)"
                  
                >
                  #{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}
                </van-checkbox>
                <div v-else>#{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</div>
              </div>

              <van-button
                type="danger"
                plain
                hairline
                round
                size="mini"
                :disabled="disableddata"
                v-if="!printRead && isDelete"
                @click="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)"
              >
                <i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i>
              </van-button>
            </div>
          </template>

          <template v-for="column in columns" :key="column.key">
            <generate-form-item
              :models="tableData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :widget="column"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="tableHideFields"
              :sub-disabled-fields="tableDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-table="true"
              :is-mobile="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :table-name="name"
              :config="config"
              :is-dialog="isDialog"
              :dialog-name="dialogName"
              :is-group="false"
              :group="group ? `${group}.${name}` : name"
              :field-node="`${fieldNode}.${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
            >
              <template v-slot:[blank.name]="scope" v-for="blank in blanks">
                <slot :name="blank.name" :model="scope.model"></slot>
              </template>
            </generate-form-item>
          </template>
        </van-cell-group>
      </div>
    </TransitionGroup>

    <div v-if="!disableddata && isAdd">
      <van-button
        type="primary"
        plain
        hairline
        size="small"
        block
        @click="handleAddRow"
      >
        <i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>
        {{$t('fm.actions.add')}}
      </van-button>
    </div>

    <div v-if="paging && tableData.length" style="padding-top: 8px;">
      <van-pagination 
        v-model="currentPage" 
        :total-items="tableData.length" 
        :items-per-page="pageSize"  
        @change="handlePageChange"
        mode="simple"
      />
    </div>
  </div>
</template>

<script>
import { formTableMixin } from '../../mixins/formTable'
import { defineAsyncComponent } from 'vue'
import GenerateFormItem from './GenerateFormItem.vue';

export default {
  components: {
    GenerateFormItem: defineAsyncComponent(() => import('./GenerateFormItem.vue'))
  },
  data () {
    return {
      selectedRowKeys: [],
    }
  },
  mixins: [formTableMixin],
  computed: {
    checkSelectLength () {
      return this.selectedRowKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item).length
    },
  },
  methods: {
    handleRemove (index) {
      const removeData = {...this.tableData[index]}

      const tmpdata = [...this.tableData]
      tmpdata.splice(index, 1)
      this.tableData = tmpdata

      if (this.widget.events && this.widget.events.onRowRemove) {
        let funcKey = this.widget.events.onRowRemove

        this.eventFunction[funcKey]({
          removeIndex: index, 
          removeData: removeData,
          field: this.widget.model,
          currentRef: this,
          group: this.group,
          fieldNode: this.fieldNode
        })
      }

      this.changeItem = {}

      this.pagingData = []
      this.pagingLength = 0

      if (this.paging) {
        this.$nextTick(() => {
          if (this.tableData.length % this.pageSize == 0 && this.currentPage > parseInt(this.tableData.length / this.pageSize)) {
            this.currentPage = parseInt(this.tableData.length / this.pageSize)
          }

          this.loadPagingData()

          this.calcCheckStatus()

        })
      }
    },
    calcCheckStatus () {
      const checkSelectLength = this.selectedRowKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item).length

      if (checkSelectLength == 0) {
        this.checkAll = false
        this.checkIndeterminate = false
      } else if (checkSelectLength == this.tableData.length) {
        this.checkAll = true
        this.checkIndeterminate = false
      } else {
        this.checkAll = false
        this.checkIndeterminate = true
      }
    },

    handleCheckSelectChange (index, val) {
      if (val) {
        if (!this.selectedRowKeys.includes(this.tableData[index]['fm_key'])) {
          this.selectedRowKeys.push(this.tableData[index]['fm_key'])
        }
      } else {
        if (this.selectedRowKeys.includes(this.tableData[index]['fm_key'])) {
          this.selectedRowKeys.splice(this.selectedRowKeys.indexOf(this.tableData[index]['fm_key']), 1)
        }
      }

      this.$nextTick(() => {
        this.calcCheckStatus()
      })
    },
    getSelection () {
      return this.selectedRowKeys.map(item => {
          return this.tableData.find(titem => titem.fm_key == item)
        }).filter(item => item)
    },

    clearSelection () {
      this.selectedRowKeys = []
    },
  }
}
</script>

<style>
.tableitem-enter-active,
.tableitem-leave-active {
  transition: all 0.3s ease;
}

.tableitem-enter-from,
.tableitem-leave-to {
  opacity: 0;
}

</style>
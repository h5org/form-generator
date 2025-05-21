<template>
  <div class="form-subform" style="width: 100%;">
    <TransitionGroup name="subitem">
      <div
        v-for="(t, index) in (paging ? pagingLength : subformData)"
        :key="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]['fm_key']"
      >
        <van-cell-group border
          style="margin-bottom: 8px;"
        >
          <template #title v-if="showControl">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div >#{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</div>
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

          <template v-for="item in list" :key="item.key">
            <generate-col-item
              v-if="item.type == 'grid'"
              :model="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :element="item"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="subHideFields"
              :sub-disabled-fields="subDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-subform="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :sub-name="name"
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
            </generate-col-item>

            <generate-tab-item
              v-else-if="item.type == 'tabs'"
              :model="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :element="item"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="subHideFields"
              :sub-disabled-fields="subDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-subform="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :sub-name="name"
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
            </generate-tab-item>

            <generate-collapse
              v-else-if="item.type == 'collapse'"
              :model="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :element="item"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="subHideFields"
              :sub-disabled-fields="subDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-subform="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :sub-name="name"
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
            </generate-collapse>

            <generate-card
              v-else-if="item.type == 'card'"
              :model="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :element="item"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="subHideFields"
              :sub-disabled-fields="subDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-subform="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :sub-name="name"
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
            </generate-card>

            <generate-inline
              v-else-if="item.type == 'inline'"
              :model="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :element="item"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="subHideFields"
              :sub-disabled-fields="subDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-subform="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :sub-name="name"
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
            </generate-inline>

            <generate-form-item
              v-else
              :models="subformData[(paging ? pageSize * (currentPage - 1) : 0) + index]"
              :rules="rules"
              :widget="item"
              :remote="remote"
              :blanks="blanks"
              :display="displayFields"
              :sub-hide-fields="subHideFields"
              :sub-disabled-fields="subDisabledFields"
              :edit="!disableddata"
              :remote-option="remoteOption"
              :platform="platform"
              :preview="preview"
              :container-key="containerKey"
              :data-source-value="dataSourceValue"
              :event-function="eventFunction"
              :print-read="printRead"
              :is-subform="true"
              :row-index="(paging ? pageSize * (currentPage - 1) : 0) + index"
              :sub-name="name"
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
      <van-button plain hairline type="primary" size="small" block @click="handleAddRow">
        <i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>{{$t('fm.actions.add')}}
      </van-button>
    </div>

    <div v-if="paging && subformData.length" style="padding-top: 8px;">
      <van-pagination 
        v-model="currentPage" 
        :total-items="subformData.length" 
        :items-per-page="pageSize"  
        @change="handlePageChange"
        mode="simple"
      />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { subFormMixin } from '../../mixins/subForm';

export default {
  name: 'fm-vant-subform',
  components: {
    GenerateFormItem: defineAsyncComponent(() => import('./GenerateFormItem.vue')),
    GenerateColItem: defineAsyncComponent(() => import('./GenerateColItem.vue')),
    GenerateInline: defineAsyncComponent(() => import('./GenerateInline.vue')),
    GenerateTabItem: defineAsyncComponent(() => import('./GenerateTabItem.vue')),
    GenerateCollapse: defineAsyncComponent(() => import('./GenerateCollapse.vue')),
    GenerateCard: defineAsyncComponent(() => import('./GenerateCard.vue'))
  },
  mixins: [subFormMixin]
}
</script>

<style>
.subitem-enter-active,
.subitem-leave-active {
  transition: all 0.3s ease;
}
.subitem-enter-from,
.subitem-leave-to {
  opacity: 0;
  /* transform: translateX(30px); */
}
</style>
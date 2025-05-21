<template>
  <div class="form-subform">
    <div class="form-subform-item" 
      v-for="(t, index) in (paging ? pagingLength : subformData)"
      :key="(paging ? pageSize * (currentPage - 1) : 0) + index"
      @mouseover.stop="handleMouseover((paging ? pageSize * (currentPage - 1) : 0) + index)"
      @mouseout="handleMouseout((paging ? pageSize * (currentPage - 1) : 0) + index)"
      :ref="`formSubformItem_${(paging ? pageSize * (currentPage - 1) : 0) + index}`"
    >
      <div class="form-subform-index" v-if="showControl">
        <a-tag color="processing">#{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</a-tag>
      </div>
      <div class="form-subform-remove" v-if="showControl">
        <a-popconfirm :disabled="disableddata" v-if="!printRead && isDelete" :title="$t('fm.description.deleteConfirm')" @confirm="handleRemove((paging ? pageSize * (currentPage - 1) : 0) + index)">
          
          <a-button :disabled="disableddata" danger size="small" shape="circle"><i class="fm-iconfont icon-trash" style="font-size: 12px; margin: 5px;"></i></a-button>
          
        </a-popconfirm>
        <a-tag color="processing" v-if="printRead || !isDelete">#{{(paging ? pageSize * (currentPage - 1) : 0) + index + 1}}</a-tag>
      </div>
      <div class="form-subform-content">
        <template v-for="item in list">
          <generate-col-item
            v-if="item.type == 'grid'"
            :key="`grid-${item.key}`" 
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
            :key="`tabs-${item.key}`"
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
            :key="`collapse-${item.key}`"
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

          <generate-report
            v-else-if="item.type == 'report'"
            :key="`report-${item.key}`"
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
          </generate-report>

          <generate-card
            v-else-if="item.type == 'card'"
            :key="`card-${item.key}`"
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
            :key="`inline-${item.key}`"
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
            :key="`form-item-${item.key}`"
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
      </div>
    </div>

    <a-row class="form-subform-action">
      <a-col :md="(preview && platform != 'mobile') || !preview ? 12 : 24" :sm="24">
        <a-button type="link" @click="handleAddRow" v-if="!disableddata && isAdd">
          <i class="fm-iconfont icon-plus" style="font-size: 12px; margin: 5px;"></i>{{$t('fm.actions.add')}}
        </a-button>
        
      </a-col>
      <a-col :md="((preview && platform != 'mobile') || !preview) && !disableddata ? 12 : 24" :xs="24" :sm="24">
        <a-pagination
          style="float: right; padding-top: 5px;white-space: nowrap;"
          layout="total, prev, pager, next"
          :page-size="pageSize"
          v-model:current="currentPage"
          :total="subformData.length"
          :pager-count="5"
          @change="handlePageChange"
          v-if="paging && subformData.length"
          show-less-items
        >
        </a-pagination>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { subFormMixin } from '../../mixins/subForm';

export default {
  name: 'fm-sub-form',
  components: {
    GenerateColItem: defineAsyncComponent(() => import('./GenerateColItem.vue')),
    GenerateFormItem: defineAsyncComponent(() => import('./GenerateFormItem.vue')),
    GenerateInline: defineAsyncComponent(() => import('./GenereteInline.vue')),
    GenerateReport: defineAsyncComponent(() => import('./GenerateReport.vue')),
    GenerateTabItem: defineAsyncComponent(() => import('./GenerateTabItem.vue')),
    GenerateCollapse: defineAsyncComponent(() => import('./GenerateCollapse.vue')),
    GenerateCard: defineAsyncComponent(() => import('./GenerateCard.vue'))
  },
  mixins: [subFormMixin]
}
</script>

<style lang="scss">
.form-subform{
  .form-subform-item{
    display: flex;
    padding: 6px;

    &.is-hover{
      background-color: #fafafa;

      >.form-subform-index{
        display: none;
      }
      >.form-subform-remove{
        display: block;
      }
    }

    .form-subform-index{
      width: 50px;
      text-align: center;
    }

    .form-subform-content{
      flex: 1;

      >.fm-report-table__wrapper{
        margin: 0;
      }
    }

    .form-subform-remove{
      width: 50px;
      text-align: center;
      display: none;
    }
  }
}
html.dark{
  .form-subform{
    .form-subform-item{

      &.is-hover{
        background-color: #1d1d1d;
      }
    }
  }
}
</style>

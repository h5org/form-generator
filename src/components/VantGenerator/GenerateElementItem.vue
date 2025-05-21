<template>
  <template v-if="widget.type == 'blank'">
    <van-field
      v-bind="publicProps"
      :disabled="elementDisabled"
    >
      <template #input>
        <slot :name="widget.model" :model="dataModels"></slot>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'component'">
    <van-field
      v-bind="publicProps"
      :disabled="elementDisabled"
    >
      <template #input>
        <component :style="{width: '100%'}" :is="`component-${widget.key}-${key}`" :key="key" v-model="dataModel" :ref="'fm-'+widget.model"></component>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'custom'">
    <component 
      :is="widget.el" 
      v-model="dataModel"
      :width="widget.options.width"
      :height="widget.options.height"
      :placeholder="widget.options.placeholder"
      :readonly="widget.options.readonly"
      :disabled="elementDisabled"
      :editable="widget.options.editable"
      :clearable="widget.options.clearable"
      :ref="'fm-'+widget.model"
      :print-read="printRead"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
      v-on="dynamicEvents"
    ></component>
  </template>

  <template v-if="widget.type == 'input'">
    <van-field
      v-model="dataModel"
      :placeholder="widget.options.placeholder"
      :maxlength="Number(widget.options.maxlength || Infinity)"
      :show-word-limit="widget.options.showWordLimit"
      :disabled="elementDisabled"
      :clearable="widget.options.clearable"
      :type="widget.options.showPassword ? 'password' : 'text'"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
      :readonly="printRead"
      :key="printRead"
      :ref="'fm-'+widget.model"
    >
      <template #input v-if="printRead">
        <span>{{ dataModel }}</span>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'textarea'">
    <van-field
      v-model="dataModel"
      :placeholder="widget.options.placeholder"
      :maxlength="Number(widget.options.maxlength || Infinity)"
      :show-word-limit="widget.options.showWordLimit"
      :autosize="widget.options.autosize"
      :rows="widget.options.rows"
      type="textarea"
      :clearable="widget.options.clearable"
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
      :readonly="printRead"
      :key="printRead"
      :ref="'fm-'+widget.model"
    >
      <template #input v-if="printRead">
        <pre>{{dataModel}}</pre>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'number'">
    <van-field 
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
      :readonly="printRead"
    >
      <template #input>
        <span v-if="printRead">{{dataModel.toFixed(widget.options.precision)}}</span>
        <van-stepper
          v-else
          v-model.number="dataModel"
          :disabled="elementDisabled"
          :min="widget.options.min"
          :max="widget.options.max"
          :step="widget.options.step"
          :decimal-length="widget.options.precision"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></van-stepper>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'radio'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
      :readonly="printRead"
    >
      <template #input>
        <template v-if="printRead">
          <template v-if="widget.options.remote">
            {{
              remoteOptions.find(item => item.value == dataModel) 
              && remoteOptions.find(item => item.value == dataModel).label
            }}
          </template>
          <template v-else>
            {{
              widget.options.showLabel ? 
              (remoteOptions.find(item => item.value == dataModel) && remoteOptions.find(item => item.value == dataModel).label) :
              dataModel
            }}
          </template>
        </template>
        <van-radio-group v-else v-model="dataModel"
          :direction="widget.options.inline ? 'horizontal' : 'vertical'"
          :disabled="elementDisabled"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <van-radio
            v-for="(item, index) in widget.options.options" :key="item.value + index"
            :name="item.value"
            style="margin-bottom: 8px;"
          >
            {{widget.options.showLabel ? item.label : item.value}}
          </van-radio>
        </van-radio-group>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'checkbox'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
      :readonly="printRead"
    >
      <template #input>
        <template v-if="printRead">
          <template v-if="widget.options.remote">
            {{
              dataModel?.map(dm => 
                remoteOptions.find(item => item.value == dm) 
                && remoteOptions.find(item => item.value == dm).label
              ).join('、')
              
            }}
          </template>
          <template v-else>
            {{
              widget.options.showLabel ? 
              dataModel?.map(dm => remoteOptions.find(item => item.value == dm) && remoteOptions.find(item => item.value == dm).label).join('、') :
              dataModel?.join('、')
            }}
          </template>
        </template>
        <van-checkbox-group 
          v-else
          v-model="dataModel" 
          :direction="widget.options.inline ? 'horizontal' : 'vertical'"
          :disabled="elementDisabled"
          shape="square"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <van-checkbox 
            style="margin-bottom: 8px;"
            :name="item.value" 
            v-for="(item, index) in widget.options.options" :key="item.value + index">
            {{widget.options.showLabel ? item.label : item.value}}
          </van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'time'">
    <van-field
      v-model="dataModel"
      :placeholder="widget.options.placeholder"
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
      :is-link="!printRead"
      @click="onShowPicker('time')"
      :ref="'fm-'+widget.model"
      readonly
    ></van-field>
    <van-popup v-model:show="showPicker" round position="bottom" teleport="body" z-index="5000">
      <van-time-picker
        :model-value="pickerValue"
        :columns-type="timeColumnsType"
        v-bind="{...widget.options.customProps, ...extendProps}"
        @confirm="onPickerConfirm"
        @cancel="showPicker = false"
      ></van-time-picker>
    </van-popup>
  </template>

  <template v-if="widget.type == 'date'">
    <van-field
      :modelValue="dateLocalString"
      :placeholder="widget.options.placeholder"
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
      :is-link="!printRead"
      :ref="'fm-'+widget.model"
      @click="onShowPicker('date')"
      readonly
    ></van-field>
    <van-calendar 
      :default-date="pickerValue"
      v-model:show="showPicker"
      switch-mode="year-month"
      :type="calendarType"
      v-bind="{...widget.options.customProps, ...extendProps}"
      @confirm="onCalendarConfirm" 
      teleport="body" z-index="5000"
    >
    </van-calendar>
  </template>

  <template v-if="widget.type == 'rate'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
      :readonly="printRead"
    >
      <template #input>
        <van-rate 
          :readonly="printRead"
          v-model="dataModel" 
          :count="widget.options.max" 
          :allow-half="widget.options.allowHalf"
          :disabled="elementDisabled" 
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></van-rate>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'select'">
    <fm-vant-select
      v-model="dataModel"
      :placeholder="widget.options.placeholder"
      :disabled="elementDisabled"
      :customProps="widget.options.customProps"
      :extendProps="extendProps"
      :publicProps="publicProps"
      :columns="remoteOptions"
      :multiple="widget.options.multiple"
      :print-read="printRead"
      :ref="'fm-'+widget.model"
    >
    </fm-vant-select>
  </template>

  <template v-if="widget.type == 'switch'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
      :readonly="printRead"
    >
      <template #input>
        <van-switch 
          v-model="dataModel" 
          :disabled="elementDisabled || printRead"
          size="20"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></van-switch>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'slider'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
      :readonly="printRead"
    >
      <template #input>
        <template v-if="printRead">
          {{dataModel}}
        </template>
        <van-slider 
          v-else
          v-model="dataModel" 
          :disabled="elementDisabled"
          :min="widget.options.min"
          :max="widget.options.max"
          :step="widget.options.step"
          :range="widget.options.range"
          v-bind="{...widget.options.customProps, ...extendProps}"
          :ref="'fm-'+widget.model"
        ></van-slider>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'text'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
    >
      <template #input>
        <span :ref="'fm-'+widget.model">{{dataModel}}</span>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'html'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
    >
      <template #input>
        <span v-html="dataModel" :ref="'fm-'+widget.model"></span>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'button'">
    <van-field
      v-if="!printRead"
      v-bind="{...publicProps}"
      :disabled="elementDisabled">
      <template #input>
        <van-button
          block
          :type="widget.options.buttonType || 'default'" 
          :size="widget.options.buttonSize == 'large' ? 'normal' : 
            widget.options.buttonSize == 'default' ? 'small' : 
            widget.options.buttonSize == 'small' ? 'mini' : 'small'"
          :plain="widget.options.buttonPlain" 
          :round="widget.options.buttonRound"
          :disabled="elementDisabled"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @click="handleOnClick"
          :ref="'fm-'+widget.model"
        >
          {{widget.options.buttonName}}
        </van-button>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'cascader'">
    <fm-vant-cascader
      v-model="dataModel"
      :placeholder="widget.options.placeholder"
      :disabled="elementDisabled"
      :customProps="widget.options.customProps"
      :extendProps="extendProps"
      :publicProps="publicProps"
      :options="remoteOptions"
      :title="widget.name"
      :is-path-value="true"
      :print-read="printRead"
      :ref="'fm-'+widget.model"
    ></fm-vant-cascader>
  </template>

  <template v-if="widget.type == 'treeselect'">
    <fm-vant-cascader
      v-model="dataModel"
      :placeholder="widget.options.placeholder"
      :disabled="elementDisabled"
      :customProps="widget.options.customProps"
      :extendProps="extendProps"
      :publicProps="publicProps"
      :options="remoteOptions"
      :title="widget.name"
      :is-path-value="false"
      :print-read="printRead"
      :ref="'fm-'+widget.model"
    ></fm-vant-cascader>
  </template>

  <template v-if="widget.type == 'steps'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-steps 
          :active="dataModel" 
          :direction="widget.options.direction"
          :active-color="widget.options.activeColor"
          :inactive-color="widget.options.inactiveColor"
          v-bind="{...widget.options.customProps, ...extendProps}" 
          style="width: 100%;"
          :ref="'fm-'+widget.model"
        >
          <van-step v-for="(item, index) in remoteOptions" :key="index">
            <h3>{{item.title}}</h3>
            <p>{{item.description}}</p>
          </van-step>
        </van-steps>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'pagination'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-pagination
          v-model="dataModel"
          :items-per-page	="widget.options.pageSize"
          :show-page-size="widget.options.pagerCount"
          :disabled="elementDisabled"
          :total-items="widget.options.total"
          v-bind="{...widget.options.customProps, ...extendProps}"
          force-ellipses
          :ref="'fm-'+widget.model"
        >
        <template #prev-text>
          <van-icon name="arrow-left" />
        </template>
        <template #next-text>
          <van-icon name="arrow" />
        </template>
        </van-pagination>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'imgupload'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
    >
      <template #input>
        <fm-vant-uploader
          v-model="dataModel"
          :disabled="elementDisabled"
          :readonly="widget.options.readonly || printRead"
          :width="widget.options.size.width"
          :height="widget.options.size.height"
          :token="remoteToken"
          :domain="widget.options.domain"
          :multiple="widget.options.multiple"
          :limit="widget.options.limit"
          :is-qiniu="widget.options.isQiniu"
          :is-delete="widget.options.isDelete"
          :is-edit="widget.options.isEdit"
          :action="widget.options.action"
          :headers="widget.options.headers || []"
          :is-image="true"
          :ref="'fm-'+widget.model"
          @on-upload-success="handleOnUploadSuccess"
          @on-upload-error="handleOnUploadError"
          @on-upload-remove="handleOnUploadRemove"
          @on-upload-progress="handleOnUploadProgress"
          :on-select="handleOnUploadSelect"
        ></fm-vant-uploader>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'fileupload'">
    <van-field
      v-bind="{...publicProps}"
      :disabled="elementDisabled"
    >
      <template #input>
        <fm-vant-uploader
          v-model="dataModel"
          :disabled="elementDisabled"
          :readonly="widget.options.readonly || printRead"
          :token="remoteToken"
          :domain="widget.options.domain"
          :multiple="widget.options.multiple"
          :limit="widget.options.limit"
          :is-qiniu="widget.options.isQiniu"
          :is-delete="widget.options.isDelete"
          :is-edit="widget.options.isEdit"
          :action="widget.options.action"
          :headers="widget.options.headers || []"
          :ref="'fm-'+widget.model"
          :is-image="false"
          @on-upload-success="handleOnUploadSuccess"
          @on-upload-error="handleOnUploadError"
          @on-upload-remove="handleOnUploadRemove"
          @on-upload-progress="handleOnUploadProgress"
          :on-select="handleOnUploadSelect"
        ></fm-vant-uploader>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'table'">
    <van-field
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
    >
      <template #input>
        <fm-vant-form-table
          v-model:value="dataModel"
          :columns="widget.tableColumns"
          :models="dataModels"
          :remote="remote"
          :blanks="blanks"
          :disableddata="elementDisabled || printRead"
          :rules="rules"
          :name="widget.model"
          :remote-option="remoteOption"
          :ref="'fm-'+widget.model"
          :preview="preview"
          :platform="platform"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :widget="widget"
          :container-key="containerKey"
          :print-read="printRead"
          :paging="widget.options.paging"
          :page-size="widget.options.pageSize"
          :config="config"
          :is-add="widget.options.isAdd ?? true"
          :is-delete="widget.options.isDelete ?? true"
          :show-control="widget.options.showControl ?? true"
          :is-dialog="isDialog"
          :dialog-name="dialogName"
          :is-group="isGroup"
          :group="group"
          :field-node="fieldNode"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </fm-vant-form-table>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'subform'">
    <van-field
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
    >
      <template #input>
        <fm-vant-subform
          v-model:value="dataModel"
          :list="widget.list"
          :models="dataModels"
          :remote="remote"
          :blanks="blanks"
          :disableddata="elementDisabled || printRead"
          :rules="rules"
          :name="widget.model"
          :remote-option="remoteOption"
          :ref="'fm-'+widget.model"
          :preview="preview"
          :platform="platform"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :widget="widget"
          :print-read="printRead"
          :paging="widget.options.paging"
          :page-size="widget.options.pageSize"
          :config="config"
          :container-key="containerKey"
          :show-control="widget.options.showControl"
          :is-delete="widget.options.isDelete ?? true"
          :is-add="widget.options.isAdd ?? true"
          :is-dialog="isDialog"
          :dialog-name="dialogName"
          :is-group="isGroup"
          :group="group"
          :field-node="fieldNode"
        >
          <template v-slot:[blank.name]="scope" v-for="blank in blanks">
            <slot :name="blank.name" :model="scope.model"></slot>
          </template>
        </fm-vant-subform>
      </template>
    </van-field>
  </template>

  <template v-if="widget.type == 'group'">
    <van-field
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...widget.options.customProps, ...extendProps}"
    >
      <template #input>
        <fm-vant-group
          v-model:value="dataModel"
          :rules="rules"
          :element="widget"
          :remote="remote"
          :blanks="blanks"
          :edit="!elementDisabled"
          :remote-option="remoteOption"
          :platform="platform"
          :preview="preview"
          :container-key="containerKey"
          :data-source-value="dataSourceValue"
          :event-function="eventFunction"
          :print-read="printRead"
          :ref="'fm-'+widget.model"
          :is-group="isGroup"
          :group="group"
          :field-node="fieldNode"
          :config="config"
        >

        </fm-vant-group>
      </template>
    </van-field>
  </template>
</template>

<script>
import {generateElementItemMixin} from '../../mixins/generateElementItem.js'
import FmVantGroup from './GenerateGroup.vue'
import FmVantSubform from './SubForm.vue'
import { defineAsyncComponent, readonly } from 'vue'
import { getTimeColumnsType, parseTimeToArray, formatTimeValue } from '../../util/time.js'
import FmVantSelect from './components/Select.vue'
import FmVantCascader from './components/Cascader.vue'
import FmVantUploader from './components/Uploader.vue'

export default {
  components: {
    FmVantGroup,
    FmVantSubform,
    FmVantSelect,
    FmVantCascader,
    FmVantUploader,
    FmVantFormTable: defineAsyncComponent(() => import('./FormTable.vue')),
  },
  mixins: [generateElementItemMixin],
  props: ['config', 'label', 'labelWidth'],
  data () {
    return {
      showPicker: false,
      pickerValue: [],
      pickerType: '',
    }
  },
  computed: {
    publicProps () {
      return {
        label: this.label,
        labelWidth: this.labelWidth,
        labelAlign: this.widget.options.labelWrap ? 'top' : this.config.labelPosition,
        required: this.widget.options.required,
        class: {
          [this.widget.options && this.widget.options.customClass]: this.widget.options.customClass ? true : false,
        },
        rules: this.rules[this.groupNode],
        name: this.fieldNode,
      }
    },

    timeColumnsType () {
      return getTimeColumnsType(this.widget.options.format || 'HH:mm:ss')
    },

    dateLocalString () {
      if (this.calendarType === 'range') {
        return this.dataModel.map(item => new Date(item).toLocaleDateString()).join(' ~ ')
      }
      if (Array.isArray(this.dataModel)) {
        return this.dataModel.map(item => new Date(item).toLocaleDateString()).join('、')
      }
      return this.dataModel ? new Date(this.dataModel).toLocaleDateString() : ''
    },

    calendarType () {
      if (this.widget.options.type === 'daterange' || this.widget.options.type === 'datetimerange' || this.widget.options.type === 'monthrange') {
        return 'range'
      }

      if (this.widget.options.type === 'dates') {
        return 'multiple'
      }

      return 'single'
    }
  },
  methods: {
    onPickerConfirm ({selectedValues : values}) {
      if (this.pickerType === 'time') {
        this.dataModel = formatTimeValue(values, this.widget.options.format || 'HH:mm:ss')
      }
      this.showPicker = false
      this.pickerType = ''
    },
    onCalendarConfirm (value) {
      if (Array.isArray(value)) {
        this.dataModel = value.map(item => this.widget.options.timestamp ? item.getTime() : item.toLocaleDateString())
      } else {
        this.dataModel = this.widget.options.timestamp ? value.getTime() : value.toLocaleDateString()
      }
      this.showPicker = false
      this.pickerType = ''
    },
    onShowPicker (type) {
      if (this.printRead) return ;
      this.pickerType = type
      if (type == 'time') {
        this.pickerValue = parseTimeToArray(this.dataModel, this.widget.options.format || 'HH:mm:ss')
      }
      if (type == 'date') {
        this.pickerValue = (() => {
          if (Array.isArray(this.dataModel)) {
            return this.dataModel.map(item => new Date(item))
          }
          return new Date(this.dataModel)
        })()
      }
      this.showPicker = true
    },

    loadOptions (data) {
      if (!Array.isArray(data)) return
      this.remoteOptions = data.map(item => {

        if (this.widget.type == 'cascader' || this.widget.type == 'treeselect') {
          if (this.widget.options.props.children && this.widget.options.props.children.length && Object.keys(item).includes(this.widget.options.props.children)) {
            return {
              value: item[this.widget.options.props.value],
              text: item[this.widget.options.props.label],
              children: this.processRemoteProps(item[this.widget.options.props.children], this.widget.options.props)
            }
          }

          return {
            value: item[this.widget.options.props.value],
            text: item[this.widget.options.props.label],
          }
        }
        
        if (this.widget.options.props.children && this.widget.options.props.children.length && Object.keys(item).includes(this.widget.options.props.children)) {
          return {
            value: item[this.widget.options.props.value],
            text: this.widget.options.showLabel ? item[this.widget.options.props.label] : item[this.widget.options.props.value],
            children: this.processRemoteProps(item[this.widget.options.props.children], this.widget.options.props)
          }
        } else {
          if (this.widget.type == 'steps') {
            return {
              title: item[this.widget.options.props.title],
              description: item[this.widget.options.props.description]
            }
          } else if (this.widget.type == 'transfer') {
            return {
              key: item[this.widget.options.props.key],
              title: item[this.widget.options.props.label],
              disabled: item[this.widget.options.props.disabled]
            }
          } else {
            return {
              value: item[this.widget.options.props.value],
              text: this.widget.options.showLabel ? item[this.widget.options.props.label] : item[this.widget.options.props.value]
            }
          }
        }
      })
    },
    processRemoteProps (children, props) {
      if (children && children.length) {
        return children.map(item => {
          if (this.processRemoteProps(item[props.children], props).length) {
            return {
              value: item[props.value],
              text: item[props.label],
              children: this.processRemoteProps(item[props.children], props)
            }
          } else{
            return {
              value: item[props.value],
              text: item[props.label],
            }
          }
        })
      } else {
        return []
      }
    },
  }
}
</script>
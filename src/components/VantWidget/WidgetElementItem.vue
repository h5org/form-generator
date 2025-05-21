<template>
  <template v-if="element.type == 'input'">
    <van-field
      :modelValue="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :maxlength="Number(element.options.maxlength || Infinity)"
      :show-word-limit="element.options.showWordLimit"
      :disabled="elementDisabled"
      :clearable="element.options.clearable"
      v-bind="{...publicProps, ...element.options.customProps, ...extendProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
    ></van-field>
  </template>

  <template v-if="element.type == 'textarea'">
    <van-field
      type="textarea"
      :rows="element.options.rows"
      :autosize="element.options.autosize"
      :modelValue="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :maxlength="Number(element.options.maxlength || Infinity)"
      :show-word-limit="element.options.showWordLimit"
      :disabled="elementDisabled"
      :clearable="element.options.clearable"
      v-bind="{...publicProps, ...element.options.customProps, ...extendProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
    ></van-field>
  </template>

  <template v-if="element.type == 'number'">
    <van-field 
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-stepper
          v-model.number="element.options.defaultValue"
          :disabled="elementDisabled"
          v-bind="{...element.options.customProps, ...extendProps}"
          :min="element.options.min"
          :max="element.options.max"
          :step="element.options.step"
          :decimal-length="element.options.precision"
        ></van-stepper>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'radio'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-radio-group 
          v-model="element.options.defaultValue" 
          :direction="element.options.inline ? 'horizontal' : 'vertical'"
          :disabled="elementDisabled"
          v-bind="{...element.options.customProps, ...extendProps}"
        >
          <van-radio 
            style="margin-bottom: 8px;"
            :name="item.value" 
            v-for="(item, index) in element.options.options" :key="item.value + index">
            {{element.options.showLabel ? item.label : item.value}}
          </van-radio>
        </van-radio-group>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'checkbox'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-checkbox-group 
          v-model="element.options.defaultValue" 
          :direction="element.options.inline ? 'horizontal' : 'vertical'"
          :disabled="elementDisabled"
          shape="square"
          v-bind="{...element.options.customProps, ...extendProps}"
        >
          <van-checkbox 
            style="margin-bottom: 8px;"
            :name="item.value" 
            v-for="(item, index) in element.options.options" :key="item.value + index">
            {{element.options.showLabel ? item.label : item.value}}
          </van-checkbox>
        </van-checkbox-group>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'time'">
    <van-field
      :modelValue="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...element.options.customProps, ...extendProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      is-link
    ></van-field>
  </template>

  <template v-if="element.type == 'date'">
    <van-field
      :modelValue="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :disabled="elementDisabled"
      v-bind="{...publicProps, ...element.options.customProps, ...extendProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      is-link
    ></van-field>
  </template>

  <template v-if="element.type == 'rate'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-rate 
          v-model="element.options.defaultValue" 
          :count="element.options.max" 
          :allow-half="element.options.allowHalf"
          :disabled="elementDisabled" 
          v-bind="{...element.options.customProps, ...extendProps}"
        ></van-rate>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'color'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="true"
      :model-value="'Not Found'"
    ></van-field>
  </template>

  <template v-if="element.type == 'select'">
    <fm-vant-select
      :modelValue="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :disabled="elementDisabled"
      :publicProps="publicProps"
      :customProps="element.options.customProps"
      :extendProps="extendProps"
      :multiple="element.options.multiple"
      :columns="selectOptions"
    ></fm-vant-select>
  </template>

  <template v-if="element.type == 'switch'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-switch 
          v-model="element.options.defaultValue" 
          :disabled="elementDisabled" 
          v-bind="{...element.options.customProps, ...extendProps}"
          size="20"
        ></van-switch>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'slider'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-slider 
          v-model="element.options.defaultValue" 
          :disabled="elementDisabled" 
          v-bind="{...element.options.customProps, ...extendProps}"
          :min="element.options.min"
          :max="element.options.max"
          :step="element.options.step"
          :range="element.options.range"
        ></van-slider>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'text'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <span>{{element.options.defaultValue}}</span>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'html'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <span v-html="element.options.defaultValue"></span>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'button'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-button 
          block
          :type="element.options.buttonType || 'default'" 
          :size="element.options.buttonSize == 'large' ? 'normal' : 
            element.options.buttonSize == 'default' ? 'small' : 
            element.options.buttonSize == 'small' ? 'mini' : 'small'"
          :plain="element.options.buttonPlain" 
          :round="element.options.buttonRound"
          :disabled="elementDisabled" 
          v-bind="{...element.options.customProps, ...extendProps}" 
        >
          {{element.options.buttonName}}
        </van-button>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'link'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="true"
      :model-value="'Not Found'"
    ></van-field>
  </template>

  <template v-if="element.type == 'cascader'">
    <fm-vant-cascader
      v-model="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :disabled="elementDisabled"
      :customProps="element.options.customProps"
      :extendProps="extendProps"
      :publicProps="publicProps"
      :options="selectOptions"
      :is-path-value="true"
    ></fm-vant-cascader>
  </template>

  <template v-if="element.type == 'treeselect'">
    <fm-vant-cascader
      v-model="element.options.defaultValue"
      :placeholder="element.options.placeholder"
      :disabled="elementDisabled"
      :customProps="element.options.customProps"
      :extendProps="extendProps"
      :publicProps="publicProps"
      :options="selectOptions"
      :is-path-value="false"
    ></fm-vant-cascader>
  </template>

  <template v-if="element.type == 'steps'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-steps 
          :active="element.options.defaultValue" 
          :direction="element.options.direction"
          :active-color="element.options.activeColor"
          :inactive-color="element.options.inactiveColor"
          v-bind="{...element.options.customProps, ...extendProps}" 
          style="width: 100%;"
        >
          <van-step v-for="(item, index) in element.options.steps" :key="index">
            <h3>{{item.title}}</h3>
            <p>{{item.description}}</p>
          </van-step>
        </van-steps>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'transfer'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="true"
      :model-value="'Not Found'"
    ></van-field>
  </template>

  <template v-if="element.type == 'pagination'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <van-pagination
          v-model="element.options.defaultValue"
          :items-per-page	="element.options.pageSize"
          :show-page-size="element.options.pagerCount"
          :disabled="elementDisabled"
          :total-items="element.options.total"
          v-bind="{...element.options.customProps, ...extendProps}"
          force-ellipses
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

  <template v-if="element.type == 'blank'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <div style="color: #999;text-align:center;width: 100%;">{{element.model}}</div>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'component'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <component :style="{width: '100%'}" :is="`component-${element.key}`" :key="key" v-model="element.options.defaultValue"></component>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'fileupload'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <fm-vant-uploader
          v-model="element.options.defaultValue"
          :disabled="elementDisabled"
          :readonly="element.options.readonly"
          token="xxx"
          domain="xxx"
          :multiple="element.options.multiple"
          :limit="element.options.limit"
          :is-qiniu="element.options.isQiniu"
          :is-delete="element.options.isDelete"
          :is-edit="element.options.isEdit"
          :action="element.options.action"
          :headers="element.options.headers || []"
          :is-image="false"
        ></fm-vant-uploader>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'imgupload'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="elementDisabled"
    >
      <template #input>
        <fm-vant-uploader
          v-model="element.options.defaultValue"
          :disabled="elementDisabled"
          :readonly="element.options.readonly"
          :width="element.options.size.width"
          :height="element.options.size.height"
          token="xxx"
          domain="xxx"
          :multiple="element.options.multiple"
          :limit="element.options.limit"
          :is-qiniu="element.options.isQiniu"
          :is-delete="element.options.isDelete"
          :is-edit="element.options.isEdit"
          :action="element.options.action"
          :headers="element.options.headers || []"
        ></fm-vant-uploader>
      </template>
    </van-field>
  </template>

  <template v-if="element.type == 'editor'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="true"
      :model-value="'Not Found'"
    ></van-field>
  </template>

  <template v-if="element.type == 'list'">
    <van-field
      v-bind="{...publicProps}"
      :class="{
        [element.options && element.options.customClass]: element.options.customClass ? true : false,
      }"
      :disabled="true"
      :model-value="'Not Found'"
    ></van-field>
  </template>

  <template v-if="element.type == 'custom'">
    <component  
      :is="element.el" 
      v-model="element.options.defaultValue"
      :width="element.options.width"
      :height="element.options.height"
      :placeholder="element.options.placeholder"
      :readonly="element.options.readonly"
      :disabled="elementDisabled"
      :editable="element.options.editable"
      :clearable="element.options.clearable"
      v-bind="{...publicProps, ...element.options.customProps, ...extendProps}"
    ></component>
  </template>
</template>

<script>
import { widgetElementItemMixin } from '../../mixins/widgetElementItem.js'
import FmVantSelect from '../VantGenerator/components/Select.vue'
import FmVantCascader from '../VantGenerator/components/Cascader.vue'
import FmVantUploader from '../VantGenerator/components/Uploader.vue'

export default {
  components: {
    FmVantSelect,
    FmVantCascader,
    FmVantUploader
  },
  name: 'VantWidgetElementItem',
  mixins: [widgetElementItemMixin],
  props: ['label', 'labelWidth', 'config'],
  computed: {
    publicProps () {
      return {
        label: this.label,
        labelWidth: this.labelWidth,
        labelAlign: this.element.options.labelWrap ? 'top' : this.config.labelPosition,
        required: this.element.options.required,
        class: {
          [this.element.options && this.element.options.customClass]: this.element.options.customClass ? true : false,
        }
      }
    },

    selectOptions () {
      return this.element.options.options.map(item => {
        if (this.element.type == 'cascader' || this.element.type == 'treeselect') {
          if (this.element.options.props.children && this.element.options.props.children.length && Object.keys(item).includes(this.element.options.props.children)) {
            return {
              value: item[this.element.options.props.value],
              text: item[this.element.options.props.label],
              children: this.processRemoteProps(item[this.element.options.props.children], this.element.options.props)
            }
          }

          return {
            value: item[this.element.options.props.value],
            text: item[this.element.options.props.label],
          }
        }

        return {
          text: this.element.options.showLabel ? item.label : item.value,
          value: item.value
        }
      })
    },
  },
  methods: {
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

<template>
  <span :class="{'print-read-label': printRead}">
    <template v-if="widget.type == 'blank'">
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <slot :name="widget.model" :model="dataModels"></slot>
      </div>
      
    </template>

    <template v-if="widget.type == 'component'">  
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <component :is="`component-${widget.key}-${key}`" :key="key" v-model="dataModel" :ref="'fm-'+widget.model"></component>
      </div>
    </template>

    <template v-if="widget.type == 'custom'">  
      <div :style="{width: isTable ? '100%' : widget.options.width}">
        <component 
          :is="widget.el" 
          v-model="dataModel"
          :width="widget.options.width"
          :height="widget.options.height"
          :size="config.size"
          :placeholder="widget.options.placeholder"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :ref="'fm-'+widget.model"
          :print-read="printRead"
          v-bind="{...widget.options.customProps, ...extendProps}"
          v-on="dynamicEvents"
        ></component>
      </div>
    </template>

    <template v-if="widget.type == 'input'" >
      <template v-if="printRead">
        <span>{{dataModel}}</span>
      </template>
      <template v-else>
        <template v-if="widget.options.showPassword" >
          <a-input-password 
            :type="widget.options.dataTypeCheck ? widget.options.dataType : 'text'"
            v-model:value="dataModel"
            :disabled="elementDisabled"
            :placeholder="widget.options.placeholder"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :ref="'fm-'+widget.model"
            :size="config.size"
            :allow-clear="widget.options.clearable"
            v-bind="{...widget.options.customProps, ...extendProps}"
            @focus="handleOnFocus"
            @blur="handleOnBlur"
            autocomplete="off"
          />
        </template>
        <template v-else>
          <a-input
            :type="widget.options.dataTypeCheck ? widget.options.dataType : 'text'"
            v-model:value="dataModel"
            :disabled="elementDisabled"
            :placeholder="widget.options.placeholder"
            :style="{width: isTable ? '100%' : widget.options.width}"
            :ref="'fm-'+widget.model"
            :size="config.size"
            :allow-clear="widget.options.clearable"
            :maxlength="Number(widget.options.maxlength || Infinity)"
            :show-count="widget.options.showWordLimit"
            v-bind="{...widget.options.customProps, ...extendProps}"
            @focus="handleOnFocus"
            @blur="handleOnBlur"
            autocomplete="off"
          ></a-input>
        </template>
      </template>
    </template>

    <template v-if="widget.type == 'textarea'">
      <template v-if="printRead">
        <pre>{{dataModel}}</pre>
      </template>
      <template v-else>
        <a-textarea type="textarea" :rows="widget.options.rows"
          v-model:value="dataModel"
          :disabled="elementDisabled"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          :allow-clear="widget.options.clearable"
          :size="config.size"
          :maxlength="Number(widget.options.maxlength)"
          :show-count="widget.options.showWordLimit"
          :autoSize="widget.options.autosize"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></a-textarea>
      </template>
    </template>

    <template v-if="widget.type == 'number'">
      <template v-if="printRead">
        <span>{{dataModel.toFixed(widget.options.precision)}}</span>
      </template>
      <template v-else>
        <a-input-number 
          v-model:value="dataModel" 
          :style="{width: isTable ? '100%' : widget.options.width}"
          :step="widget.options.step"
          :disabled="elementDisabled"
          :min="widget.options.min"
          :max="widget.options.max"
          :controls-position="widget.options.controlsPosition"
          :precision="widget.options.precision"
          :controls="widget.options.controls"
          :ref="'fm-'+widget.model"
          :size="config.size"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></a-input-number>
      </template>
    </template>

    <template v-if="widget.type == 'radio'">
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
      <template v-else>
        <a-radio-group v-model:value="dataModel"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :disabled="elementDisabled"
          :size="config.size"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <a-radio
            :style="{display: widget.options.inline ? 'inline-flex' : 'flex', lineHeight: '30px'}"
            :value="item.value" v-for="(item, index) in remoteOptions" :key="index"
          >
            <template v-if="widget.options.remote">{{item.label}}</template>
            <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
          </a-radio>
        </a-radio-group>
      </template>
    </template>

    <template v-if="widget.type == 'checkbox'">
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
      <template v-else>
        <a-checkbox-group v-model:value="dataModel"
          :style="{
            width: isTable ? '100%' : widget.options.width,
            display: 'flex',
            'flex-wrap': 'wrap',
            'flex-direction': widget.options.inline ? 'row' : 'column'
          }"
          :disabled="elementDisabled"
          :size="config.size"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <a-checkbox
            
            :style="{
              'line-height': '30px'
            }"
            :value="item.value" v-for="(item, index) in remoteOptions" :key="index"
          >
            <template v-if="widget.options.remote">{{item.label}}</template>
            <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
          </a-checkbox>
        </a-checkbox-group>
      </template>
    </template>

    <template v-if="widget.type == 'time'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <a-time-picker 
          v-if="!widget.options.isRange"
          v-model:value="dataModel"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :inputReadOnly="!widget.options.editable"
          :clearable="widget.options.clearable"
          :arrowControl="widget.options.arrowControl"
          :value-format="widget.options.format"
          :format="widget.options.format"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          :size="config.size"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          popupClassName="fm-popup-index"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </a-time-picker>
        <a-time-range-picker 
          v-else
          v-model:value="dataModel"
          :placeholder="[widget.options.startPlaceholder, widget.options.endPlaceholder]"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :inputReadOnly="!widget.options.editable"
          :clearable="widget.options.clearable"
          :arrowControl="widget.options.arrowControl"
          :value-format="widget.options.format"
          :format="widget.options.format"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          :size="config.size"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          popupClassName="fm-popup-index"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </a-time-range-picker>
      </template>
    </template>

    <template v-if="widget.type=='date'">
      <template v-if="printRead">
        {{
          widget.options.type == 'dates' ? 
          dataModel?.join('、') :
          typeof dataModel == 'object' ? dataModel.join(' ~ ')  : dataModel
          
        }}
      </template>
      <template v-else>
        <a-date-picker
          v-model:value="dataModel"
          :picker="widget.options.type == 'datetime' ? 'date' : widget.options.type"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :inputReadOnly="!widget.options.editable"
          :clearable="widget.options.clearable"
          :value-format="widget.options.timestamp ? 'x' : widget.options.format"
          :format="widget.options.format"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          :size="config.size"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :show-time="widget.options.type == 'datetime'"
          popupClassName="fm-popup-index"
          v-if="widget.options.type != 'dates' && widget.options.type != 'daterange' && widget.options.type != 'datetimerange' && widget.options.type != 'monthrange'"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </a-date-picker>
        <a-range-picker
          v-model:value="dataModel"
          :placeholder="[widget.options.startPlaceholder, widget.options.endPlaceholder]"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :inputReadOnly="!widget.options.editable"
          :clearable="widget.options.clearable"
          :value-format="widget.options.timestamp ? 'x' : widget.options.format"
          :format="widget.options.format"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          :size="config.size"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :show-time="widget.options.type == 'datetimerange'"
          :picker="widget.options.type == 'monthrange' ? 'month' : 'date'"
          v-if="widget.options.type == 'daterange' || widget.options.type == 'datetimerange' || widget.options.type == 'monthrange'"
          popupClassName="fm-popup-index"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </a-range-picker>
      </template>
    </template>

    <template v-if="widget.type =='rate'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <a-rate v-model:value="dataModel"
          :max="widget.options.max"
          :count="widget.options.max"
          :disabled="elementDisabled"
          :allow-half="widget.options.allowHalf"
          :show-score="widget.options.showScore"
          :ref="'fm-'+widget.model"
          :size="config.size"
          :style="{width: isTable ? '100%' : widget.options.width}"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></a-rate>
      </template>
    </template>

    <template v-if="widget.type == 'color'">
      <div :style="{width: isTable ? '100%' : widget.options.width, color: '#999'}">
        Not currently supported.
      </div>
    </template>

    <template v-if="widget.type == 'select'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            typeof dataModel == 'object' ?
            (dataModel?.map(dm => remoteOptions.find(item => item.value == dm) 
            && remoteOptions.find(item => item.value == dm).label).join('、'))
            : (remoteOptions.find(item => item.value == dataModel) 
            && remoteOptions.find(item => item.value == dataModel).label)
          }}
        </template>
        <template v-else>
          {{
            widget.options.showLabel ? 
            (
              typeof dataModel == 'object' ? 
              dataModel?.map(dm => remoteOptions.find(item => item.value == dm) && remoteOptions.find(item => item.value == dm).label).join('、')
              : (remoteOptions.find(item => item.value == dataModel) && remoteOptions.find(item => item.value == dataModel).label)
            ) :
            typeof dataModel == 'object' ? dataModel.join('、') : dataModel
          }}
        </template>
      </template>
      <template v-else>
        <a-select
          v-model:value="dataModel"
          :disabled="elementDisabled"
          :mode="widget.options.multiple ? 'multiple' : 'default'"
          :allow-clear="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :show-search="widget.options.filterable"
          option-filter-prop="label"
          :ref="'fm-'+widget.model"
          :size="config.size"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          popupClassName="fm-select-dropdown"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <a-select-option v-for="item in remoteOptions" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value">
            {{widget.options.showLabel || widget.options.remote?item.label:item.value}}
          </a-select-option>
        </a-select>
      </template>
    </template>

    <template v-if="widget.type=='switch'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <a-switch
          v-model:checked="dataModel"
          :disabled="elementDisabled"
          :ref="'fm-'+widget.model"
          :size="config.size"
        >
        </a-switch>
      </template>
    </template>

    <template v-if="widget.type=='slider'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <a-slider 
          v-model:value="dataModel"
          :min="widget.options.min"
          :max="widget.options.max"
          :disabled="elementDisabled"
          :step="widget.options.step"
          :show-input="widget.options.showInput"
          :range="widget.options.range"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          :size="config.size"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></a-slider>
      </template>
    </template>

    <template v-if="widget.type=='imgupload'">
      <fm-upload
        v-model="dataModel"
        :disabled="elementDisabled"
        :readonly="widget.options.readonly || printRead"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :width="widget.options.size.width"
        :height="widget.options.size.height"
        :token="remoteToken"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :is-delete="widget.options.isDelete"
        :min="widget.options.min"
        :is-edit="widget.options.isEdit"
        :action="widget.options.action"
        ui="antd"
        :headers="widget.options.headers || []"
        :ref="'fm-'+widget.model"
        :withCredentials="widget.options.withCredentials"
        @on-upload-success="handleOnUploadSuccess"
        @on-upload-error="handleOnUploadError"
        @on-upload-remove="handleOnUploadRemove"
        @on-upload-progress="handleOnUploadProgress"
        :on-select="handleOnUploadSelect"
        :print-read="printRead"
        :size="config.size"
      >
      </fm-upload>
    </template>

    <template v-if="widget.type == 'editor'">
      <template v-if="printRead">
        <div v-html="dataModel" class="ql-editor"></div>
      </template>
      <template v-else>

        <Editor
          v-model="dataModel"
          :custom-style="{width: isTable ? '100%' : widget.options.width, cursor: (elementDisabled) ? 'no-drop' : '', backgroundColor: (elementDisabled) ? '#F5F7FA' : ''}"
          :toolbar="widget.options.customToolbar"
          :disabled="elementDisabled"
          :ref="'fm-'+widget.model"
        ></Editor>
      </template>
    </template>

    <template v-if="widget.type == 'cascader'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            widget.options.multiple ?
            dataModel?.map(dm => getCascaderText([...dm], remoteOptions).join(' / ')).join('、')
            : getCascaderText([...dataModel], remoteOptions).join(' / ')
          }}
        </template>
        <template v-else>
          {{
            widget.options.multiple ?
            dataModel?.map(dm => getCascaderText([...dm], remoteOptions).join(' / ')).join('、')
            : getCascaderText([...dataModel], remoteOptions).join(' / ')
          }}
        </template>
      </template>
      <template v-else>
        <a-cascader
          v-model:value="dataModel"
          :disabled="elementDisabled"
          :allow-clear="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :options="remoteOptions"
          :ref="'fm-'+widget.model"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :showSearch="widget.options.filterable"
          :change-on-select="widget.options.checkStrictly"
          popupClassName="fm-popup-index"
          :multiple="widget.options.multiple"
          :size="config.size"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >

        </a-cascader>
      </template>
    </template>

    <template v-if="widget.type == 'treeselect'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            typeof dataModel == 'object' ?
              dataModel?.map(dm => getTreeText(dm, remoteOptions)).join('、')
              : getTreeText(dataModel, remoteOptions)
          }}
        </template>
        <template v-else>
          {{
            typeof dataModel == 'object' ? 
              dataModel?.map(dm => getTreeText(dm, remoteOptions)).join('、')
              : getTreeText(dataModel, remoteOptions)
          }}
        </template>
      </template>
      <template v-else>
         <a-tree-select
          v-model:value="dataModel"
          :disabled="elementDisabled"
          :allow-clear="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :tree-data="remoteOptions"
          :ref="'fm-'+widget.model"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :multiple="widget.options.multiple"
          :showSearch="widget.options.filterable"
          popupClassName="fm-popup-index"
          :size="config.size"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </a-tree-select>
      </template>
    </template>

    <template v-if="widget.type == 'text'">
      <span :ref="'fm-'+widget.model" :style="{width: isTable ? '100%' : (widget.options.width || '100%'), display: 'inline-block'}">{{dataModel}}</span>
    </template>

    <template v-if="widget.type == 'html'">
      <span v-html="dataModel" :ref="'fm-'+widget.model" :style="{width: isTable ? '100%' : (widget.options.width || '100%'), display: 'inline-block'}"></span>
    </template>

    <template v-if="widget.type == 'table'">
      <fm-form-table
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
      </fm-form-table>
    </template>

    <template v-if="widget.type == 'subform'">
      <fm-sub-form
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
      </fm-sub-form>
    </template>

    <template v-if="widget.type == 'group'">
      <fm-group
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
        <template v-slot:[blank.name]="scope" v-for="blank in blanks">
          <slot :name="blank.name" :model="scope.model"></slot>
        </template>
      </fm-group>
    </template>

    <template v-if="widget.type == 'fileupload'">
      <fm-file-upload
        v-model="dataModel"
        :disabled="elementDisabled"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :token="remoteToken"
        :domain="widget.options.domain"
        :multiple="widget.options.multiple"
        :limit="widget.options.limit"
        :is-qiniu="widget.options.isQiniu"
        :min="widget.options.min"
        :action="widget.options.action"
        ui="antd"
        :headers="widget.options.headers || []"
        :ref="'fm-'+widget.model"
        :withCredentials="widget.options.withCredentials"
        :print-read="printRead"
        @on-upload-success="handleOnUploadSuccess"
        @on-upload-error="handleOnUploadError"
        @on-upload-remove="handleOnUploadRemove"
        @on-upload-progress="handleOnUploadProgress"
        :on-select="handleOnUploadSelect"
        :size="config.size"
        :accept="widget.options.accept"
      >
      </fm-file-upload>
    </template>

    <template v-if="widget.type == 'button'">
      <a-button
        :disabled="elementDisabled"
        :size="widget.options.buttonSize"
        :type="widget.options.buttonType == 'text' ? 'link' : widget.options.buttonType || 'default'"
        :shape="widget.options.buttonCircle ? 'circle' : (widget.options.buttonRound ? 'round' : null)"
        :ghost="widget.options.buttonPlain"
        :style="{width: widget.options.width}"
        :ref="'fm-'+widget.model"
        @click="handleOnClick"
        v-bind="{...widget.options.customProps, ...extendProps}"
      >{{widget.options.buttonName}}
      </a-button>
    </template>

    <template v-if="widget.type == 'link'">
      <div :style="{width: isTable ? '100%' : widget.options.width, color: '#999'}">
        <a-button 
          type="link"
          :danger="widget.options.linkType == 'danger'"
          :disabled="elementDisabled"
          :href="widget.options.href"
          :target="widget.options.blank ? '_blank' : '_self'"
          :ref="'fm-'+widget.model"
          @click="handleOnClick"
          :style="{width: isTable ? '100%' : widget.options.width}"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          {{widget.options.linkName}}
        </a-button>
      </div>
    </template>

    <template v-if="widget.type == 'steps'">
      <a-steps :current="dataModel" 
        :ref="'fm-'+widget.model"
        :space="widget.options.space"
        :direction="widget.options.direction"
        :status="widget.options.processStatus"
        :style="{'line-height': 'normal'}"
        v-bind="{...widget.options.customProps, ...extendProps}"
      >
        <template v-for="(item, index) in remoteOptions" :key="index">
           <a-step 
            :title="item.title" 
            :description="item.description"  ></a-step>
        </template>
      </a-steps>
    </template>

    <template v-if="widget.type == 'pagination'">
      <template v-if="printRead">
        Page {{dataModel}}
      </template>
      <template v-else>
        <a-pagination
          v-model:current="dataModel"
          :page-size="widget.options.pageSize"
          :pager-count="widget.options.pagerCount"
          :disabled="widget.options.disabled"
          :background="widget.options.background"
          :total="widget.options.total"
          :show-total="total => `${$t('fm.config.widget.total')} ${total}`"
          show-less-items
          :show-size-changer="false"
          :size="widget.options.background ? '' : 'small'"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        />
      </template>
      
    </template>

    <template v-if="widget.type == 'transfer'">
      <template v-if="printRead">
        <template v-if="widget.options.remote">
          {{
            dataModel?.map(dm => remoteOptions.find(item => 
              item.key == dm)?.title).join('、')
          }}
        </template>
        <template v-else>
          {{
            dataModel?.map(dm => remoteOptions.find(item => 
              item.key == dm)?.label).join('、')
          }}
        </template>
      </template>
      <template v-else>
        <a-transfer
          v-model:target-keys="dataModel"
          :disabled="elementDisabled"
          :data-source="widget.options.remote ? remoteOptions : dataOnly"
          :render="item => `${item.title}`"
          :showSearch="widget.options.filterable"
          :titles="widget.options.titles"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></a-transfer>
      </template>
    </template>

    <template v-if="widget.type == 'list'">
      <fm-data-table 
        :ref="'fm-'+widget.model"
        v-model="dataModel"
        :columns="widget.options.columns"
        :showOperation="widget.options.showOperation"
        :operations="widget.options.operations"
        :pagination="widget.options.pagination"
        :style="{'width': isTable ? '100%' : widget.options.width}"
        :max-height="widget.options.maxHeight"
        :stripe="widget.options.stripe"
        :border="widget.options.border"
        :highlight="widget.options.highlight"
        :selection="widget.options.selection"
        :size="config.size"
        :print-read="printRead"
        @on-page-change="handlePageChange"
        @on-current-row="handleCurrentRow"
        @on-operate="handleOperate"
        @on-selection-change="handleSelectionChange"
      ></fm-data-table>
    </template>
  </span>
</template>

<script>
import FmUpload from '../Upload/index.vue'
import FmFormTable from './FormTable.vue'
import FmFileUpload from '../Upload/file.vue'
import Editor from '../Editor/index.vue'
import FmSubForm from './SubForm.vue'
import FmGroup from './GenerateGroup.vue'
import { inject } from 'vue'
import FmDataTable from '../DataTable/Antd/index.vue'
import {generateElementItemMixin} from '../../mixins/generateElementItem'

export default {
  name: 'generate-element-item',
  components: {
    FmUpload,
    FmFormTable,
    FmFileUpload,
    Editor,
    FmSubForm,
    FmGroup,
    FmDataTable
  },
  mixins: [generateElementItemMixin],
  setup () {
    const useInjectFormItemContext = inject('useInjectFormItemContext')

    const formItemContext = useInjectFormItemContext ? useInjectFormItemContext() : null

    return {
      formItemContext
    }
  },
  data () {
    return {
      dataOnly : this.widget.options?.data?.map(item => ({...item, title: item.label})),
    }
  },
  methods: {
    loadOptions (data) {
      if (!Array.isArray(data)) return
      this.remoteOptions = data.map(item => {
        
        if (this.widget.options.props.children && this.widget.options.props.children.length && Object.keys(item).includes(this.widget.options.props.children)) {
          return {
            value: item[this.widget.options.props.value],
            label: item[this.widget.options.props.label],
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
              label: item[this.widget.options.props.label]
            }
          }
        }
        
      })
    },
    handleOperate ({funcKey, column, row, record}) {
      return this.eventFunction[funcKey]({
        field: this.widget.model, 
        currentRef: this.$refs['fm-'+this.widget.model], 
        group: this.group,
        fieldNode: this.fieldNode,
        column: column,
        row: {...row},
        record: record
      })
    },
  },
  watch: {
    dataModel (val, oldValue) {
      if (JSON.stringify(val) != JSON.stringify(oldValue)) {
        this.$emit('update:modelValue', val)

        setTimeout(() => {
          this.formItemContext && this.formItemContext.onFieldChange()
        })
      }
    },
  }
}
</script>

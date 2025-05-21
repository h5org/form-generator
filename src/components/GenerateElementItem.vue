<template>
  <div :class="{'print-read-label': printRead}" style="width: 100%;">
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
        <el-input 
          v-if="widget.options.dataTypeCheck && (widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float')"
          type="number"
          v-model.number="dataModel"
          :disabled="elementDisabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :show-password="widget.options.showPassword"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input>
        <el-input 
          v-else
          :type="widget.options.dataTypeCheck ? widget.options.dataType : 'text'"
          v-model="dataModel"
          :disabled="elementDisabled"
          :placeholder="widget.options.placeholder"
          :show-password="widget.options.showPassword"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :clearable="widget.options.clearable"
          :ref="'fm-'+widget.model"
          :maxlength="widget.options.maxlength"
          :show-word-limit="widget.options.showWordLimit"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input>
      </template>
      
    </template>

    <template v-if="widget.type == 'textarea'">
      <template v-if="printRead">
        <pre>{{dataModel}}</pre>
      </template>
      <template v-else>
        <el-input type="textarea" :rows="widget.options.rows"
          v-model="dataModel"
          :disabled="elementDisabled"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :clearable="widget.options.clearable"
          :ref="'fm-'+widget.model"
          :maxlength="widget.options.maxlength"
          :show-word-limit="widget.options.showWordLimit"
          :autosize="widget.options.autosize"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input>
      </template>
    </template>

    <template v-if="widget.type == 'number'">
      <template v-if="printRead">
        <span>{{typeof dataModel == 'number' ? dataModel.toFixed(widget.options.precision) : dataModel}}</span>
      </template>
      <template v-else>
        <el-input-number 
          v-model="dataModel" 
          :style="{width: isTable ? '100%' : widget.options.width}"
          :step="widget.options.step"
          :disabled="elementDisabled"
          :min="widget.options.min"
          :max="widget.options.max"
          :controls-position="widget.options.controlsPosition"
          :precision="widget.options.precision"
          :controls="widget.options.controls"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        ></el-input-number>
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
        <el-radio-group v-model="dataModel"
          :style="{width: isTable ? '100%' : widget.options.width, display: 'block'}"
          :disabled="elementDisabled"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <el-radio
            :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
            :value="item.value" :label="item.value" v-for="(item, index) in remoteOptions" :key="index"
          >
            <template v-if="widget.options.remote">{{item.label}}</template>
            <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
          </el-radio>
        </el-radio-group>
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
        <el-checkbox-group v-model="dataModel"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :disabled="elementDisabled"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
          <el-checkbox
            
            :style="{display: widget.options.inline ? 'inline-block' : 'block'}"
            :label="item.value" :value="item.value" v-for="(item, index) in remoteOptions" :key="index"
          >
            <template v-if="widget.options.remote">{{item.label}}</template>
            <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
          </el-checkbox>
        </el-checkbox-group>
      </template>
    </template>

    <template v-if="widget.type == 'time'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <el-time-picker 
          v-model="dataModel"
          :is-range="widget.options.isRange"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :arrowControl="widget.options.arrowControl"
          :value-format="widget.options.format"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        >
        </el-time-picker>
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
        <el-date-picker
          v-model="dataModel"
          :type="widget.options.type"
          :placeholder="widget.options.placeholder"
          :start-placeholder="widget.options.startPlaceholder"
          :end-placeholder="widget.options.endPlaceholder"
          :readonly="widget.options.readonly"
          :disabled="elementDisabled"
          :editable="widget.options.editable"
          :clearable="widget.options.clearable"
          :value-format="widget.options.timestamp ? 'x' : widget.options.format"
          :format="widget.options.format"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        >
        </el-date-picker>
      </template>
    </template>

    <template v-if="widget.type =='rate'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <el-rate v-model="dataModel"
          :max="widget.options.max"
          :disabled="elementDisabled"
          :allow-half="widget.options.allowHalf"
          :show-score="widget.options.showScore"
          :ref="'fm-'+widget.model"
          :style="{width: isTable ? '100%' : widget.options.width, display: 'inline-block'}"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></el-rate>
      </template>
    </template>

    <template v-if="widget.type == 'color'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <el-color-picker 
          v-model="dataModel"
          :disabled="elementDisabled"
          :show-alpha="widget.options.showAlpha"
          :ref="'fm-'+widget.model"
          :style="{width: isTable ? '100%' : widget.options.width}"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></el-color-picker>
      </template>
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
        <el-select
          v-model="dataModel"
          :disabled="elementDisabled"
          :multiple="widget.options.multiple"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :filterable="widget.options.filterable"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
        >
          <el-option v-for="item in remoteOptions" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
        </el-select>
      </template>
    </template>

    <template v-if="widget.type=='switch'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <el-switch
          v-model="dataModel"
          :disabled="elementDisabled"
          :ref="'fm-'+widget.model"
          :style="{width: isTable ? '100%' : widget.options.width}"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </el-switch>
      </template>
    </template>

    <template v-if="widget.type=='slider'">
      <template v-if="printRead">
        {{dataModel}}
      </template>
      <template v-else>
        <el-slider 
          v-model="dataModel"
          :min="widget.options.min"
          :max="widget.options.max"
          :disabled="elementDisabled"
          :step="widget.options.step"
          :show-input="widget.options.showInput"
          :range="widget.options.range"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></el-slider>
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
        :headers="widget.options.headers || []"
        :ref="'fm-'+widget.model"
        :withCredentials="widget.options.withCredentials"
        :print-read="printRead"
        @on-upload-success="handleOnUploadSuccess"
        @on-upload-error="handleOnUploadError"
        @on-upload-remove="handleOnUploadRemove"
        @on-upload-progress="handleOnUploadProgress"
        :on-select="handleOnUploadSelect"
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
        <el-cascader
          v-model="dataModel"
          :disabled="elementDisabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :options="remoteOptions"
          @change="onCascaderChange"
          :ref="'fm-'+widget.model"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :props="propsModel"
          collapse-tags
          :filterable="widget.options.filterable"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </el-cascader>
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
         <el-tree-select
          v-model="dataModel"
          :disabled="elementDisabled"
          :clearable="widget.options.clearable"
          :placeholder="widget.options.placeholder"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :data="remoteOptions"
          :ref="'fm-'+widget.model"
          @focus="handleOnFocus"
          @blur="handleOnBlur"
          :multiple="widget.options.multiple"
          :check-strictly="widget.options.checkStrictly"
          :filterable="widget.options.filterable"
          v-bind="{...widget.options.customProps, ...extendProps}"
        >
        </el-tree-select>
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
        :print-read="printRead"
        :paging="widget.options.paging"
        :page-size="widget.options.pageSize"
        :is-delete="widget.options.isDelete ?? true"
        :is-add="widget.options.isAdd ?? true"
        :show-control="widget.options.showControl ?? true"
        :is-dialog="isDialog"
        :dialog-name="dialogName"
        :is-group="isGroup"
        :group="group"
        :field-node="fieldNode"
        :container-key="containerKey"
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
        :show-control="widget.options.showControl"
        :is-delete="widget.options.isDelete ?? true"
        :is-add="widget.options.isAdd ?? true"
        :is-dialog="isDialog"
        :dialog-name="dialogName"
        :is-group="isGroup"
        :group="group"
        :field-node="fieldNode"
        :container-key="containerKey"
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
        :headers="widget.options.headers || []"
        :ref="'fm-'+widget.model"
        :withCredentials="widget.options.withCredentials"
        :print-read="printRead"
        :accept="widget.options.accept"
        @on-upload-success="handleOnUploadSuccess"
        @on-upload-error="handleOnUploadError"
        @on-upload-remove="handleOnUploadRemove"
        @on-upload-progress="handleOnUploadProgress"
        :on-select="handleOnUploadSelect"
      >
      </fm-file-upload>
    </template>

    <template v-if="widget.type == 'button'">
      <el-button
        :disabled="elementDisabled"
        :size="widget.options.buttonSize"
        :type="widget.options.buttonType == 'text' || widget.options.buttonType == 'link' ? 'primary' : widget.options.buttonType"
        :text="widget.options.buttonType == 'text'"
        :link="widget.options.buttonType == 'link'"
        :plain="widget.options.buttonPlain"
        :round="widget.options.buttonRound"
        :circle="widget.options.buttonCircle"
        :style="{width: widget.options.width}"
        :ref="'fm-'+widget.model"
        v-bind="{...widget.options.customProps, ...extendProps}"
        @click="handleOnClick"
      >{{widget.options.buttonName}}
      </el-button>
    </template>

    <template v-if="widget.type == 'link'">
      <el-link
        :disabled="elementDisabled"
        :type="widget.options.linkType"
        :underline="widget.options.underline"
        :href="widget.options.href"
        :target="widget.options.blank ? '_blank' : '_self'"
        :ref="'fm-'+widget.model"
        @click="handleOnClick"
        :style="{width: isTable ? '100%' : widget.options.width}"
        v-bind="{...widget.options.customProps, ...extendProps}"
      >
        {{widget.options.linkName}}
      </el-link>
    </template>

    <template v-if="widget.type == 'steps'">
      <el-steps :active="dataModel" 
        :ref="'fm-'+widget.model"
        :space="widget.options.space"
        :direction="widget.options.direction"
        :process-status="widget.options.processStatus"
        :finish-status="widget.options.finishStatus"
        :align-center="widget.options.alignCenter"
        :simple="widget.options.simple"
        :style="{'line-height': 'normal'}"
        v-if="remoteOptions && remoteOptions.length > 0"
        v-bind="{...widget.options.customProps, ...extendProps}"
      >
        <el-step 
          :title="item.title" 
          :description="item.description" 
          v-for="(item, index) in remoteOptions" :key="index"></el-step>
      </el-steps>
    </template>

    <template v-if="widget.type == 'pagination'">
      <template v-if="printRead">
        Page {{dataModel}}
      </template>
      <template v-else>
        <el-pagination
          v-model:currentPage="dataModel"
          :page-size="widget.options.pageSize"
          :pager-count="widget.options.pagerCount"
          :disabled="widget.options.disabled"
          :background="widget.options.background"
          layout="total, prev, pager, next"
          :total="widget.options.total"
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
              item[widget.options.props.key] == dm)?.[widget.options.props.label]).join('、')
          }}
        </template>
        <template v-else>
          {{
            dataModel?.map(dm => remoteOptions.find(item => 
              item[propsTransfer.key] == dm)?.[propsTransfer.label]).join('、')
          }}
        </template>
      </template>
      <template v-else>
         <el-transfer
          :model-value="dataModel"
          :disabled="elementDisabled"
          :data="remoteOptions"
          :filterable="widget.options.filterable"
          :props="widget.options.remote ? widget.options.props : propsTransfer"
          :titles="widget.options.titles"
          :style="{width: isTable ? '100%' : widget.options.width}"
          :ref="'fm-'+widget.model"
          @change="handleTransferChange"
          v-bind="{...widget.options.customProps, ...extendProps}"
        ></el-transfer>
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
        :print-read="printRead"
        @on-page-change="handlePageChange"
        @on-current-row="handleCurrentRow"
        @on-operate="handleOperate"
        @on-selection-change="handleSelectionChange"
      ></fm-data-table>
    </template>
  </div>
</template>

<script>
import FmUpload from './Upload/index.vue'
import FmFormTable from './FormTable/index.vue'
import FmFileUpload from './Upload/file.vue'
import FmSubForm from './SubForm/index.vue'
import FmGroup from './GenerateGroup.vue'
import Editor from './Editor/index.vue'
import FmDataTable from './DataTable/index.vue'
import { generateElementItemMixin } from '../mixins/generateElementItem'

export default {
  name: 'generate-element-item',
  components: {
    FmUpload,
    FmFormTable,
    FmFileUpload,
    FmSubForm,
    FmGroup,
    Editor,
    FmDataTable
  },
  mixins: [generateElementItemMixin],
  data () {
    return {
      propsModel: {multiple: this.widget.options.multiple || false, checkStrictly: this.widget.options.checkStrictly || false},
      propsTransfer: {key: 'key', label: 'label'},
    }
  },
  methods: {
    onCascaderChange (value) {
      if (value) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.$parent && this.$parent.clearValidate()
            this.$parent && this.$parent.$parent && this.$parent.$parent.$refs.generateFormItem && this.$parent.$parent.$refs.generateFormItem.clearValidate()
          })
        })
      }
    },
    handleTransferChange (value) {
      this.dataModel = value
    }
  },
}
</script>

<script setup>
import { ref, inject, computed, watchEffect } from 'vue'
import { executeExpression } from '../../../util/expression';
import * as qiniu from 'qiniu-js'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  width: {
    type: Number,
    default: 100
  },
  height: {
    type: Number,
    default: 100
  },
  multiple: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: ''
  },
  domain: {
    type: String,
    default: ''
  },
  limit: {
    type: Number,
    default: 9
  },
  isQiniu: {
    type: Boolean,
    default: false
  },
  isDelete: {
    type: Boolean,
    default: false
  },
  action: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  headers: {
    type: Array,
    default: () => []
  },
  withCredentials: {
    type: Boolean,
    default: false
  },
  printRead: {
    type: Boolean,
    default: false
  },
  onSelect: {
    type: Function,
    default: undefined
  },
  isImage: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: ''
  },
  customProps: Object,
  extendProps: Object,

})

const emit = defineEmits(['update:modelValue', 'on-upload-success', 'on-upload-error', 'on-upload-remove'])

const formContext = inject('formContext', {})

const fileList = ref(props.modelValue)

watchEffect(() => {
  fileList.value = props.modelValue.map(item => {
    if (props.isImage) {
      return {
        url: item?.url,
        key: item?.key,
        name: item?.name,
        isImage: true
      }
    } else {
      return {
        name: item?.name,
        key: item?.key,
        url: item?.name
      }
    }
  })
})

function updateModelValue () {
  emit('update:modelValue', fileList.value.map(item => {
    return {
      name: item.name ?? item.file?.name,
      url: item.url,
      key: item.key
    }
  }))
}

// 服务器上传
function uploadAction (file, key) {
  
  const index = fileList.value.findIndex(item => item.key === key)

  if (index < 0 ) return false

  const xhr = new XMLHttpRequest()

  xhr.open('POST', props.action, true)

  props.headers.forEach(header => {
    header.key && xhr.setRequestHeader(header.key, header.fx ? executeExpression(header.value, {}, formContext) : header.value)
  })

  let formData = new FormData()
  formData.append('file', file.file)
  formData.append('fname', file.file.name)
  formData.append('key', key)

  xhr.withCredentials = props.withCredentials

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {

      if (xhr.status == 200) {
        let resData = JSON.parse(xhr.response)

        fileList.value[index] = {
          ...fileList.value[index],
          url: resData.url,
          percent: 100,
          status: 'done',
          ...resData
        }

        emit('on-upload-success', {
          ...fileList.value[index],
          stauts: 'success'
        })

        updateModelValue()
      } else {
        fileList.value[index] = {
          ...fileList.value[index],
          status: 'failed',
          message: '上传失败'
        }

        emit('on-upload-error', {
          ...fileList.value[index],
          status: 'error'
        })
      }
    }
  }

  xhr.upload.onprogress = (res) => {
    if (res.total && res.loaded) {
      fileList.value[index] = {
        ...fileList.value[index],
        percent: res.loaded == res.total ? 99 : Math.ceil(res.loaded / res.total * 100),
        status: 'uploading'
      }
    }
  }

  xhr.send(formData)
}

// 七牛云上传
function uploadQiniu (file, key) {
  const index = fileList.value.findIndex(item => item.key === key)

  if (index < 0 ) return false

  const observable = qiniu.upload(file.file, key, props.token, {
    fname: file.file.name,
    mimeType: []
  }, {
    useCdnDomain: true,
  })
  observable.subscribe({
    next (res) {
      fileList.value[index] = {
        ...fileList.value[index],
        percent: parseInt(res.total.percent),
        status: 'uploading'
      }
    },
    error (err) {
      fileList.value[index] = {
        ...fileList.value[index],
        status: 'failed',
        message: '上传失败'
      }
      emit('on-upload-error', {
        ...fileList.value[index],
        status: 'error'
      })
    },
    complete (res) {
      fileList.value[index] = {
        ...fileList.value[index],
        url: props.domain + res.key,
        status: 'done'
      }
      emit('on-upload-success', {
        ...fileList.value[index],
        status: 'success'
      })
      updateModelValue()
    }
  })
}

function afterRead (file) {

  if (!Array.isArray(file)) {
    file = [file]
  }

  for (let i = 0; i < file.length; i++) {
    let currentFile = file[i]

    currentFile.status = 'uploading'
    currentFile.message = '上传中...'
    currentFile.name = currentFile.file.name

    const key = (new Date().getTime()) + '_' + Math.ceil(Math.random() * 99999)
    currentFile.key = key

    if (props.isQiniu) {
      uploadQiniu(currentFile, key)
    } else {
      uploadAction(currentFile, key)
    }
  }
}

function beforeRead (file) {

  if (!Array.isArray(file)) {
    file = [file]
  }

  for (let i = 0; i < file.length; i++) {
    
    let currentFile = file[i]

    const result = props.onSelect ? props.onSelect(currentFile) : true

    if (result === false) {
      return false
    }

    if (result instanceof File) {
      currentFile.file = result
    }
  }

  return true
}

function beforeDelete (file) {
  const index = fileList.value.findIndex(item => item.key === file.key)

  if (index >= 0) {
    emit('on-upload-remove', fileList.value[index])
    fileList.value.splice(index, 1)
    updateModelValue()
  }
  return true
}
</script>

<template>
  <van-uploader 
    :max-count="limit"
    :disabled="disabled"
    :multiple="multiple"
    :after-read="afterRead" 
    :before-read="beforeRead"
    :before-delete="beforeDelete"
    v-model="fileList"
    :preview-size="[width, height]"
    :readonly="readonly"
    :show-upload="(!isQiniu || (isQiniu && !!token)) && !readonly"
    v-bind="{...customProps, ...extendProps}"
    :deletable="isDelete && !readonly"
    :preview-options="{
      closeable: true,
      overlayStyle: {
        'zIndex': 5000
      }
    }"
    v-if="isImage"
  ></van-uploader>

  <div v-else class="fm-uploader-wrapper">
    <van-uploader 
      :max-count="limit"
      :disabled="disabled"
      :multiple="multiple"
      :after-read="afterRead" 
      :before-read="beforeRead"
      :before-delete="beforeDelete"
      v-model="fileList"
      :readonly="readonly"
      :deletable="isDelete"
      :show-upload="!isQiniu || (isQiniu && !!token)"
      v-bind="{...$attrs,...customProps, ...extendProps}"
      :preview-image="false"
      :preview-size="['100%', 10]"
      :accept="accept"
      v-if="!readonly"
    >
      <van-button icon="plus" type="primary">上传文件</van-button>
    </van-uploader>

    <div class="fm-uploader-file-list" v-if="!isImage" :class="{'is-readonly': readonly}">
      <van-cell v-for="item in fileList" :key="item.key" class="fm-uploader-file-item">
        <template #title>
          <van-icon name="file" size="20" />
          <span v-if="item.status === 'failed'" style="color: red;">上传失败! </span>
          <span>{{item.name}}</span>
        </template>
        <template #label v-if="item.status === 'uploading'">
          <van-progress :percentage="item.percent" />
        </template>
        <template #right-icon v-if="item.status !== 'uploading' && !readonly">
          <van-icon 
            name="cross" 
            class="fm-uploader-file-item-delete"
            @click="beforeDelete(item)"
          />
        </template>
      </van-cell>
    </div>
  </div>
  
</template>

<style lang="scss" scoped>
.fm-uploader-wrapper{
  width: 100%;
}
.fm-uploader-file-list{
  margin-top: 10px;

  &.is-readonly{
    margin-top: 0;
  }
  
  .fm-uploader-file-item{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
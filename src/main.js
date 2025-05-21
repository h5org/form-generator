import { createApp, version } from 'vue'
import { useDark } from '@vueuse/core'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { Form } from 'ant-design-vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import en from 'element-plus/es/locale/lang/en'
import zh from 'element-plus/es/locale/lang/zh-cn'

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

import Vant from 'vant'
import 'vant/lib/index.css'

import App from './App.vue'

import router from './router'

import FormMakingV3 from './index'

import CustomComponent from './demo/CustomComponent.vue'
import CustomChart from './demo/Chart.vue'
import CustomVantField from './demo/VantComponent/VantField.vue'
import CustomVantUploader from './demo/VantComponent/VantUploader.vue'
import CustomVantActionSheet from './demo/VantComponent/VantActionSheet.vue'
import CustomVantCalendar from './demo/VantComponent/VantCalendar.vue'
import CustomPaginationTable from './demo/PaginationTable.vue'

import { createI18n } from 'vue-i18n'

console.log('vue:', version)

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  messages: {
    'en': en,
    'zh-cn': zh
  }
})

const app = createApp(App)

app.use(router)
app.use(Antd)
app.provide('useInjectFormItemContext', Form.useInjectFormItemContext)
app.use(ElementPlus, {locale: en})
app.use(Vant)
app.use(FormMakingV3, {
  locale: 'zh-cn',
  i18n,
  jsPDF,
  html2canvas
})
app.use(i18n)
app.component('custom-width-height', CustomComponent)
app.component('custom-chart', CustomChart)
app.component('custom-vant-field', CustomVantField)
app.component('custom-vant-uploader', CustomVantUploader)
app.component('custom-vant-action-sheet', CustomVantActionSheet)
app.component('custom-vant-calendar', CustomVantCalendar)
app.component('custom-pagination-table', CustomPaginationTable)
app.component('QuillEditor', QuillEditor)
app.mount('#app')

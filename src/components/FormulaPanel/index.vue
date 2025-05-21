<template>
  <div class="fm-formula-container">
    <el-row justify="space-between" >
      <el-col :span="24">
        <el-card shadow="never" size="small" class="formula-card">
          <template #header>
            <div style="display: flex;justify-content: space-between;">
              <span>{{$t('fm.formula.header')}}</span>
              <span><i class="fm-iconfont icon-question-circle is-help" @click="handleGoHelp"></i></span>
            </div>
          </template>
          <div :id="editorId" class="formula-editor"></div>
        </el-card>
      </el-col>
      
    </el-row>
    <el-row justify="space-between"  :gutter="10">
      <el-col :span="24">
        <el-tabs class="formula-tabs">
          <el-tab-pane :label="$t('fm.formula.field')">
            <el-scrollbar ref="scrollRef"  always>
              <el-tree
                :data="modelsData"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                style="width: 100%;"
                ref="fieldTree"
              >
                <template #default="{ node }">
                  <div style="display: flex; justify-content: space-between; width: 95%; align-items: center;" @click="handleNode(node.data)">
                    <span>{{ node.data.name }} {<span style="font-size: 12px;">{{node.data.id}}</span>}</span>
                    <el-tag  type="info">{{$t('fm.components.fields.' + node.data.type)}}</el-tag>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane :label="$t('fm.formula.fieldId')">
            <el-scrollbar ref="scrollRef"  always>
              <el-tree
                :data="modelsData"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                style="width: 100%;"
              >
                <template #default="{ node }">
                  <div style="display: flex; justify-content: space-between; width: 95%; align-items: center;" @click="handleFieldId(node.data)">
                    <span>{{ node.data.name }} {<span style="font-size: 12px;">{{node.data.id}}</span>}</span>
                    <el-tag  type="info">{{$t('fm.components.fields.' + node.data.type)}}</el-tag>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane :label="$t('fm.formula.event')">
            <el-scrollbar always>
              <el-tree
                v-if="localVariables.length"
                :data="localVariables"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                style="width: 100%;"
              >
                <template #default="{ node }">
                  <div style="display: flex; justify-content: space-between; width: 90%;" @click="handleVariableNode(node.data)">
                    <span style=" padding: 0 5px; max-width: 50%;">{{ node.data.name }}</span>
                  </div>
                </template>
              </el-tree>
              <el-tree
                :data="argsData"
                node-key="id"
                default-expand-all
                :expand-on-click-node="false"
                style="width: 100%;"
              >
                <template #default="{ node }">
                  <div style="display: flex; justify-content: space-between; width: 95%; align-items: center;" @click="handleArgsNode(node.data)">
                    <span style=" padding: 0 5px; max-width: 50%;"><span>{{ node.data.name }}</span> <span v-if="node.data.desc && $i18n.locale == 'zh-cn'">（{{node.data.desc}}）</span></span>
                    <span style="font-size: 12px;">{{node.data.id}}</span>
                  </div>
                </template>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/ayu-dark.css'
import 'codemirror/addon/edit/closebrackets.js'
import 'codemirror/addon/selection/active-line.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars.js'

export default {
  props: ['modelValue', 'showArguments', 'showRow'],
  inject: {
    getFormModels: {
      default: () => {return new Function()}
    },
    getResponseVariables: {
      default: () => {return new Function()}
    },
    getLocalVariables: {
      default: () => {return new Function()}
    }
  },
  data () {
    let curArgsData = []

    if (this.showArguments) {
      curArgsData = [{
        id: 'arguments[0]',
        name: this.$t('fm.formula.argsData.name'),
        children: [
          {
            id: ' arguments[0].value',
            name: 'value',
            desc: '当前字段值',
          },  {
            id: ' arguments[0].fieldNode',
            name: 'fieldNode',
            desc: '当前字段标识',
          }, {
            id: ' arguments[0].currentRef',
            name: 'currentRef',
            desc: '当前组件实例'
          }
        ]
      }]

      if (this.showRow) {
        curArgsData[0].children = curArgsData[0].children.concat([
          {
            id: ' arguments[0].rowIndex',
            name: 'rowIndex',
            desc: '当前操作行下标',
          }, {
            id: ' arguments[0].row',
            name: 'row',
            desc: '当前行数据'
          }
        ])
      }
    }

    return {
      value: this.modelValue,
      editorId: 'formula-' + Math.random().toString(36).slice(-8),
      // editor: null, 此处不能定义，防止被Vue Proxy 包裹
      modelsData: [],
      argsData: curArgsData,
      responseVariables: [],
      localVariables: [],
    }
  },
  mounted () {
    this.modelsData = this.getFormModels() ?? []

    let responseVariables =  this.getResponseVariables() ?? []
    let localVars = this.getLocalVariables() ?? []

    if (responseVariables.length || localVars.length) {
      this.localVariables = [{
        id: '',
        name: this.$t('fm.formula.argsData.variable'),
        children: [...responseVariables, ...localVars].map(item => ({
          id: ' ' + item,
          name: item
        }))
      }]
    }

    setTimeout(() => {
      this.initEditor()
    })
  },
  methods: {
    initEditor () {
      let theme = 'default'
      if (document.querySelector('html').className.indexOf('dark')>-1) {
        theme = 'ayu-dark'
      }

      this.editor = CodeMirror(document.getElementById(this.editorId), {
        value: this.value,
        lineNumbers: false,
        mode: 'javascript',
        lineWrapping: false,
        autofocus: true,
        theme: theme,
        autoCloseBrackets: true,
        styleActiveLine: true,
        scrollbarStyle: "simple"
      })

      this.editor.on('change', cm => {
        this.value = cm.getValue()
      })

      this.replaceFieldContent()
      this.replaceArgsContent()
      this.replaceVarContent()

      this.editor.execCommand("goDocEnd")
    },

    _escapeRegExp (string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },

    replaceVarContent () {
      if (this.localVariables && this.localVariables.length) {
        this.localVariables[0].children.forEach(item => {
          const regex = new RegExp(item.id, 'g')

          const matches = []
        
          let match

          while ((match = regex.exec(this.value)) !== null) {
            // 匹配到的内容
            const matchedValue = match[0]

            // 匹配到的内容在文本中的起始位置
            const startIndex = match.index - this.calcLastIndex(this.value, match.index) - 1

            const lineIndex = this.calcLineCount(this.value, match.index)

            // 将匹配结果存储到数组中
            matches.push({
              value: matchedValue,
              startIndex: startIndex,
              lineIndex: lineIndex,
              id: item.id,
              name: item.name
            })
          }

          matches.forEach(mitem => {
            let widgetNode = document.createElement('span')
            widgetNode.className = 'cm-eventvar'
            widgetNode.textContent = mitem.name
            widgetNode.title = mitem.id

            this.editor.markText({line: mitem.lineIndex, ch: mitem.startIndex}, { line: mitem.lineIndex, ch: mitem.startIndex + mitem.value.length }, {
              atomic: true,
              selectLeft: true,
              selectRight: true,
              inclusiveLeft: false,
              inclusiveRight: false,
              replacedWith: widgetNode,
              handleMouseEvents: true
            })
          })
        })
      }
    },

    replaceArgsContent () {
      this.argsData.length && this.argsData[0].children.forEach(item => {
        const regex = new RegExp(this._escapeRegExp(item.id), 'g')

        const matches = []
        
        let match

        while ((match = regex.exec(this.value)) !== null) {
          // 匹配到的内容
          const matchedValue = match[0]

          // 匹配到的内容在文本中的起始位置
          const startIndex = match.index - this.calcLastIndex(this.value, match.index) - 1

          const lineIndex = this.calcLineCount(this.value, match.index)

          // 将匹配结果存储到数组中
          matches.push({
            value: matchedValue,
            startIndex: startIndex,
            lineIndex: lineIndex,
            id: item.id,
            name: item.name
          })
        }

        matches.forEach(mitem => {
          let widgetNode = document.createElement('span')
          widgetNode.className = 'cm-eventargs'
          widgetNode.textContent = mitem.name
          widgetNode.title = mitem.id

          this.editor.markText({line: mitem.lineIndex, ch: mitem.startIndex}, { line: mitem.lineIndex, ch: mitem.startIndex + mitem.value.length }, {
            atomic: true,
            selectLeft: true,
            selectRight: true,
            inclusiveLeft: false,
            inclusiveRight: false,
            replacedWith: widgetNode,
            handleMouseEvents: true
          })
        })
      })
    },

    replaceFieldContent () {
      // 定义正则表达式模式，匹配 this.getValue("xxx") 形式的内容
      const regex = / this\.getValue\("([^"]+)"\)/g

      const matches = []

      let match
      while ((match = regex.exec(this.value)) !== null) {
        // 匹配到的内容
        const matchedValue = match[0]
        const matchedId = match[1]

        // 匹配到的内容在文本中的起始位置
        const startIndex = match.index - this.calcLastIndex(this.value, match.index) - 1

        const lineIndex = this.calcLineCount(this.value, match.index)

        const matchNode = this.$refs.fieldTree.getNode(matchedId)

        if (matchNode) {
          // 将匹配结果存储到数组中
          matches.push({
            value: matchedValue,
            startIndex: startIndex,
            lineIndex: lineIndex,
            id: matchedId,
            data: matchNode.data
          })
        }
      }

      matches.forEach(item => {
        let widgetNode = document.createElement('span')
        widgetNode.className = 'cm-value'
        widgetNode.textContent = item.data.name || item.data.id
        widgetNode.title = item.value

        this.editor.markText({line: item.lineIndex, ch: item.startIndex}, { line: item.lineIndex, ch: item.startIndex + item.value.length }, {
          title: item.value,
          atomic: true,
          selectLeft: true,
          selectRight: true,
          inclusiveLeft: false,
          inclusiveRight: false,
          replacedWith: widgetNode,
          handleMouseEvents: true
        })
      })
    },

    calcLineCount (str, n) {
      let count = 0
      for (let i = 0; i < n; i++) {
        if (str[i] === '\n') {
          count++
        }
      }
      return count
    },

    calcLastIndex (str, n) {
      let lastIndex = -1
      for (let i = 0; i < n; i++) {
        if (str[i] === '\n') {
          lastIndex = i
        }
      }
      return lastIndex
    },

    handleFieldId (data) {
      let cursor = this.editor.getCursor()

      let text = `"${data.id}"`

      this.editor.replaceRange(text, cursor)

      this.editor.focus()
    },

    handleNode(data) {
      let cursor = this.editor.getCursor()

      let widgetNode = document.createElement('span')
      widgetNode.className = 'cm-value'
      widgetNode.textContent = data.name || data.id

      let text = ` this.getValue("${data.id}")`

      widgetNode.title = text

      this.editor.replaceRange(text, cursor)

      this.editor.markText({line: cursor.line, ch: cursor.ch}, { line: cursor.line, ch: cursor.ch + text.length }, {
        title: text,
        atomic: true,
        selectLeft: true,
        selectRight: true,
        inclusiveLeft: false,
        inclusiveRight: false,
        replacedWith: widgetNode,
        handleMouseEvents: true
      })

      this.editor.focus()
    },

    handleArgsNode (data) {

      let cursor = this.editor.getCursor()

      let widgetNode = document.createElement('span')
      widgetNode.className = 'cm-eventargs'
      widgetNode.textContent = data.name
      widgetNode.title = data.id

      let text = data.id

      this.editor.replaceRange(text, cursor)

      this.editor.markText({line: cursor.line, ch: cursor.ch}, { line: cursor.line, ch: cursor.ch + text.length }, {
        atomic: true,
        selectLeft: true,
        selectRight: true,
        inclusiveLeft: false,
        inclusiveRight: false,
        replacedWith: widgetNode,
        handleMouseEvents: true
      })

      this.editor.focus()
    },

    handleVariableNode (data) {
      let cursor = this.editor.getCursor()
      let text = data.id

      let widgetNode = document.createElement('span')
      widgetNode.className = 'cm-eventvar'
      widgetNode.textContent = data.name
      widgetNode.title = data.id


      this.editor.replaceRange(text, cursor)

      this.editor.markText({line: cursor.line, ch: cursor.ch}, { line: cursor.line, ch: cursor.ch + text.length }, {
        atomic: true,
        selectLeft: true,
        selectRight: true,
        inclusiveLeft: false,
        inclusiveRight: false,
        replacedWith: widgetNode,
        handleMouseEvents: true
      })

      this.editor.focus()
    },

    handleGoHelp () {
      window.open('https://form.making.link/docs/manual/formula.html')
    }
  },
  watch: {
    modelValue (val) {
      this.value = val
    },
    value (val) {
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style lang="scss">
.fm-formula-container{
  .formula-tabs {
    border: 1px solid var(--el-border-color);
    // margin-bottom: 5px;
    --el-tabs-header-height: 35px;

    .el-tabs__header{
      padding: 0;
      background: var(--el-fill-color-light);
      margin: 0;
      margin-bottom: 5px;

      .el-tabs__item{
        font-size: 14px;
        font-weight: normal;
        padding: 0 10px;
      }
    }

    .el-tabs__content{
      height: 240px;

      .el-tab-pane{
        height: 100%;
      }
    }
  }

  .formula-card{
    margin-bottom: 10px;

    .el-card__header{
      padding: 8px;
      background: var(--el-fill-color-light);

      .is-help {
        color: red;
        cursor: pointer;
      }
    }

    .el-card__body{
      padding: 0;
    }
  }

  .formula-editor{
    height: 160px;

    .CodeMirror{
      height: 100%;
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;

      pre.CodeMirror-line {
        line-height: 20px;
        font-size: 13px;
      }
    }

    .cm-field{
      background-color: var(--el-color-primary);
      color: white;
      margin: 2px 0;
      padding: 0 2px;
      border-radius: 4px;
      display: inline-block;
    }

    .cm-value{
      background-color: var(--el-color-primary);
      color: white;
      margin: 2px 1px 2px 2px;
      padding: 0 4px;
      border-radius: 4px;
      display: inline-block;
      font-size: 13px;
    }

    .cm-eventargs{
      background-color: var(--el-color-warning);
      color: white;
      margin: 2px 1px 2px 2px;
      padding: 0 4px;
      border-radius: 4px;
      font-size: 13px;
      display: inline-block;
    }

    .cm-eventvar {
      background-color: var(--el-color-warning-light-9);
      color: var(--el-color-warning);
      padding: 0 2px;
      border-radius: 4px;
      display: inline-block;
    }
  }

  .el-tree-node{
    padding: 2px 0;
  }

  .formula-field,.formula-method{
    .el-card__body{
      height: 240px;
      padding: 0;
    }
  }
}
</style>
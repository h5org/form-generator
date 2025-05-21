<template>

  <div class="fm-outline-header">
    <el-input v-model="filterText" placeholder="Filter node" clearable />
  </div>

  <div class="fm-outline-content">
    <el-scrollbar ref="scrollRef">
      <el-tree
        ref="treeRef"
        class="filter-tree"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        highlight-current	
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        :indent="16"
        node-key="id"
        @node-click="onNodeClick"
        check-on-click-node	
        draggable
        @node-drag-start="handleDragStart"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :allow-drop="handleAllowDrop"
      >
        <template #default="{ node }">
          <div class="custom-tree-node" :class="{'is-bind': node.data?.dataBind}">
            <span v-html="node.label"></span>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>  
  </div>
</template>

<script>
export default {
  props: ['data', 'show'],
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: 'disabled'
      },
      treeData: [],
      currentKey: ''
    }
  },
  emits: ['select', 'sortChange'],
  mounted () {
    this.treeData = this.loadNode(this.data)

    this.loadTreeWidthStyle()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.includes(value)
    },

    loadNode (list, parentType = '') {
      let currentNode = []

      for (let i = 0; i < list.length; i++) {

        if (!list[i].type) continue

        currentNode.push({
          id: list[i].key,
          label: (
            list[i].type == 'custom' ? ('<i class="fm-iconfont icon-extend"></i>&nbsp;') : (
              list[i].icon ? `<i class=" fm-iconfont ${list[i].icon}"></i>&nbsp;` : '<i class="fm-iconfont"></i>'))
            +`<span class="custom-tree-node-type">${list[i].name ? list[i].name : this.$t('fm.components.fields.'+list[i].type)}</span>` 
            + (list[i].model ? `&nbsp;{ <span class="custom-tree-node-model">${list[i].model}</span> }` : ''),
          children: [],
          dataBind: list[i].options?.dataBind,
          source: list[i],
          type: list[i].type,
          parentType: parentType
        })

        if (list[i].type == 'grid') {
          currentNode[i].children = this.loadNode(list[i].columns, 'grid')
        }
        if (list[i].type == 'col') {
          currentNode[i].children = this.loadNode(list[i].list, 'col')
        }
        if (list[i].type == 'report') {
          // 处理表格布局结构，便于大纲树展示
          let reportList = []

          for (let r = 0; r < list[i].rows.length; r++) {
            for (let c = 0; c < list[i].rows[r].columns.length; c++) {
              let td = list[i].rows[r].columns[c]

              if (!td.options.invisible) {
                reportList.push(td)
              }
            }
          }

          currentNode[i].children = this.loadNode(reportList, 'report')
        }
        if (list[i].type == 'td') {
          currentNode[i].children = this.loadNode(list[i].list, 'td')
        }
        if (list[i].type == 'tabs') {
          for (let t = 0; t < list[i].tabs.length; t++) {
            currentNode[i].children.push({
              id: list[i].tabs[t].key,
              label: list[i].tabs[t].label,
              children: [],
              disabled: true,
              source: list[i].tabs[t],
              type: 'tabitem',
              parentType: 'tabs'
            })

            currentNode[i].children[t].children = this.loadNode(list[i].tabs[t].list, 'tabitem')
          }
        }
        if (list[i].type == 'collapse') {
          for (let t = 0; t < list[i].tabs.length; t++) {
            currentNode[i].children.push({
              id: list[i].tabs[t].key,
              label: list[i].tabs[t].title,
              children: [],
              disabled: true,
              source: list[i].tabs[t],
              type: 'collapseitem',
              parentType: 'collapse'
            })

            currentNode[i].children[t].children = this.loadNode(list[i].tabs[t].list, 'collapseitem')
          }
        }
        if (list[i].type == 'inline') {
          currentNode[i].children = this.loadNode(list[i].list, 'inline')
        }
        if (list[i].type == 'table') {
          currentNode[i].children = this.loadNode(list[i].tableColumns, 'table')
        }
        if (list[i].type == 'subform') {
          currentNode[i].children = this.loadNode(list[i].list, 'subform')
        }
        if (list[i].type == 'dialog') {
          currentNode[i].children = this.loadNode(list[i].list, 'dialog')
        }
        if (list[i].type == 'card') {
          currentNode[i].children = this.loadNode(list[i].list, 'card')
        }
        if (list[i].type == 'group') {
          currentNode[i].children = this.loadNode(list[i].list, 'group')
        }
      }

      return currentNode
    },
    loadTreeWidthStyle () {
      if (!this.show) return

      document.querySelector('.fm-outline-content .el-scrollbar__view').removeAttribute('style')

      let realWidth = document.querySelector('.fm-outline-content .el-scrollbar__wrap').scrollWidth

      document.querySelector('.fm-outline-content .el-scrollbar__view').setAttribute('style', `width: ${realWidth <= 250 ? realWidth : (realWidth + 5)}px`)
    },

    onNodeClick (data, node) {

      if (data.id) {
        this.$emit('select', data.id)
        this.currentKey = data.id
      } else {
        this.$refs.treeRef?.setCurrentKey(this.currentKey)
      }
    },

    setCurrentKey (key, isScrollTo) {
      this.currentKey = key

      this.$refs.treeRef?.setCurrentKey(key)

      setTimeout(() => {
        isScrollTo && this.scrollTo()
      }, 200)
    },
    scrollTo () {
      // 计算当前选中元素距离容器顶部距离
      let y = document.querySelector('.fm-outline-content .is-current')?.offsetTop

      let containerHeight = document.querySelector('.fm-outline-content').offsetHeight

      let containerTop = document.querySelector('.fm-outline-content').getBoundingClientRect().top
      let scorllTop = document.querySelector('.fm-outline-content .el-scrollbar__view').getBoundingClientRect().top

      let top = scorllTop - containerTop

      if (y > -top + containerHeight || y < -top) {
        this.$refs.scrollRef.setScrollTop(y)
      }
    },

    handleAllowDrop (draggingNode, dropNode, type) {
      const allowDropInnerTypes = ['grid', 'col', 'report', 'td', 'tabs', 'tabitem', 'collapse', 'collapseitem', 
        'inline', 'card', 'table', 'subform', 'dialog', 'group']

      if (type === 'inner') {
        if (!allowDropInnerTypes.includes(dropNode.data.type)) {
          return false
        }

        // 栅格布局特殊情况
        if ((dropNode.data.type === 'grid') !== (draggingNode.data.type === 'col')) {
          return false
        }

        // 表格布局特殊情况
        if (dropNode.data.type === 'report') {
          return false
        }

        // 标签页特殊情况
        if ((dropNode.data.type === 'tabs') !== (draggingNode.data.type === 'tabitem')) {
          return false
        }

        // 折叠面板特殊情况
        if ((dropNode.data.type === 'collapse') !== (draggingNode.data.type === 'collapseitem')) {
          return false
        }

        // 行内布局特殊情况
        if (dropNode.data.type === 'inline' && allowDropInnerTypes.includes(draggingNode.data.type)) {
          return false
        }

        // 子表单特殊情况
        if (dropNode.data.type === 'table' && allowDropInnerTypes.includes(draggingNode.data.type)) {
          return false
        }

        // 对话框特殊情况
        if (draggingNode.data.type === 'dialog') {
          return false
        }
      } else {
        // 栅格布局
        if ((draggingNode.data.type === 'col') !== (dropNode.data.type === 'col')) {
          return false
        }
 
        // 表格布局
        if (dropNode.data.type === 'td') {
          return false
        }

        // 标签页
        if ((dropNode.data.type === 'tabitem') !== (draggingNode.data.type === 'tabitem')) {
          return false
        }

        // 折叠面板
        if ((dropNode.data.type === 'collapseitem') !== (draggingNode.data.type === 'collapseitem')) {
          return false
        }

        // 行内布局和子表单特殊情况，不支持布局组件
        if (allowDropInnerTypes.includes(draggingNode.data.type) && ['table', 'inline'].includes(dropNode.data.parentType)) {
          return false
        }

        // 对话框
        if (draggingNode.data.type === 'dialog' && dropNode.data.parentType) {
          return false
        }
      }

      if (draggingNode.data.source.type === 'td') {
        return false
      }

      return true
    },

    handleDragStart (draggingNode, event) {
      // 创建自定义拖拽镜像
      const dragImage = document.createElement('div')
      dragImage.innerHTML = `<span class="fm-dragging-image">${draggingNode.label}</span>`

      // 添加到 DOM 中并设置镜像
      document.body.appendChild(dragImage)
      event.dataTransfer.setDragImage(dragImage, 0, 0)

      event.target.classList.add('is-dragging')

      // 清理拖拽镜像，避免占用内存
      setTimeout(() => document.body.removeChild(dragImage), 0)
    },
    handleDragEnd (draggingNode, dropNode, type, event) {
      event.target.classList.remove('is-dragging')
    },
    handleDrop (draggingNode, dropNode, dropType, event) {

      this.$emit('sortChange', {...draggingNode.data.source}, {...dropNode.data.source}, dropType)
    }
  },
  watch: {
    filterText (val) {
      this.$refs.treeRef.filter(val)
    },
    data: {
      deep: true, 
      handler (val) {
        this.treeData = this.loadNode(val)

        this.loadTreeWidthStyle()

        this.$nextTick(() => {
          this.$refs.treeRef?.setCurrentKey(this.currentKey)

          this.$refs.treeRef.filter(this.filterText)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.fm-outline-header{
  padding: 12px;
  height: 56px;

}
.fm-outline-content{
  height: calc(100% - 56px);

  .custom-tree-node{
    display: inline-block;
    font-size: 12px;
    line-height: 12px;

    .fm-iconfont{
      vertical-align: top;
      font-size: 14px;
    }

    &.is-bind{
      >span>.custom-tree-node-model{
        color: #67C23A;
      }
    }
  }

  .el-tree-node>.el-tree-node__children{
    overflow: unset;
  }

  .el-tree-node.is-current{

    >.el-tree-node__content{
      background: #c6e2ff;

      >.custom-tree-node{
        // background: #c6e2ff;
      }
    }
  }

  .filter-tree{
    margin-bottom: 10px;
  }
}

html.dark{
  .fm-outline-content{
    .el-tree-node.is-current{

      >.el-tree-node__content{
        background: #213d5b;
      }
    }
  }
}
</style>

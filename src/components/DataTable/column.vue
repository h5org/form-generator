<template>
  <el-table-column
    :label="data.label"
    :width="data.width"
    :fixed="data.fixed ? data.fixedOption : false"
    :align="data.align"
    v-if="data.isParent && data.children.length"
    :key="`parent-${key}`"
    :show-overflow-tooltip="data.ellipsis"
    :column-key="data.key"
  >
    <template v-for="(childrenColumn, index) in data.children" :key="index">
      <data-table-column :data="childrenColumn"></data-table-column>
    </template>
    <template #header v-if="data.headerSlot">
      <component :is="`component-header-${headerKey}`" :key="headerKey"></component>
    </template>
  </el-table-column>
  <el-table-column v-else
    :label="data.label"
    :prop="data.prop"
    :width="data.width"
    :fixed="data.fixed ? data.fixedOption : false"
    :align="data.align"
    :key="key"
    :show-overflow-tooltip="data.ellipsis"
    :column-key="data.key"
  >
    <template #default="scope" v-if="data.defaultSlot">
      <component :is="`component-column-${columnKey}`" :scope="{...scope, record: scope.row, text: scope.row[data.prop]}" :key="columnKey"></component>
    </template>
    <template #header v-if="data.headerSlot">
      <component :is="`component-header-${headerKey}`" :key="headerKey"></component>
    </template>
  </el-table-column>
</template>

<script>
export default {
  name: 'data-table-column',
  components: {},
  props: {
    data: {
      type: Object
    }
  },
  data () {
    return {
      key: Math.random().toString(36).slice(-8),
      headerKey: Math.random().toString(36).slice(-8),
      columnKey: Math.random().toString(36).slice(-8)
    }
  },
  created () {
    if (this.data.defaultSlot) {
      this.loadColumnTemplate()
    }

    if (this.data.headerSlot) {
      this.loadHeaderTemplate()
    }
  },
  beforeUnmount () {
    this.removeColumnTemplate()

    this.removeHeaderTemplate()
  },
  watch: {
    'data.headerSlot': function (val) {
      this.key = Math.random().toString(36).slice(-8)
    },
    'data.headerSlotTemplate': function (val) {
      this.key = Math.random().toString(36).slice(-8)
      this.loadHeaderTemplate()
    },
    'data.defaultSlot': function (val) {
      this.key = Math.random().toString(36).slice(-8)
    },
    'data.defaultSlotTemplate': function (val) {
      this.key = Math.random().toString(36).slice(-8)
      this.loadColumnTemplate()
    },
    'data.children': {
      deep: true,
      handler (val) {
        this.key = Math.random().toString(36).slice(-8)
      }
    }
  },
  methods: {
    loadColumnTemplate () {
      this.$options.components[`component-column-${this.columnKey}`] = {
        template: this.data.defaultSlotTemplate || '<span></span>',
        props: ['scope']
      }
    },
    removeColumnTemplate () {
      if (this.$options.components[`component-column-${this.columnKey}`]) {
        this.$options.components[`component-column-${this.columnKey}`] = null
      }
    },

    loadHeaderTemplate () {
      this.$options.components[`component-header-${this.headerKey}`] = {
        template: this.data.headerSlotTemplate || '<span></span>'
      }
    },
    removeHeaderTemplate () {
      if (this.$options.components[`component-header-${this.headerKey}`]) {
        this.$options.components[`component-header-${this.headerKey}`] = null
      }
    }
  }
}
</script>
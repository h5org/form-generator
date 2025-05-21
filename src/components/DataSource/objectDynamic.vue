<template>
  <array-dynamic v-model="array" :operable="operable" :showArguments="showArguments" :showRow="showRow"></array-dynamic>
</template>

<script>
import ArrayDynamic from './arrayDynamic.vue'
import { isExpression, extractExpression, executeExpression } from '../../util/expression'

export default {
  components: {
    ArrayDynamic
  },
  props: {
    modelValue: {
      type: [String, Object],
    },
    operable: {
      type: Boolean,
      default: true
    },
    showArguments: {
      type: Boolean,
      default: true
    },
    showRow: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      array: this.object2Array(this.modelValue)
    }
  },
  methods: {
    object2Array (obj) {
      if (!obj) return []
      if (typeof obj == 'string') {
        obj = (new Function('"use strict";return (' + (obj || '{}') + ')'))()
      }

      return Object.keys(obj).map(item => ({
        key: item,
        fx: isExpression(obj[item]),
        value: isExpression(obj[item]) ? extractExpression(obj[item]) : obj[item]
      }))
    },

    array2Object (array) {
      let obj = {}

      array.forEach(item => {
        if (item.key) {
          obj[item.key] = item.fx ? `{{${item.value}}}` : item.value
        }
      })

      return obj
    }
  },
  watch: {
    array: {
      deep: true,
      handler (val) {
        this.$emit('update:modelValue', this.array2Object(val))
      }
    }
  }
}
</script>
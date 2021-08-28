<!-- 搜索表单 -->
<template>
  <s-form
    :data="sendData"
    :list="searchList"
    :loading="loading"
    @submit="$emit('search', sendData)"
    :config="{ resetText: '清空', submitText: '查询', type: 1, labelWidth: 50 }"
  ></s-form>
</template>
<!--UI，数据分离-->
<!--宽度问题,排序问题-->
<script>
import sForm from '@/component/form'

export default {
  components: {
    sForm,
  },
  data() {
    return {
      sendData: {},
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: [],
    },
  },
  computed: {
    searchList() {
      const searchList = this.list
        .filter(i => i.search)
        .map(i => {
          i.inline = true
          return i
        })
      return searchList
    },
  },
  created() {
    this.sendData = this.list
      .filter(i => i.search)
      .reduce((obj, i) => {
        obj[i.prop] = ''
        return obj
      }, {})
  },
  methods: {},
}
</script>

<template>
  <div>
    <s-search @search="search" :list="list" :loading="loading"></s-search>
    <el-table
      :data="data"
      @sort-change="e => $emit('sort-change', e)"
      :emptyText="configC.emptyText"
      :border="configC.border"
      v-loading="loading"
      ref="table"
    >
      <el-table-column v-if="configC.index" type="index" :index="indexMethod" label="序号"></el-table-column>
      <el-table-column
        :min-width="i.minWidth"
        :sortable="i.sortable"
        :fixed="i.fixed"
        :width="i.width"
        :key="i.prop"
        v-for="i in list"
        :prop="i.prop"
        :label="i.label"
      >
        <template #default="scope">
          <slot :name="i.prop" :row="scope.row">
            <div v-html="scope.row[i.prop]"></div>
          </slot>
        </template>
      </el-table-column>
      <template #empty>
        <slot name="empty" slot="">暂无数据</slot>
      </template>
    </el-table>
  </div>
</template>
<!--UI，数据分离-->
<!--宽度问题,排序问题-->
<script>
import { onMounted, ref } from 'vue'
import sSearch from '@/component/search'

const defaultConfig = {
  size: 'medium',
  index: true,
  emptyText: '暂无数据',
  border: false,
}
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: [],
    },
    data: {
      type: Array,
      default: [],
    },
    config: {
      type: Object,
      default: {},
    },
  },
  components: {
    sSearch,
  },
  computed: {
    configC() {
      return Object.assign(defaultConfig, this.config || {})
    },
  },
  name: 'index',
  methods: {
    search(data) {
      this.$emit('search', data)
    },
    indexMethod(index) {
      return index + 1
    },
  },
}
</script>

<style scoped></style>

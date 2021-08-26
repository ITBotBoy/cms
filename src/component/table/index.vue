<template>
  <!-- 表格 -->
  <el-table :data="data" :border="configC.border" v-loading="loading" ref="table">
    <el-table-column v-if="configC.index" type="index" :index="indexMethod" label="序号"></el-table-column>
    <el-table-column :fixed="i.fixed" :width="i.width" :key="i.prop" v-for="i in list" :prop="i.prop" :label="i.label">
      <template #default="scope">
        <slot :name="i.prop" :row="scope.row">
          <div v-html="scope.row[i.prop]"></div>
        </slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<!--UI，数据分离-->
<!--宽度问题,排序问题-->
<script>
import { onMounted, ref } from 'vue'

const defaultConfig = {
  size: 'medium',
  index: true,
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
      type: Boolean,
      default: true,
    },
  },
  computed: {
    configC() {
      return Object.assign(defaultConfig, this.config || {})
    },
  },
  name: 'index',
  methods: {
    indexMethod(index) {
      return index + 1
    },
  },
}
</script>

<style scoped></style>

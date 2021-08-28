<template>
  <el-form
    :size="configC.size"
    :model="data"
    ref="form"
    :disabled="loading"
    :status-icon="configC.statusIcon"
    :label-width="configC.labelWidth"
    @submit.prevent
    :rules="configC.rules"
  >
    <div
      v-for="i in list"
      :key="i.prop"
      :class="i.inline && 'inlineItem'"
      :style="{
        width: typeof i.width === 'number' ? `${i.width}px` : i.width || (i.inline && (configC.type ? '25%' : '50%')),
      }"
    >
      <el-form-item
        v-if="isShow(i.isShow || i.isHide, i.isShow ? 0 : 1)"
        :label-width="typeof i.labelWidth === 'number' ? `${i.labelWidth}px` : i.labelWidth"
        :label="i.label"
        :prop="i.prop"
      >
        <slot v-if="i.prepend" :name="`${i.prop}_prepend`"></slot>
        <slot :name="i.prop">
          <!-- 【vue2】
                   :value="getState(i.prop)"
                    @input="e=>setState(e,i.prop)"
                    -->
          <el-input
            v-if="[...typeIn[0], ...typeIn[1]].includes(i.type)"
            :type="typeIn[0].includes(i.type) ? 'text' : 'textarea'"
            :modelValue="getState(i.prop)"
            @update:modelValue="e => setState(e, i.prop)"
            :disabled="i.disabled"
            :placeholder="i.placeholder || `请输入${i.label}`"
          ></el-input>
          <el-select
            :disabled="i.disabled"
            :placeholder="i.placeholder || `请选择${i.label}`"
            clearable
            v-else-if="typeIn[2].includes(i.type)"
            :modelValue="getState(i.prop)"
            @update:modelValue="e => setState(e, i.prop)"
          >
            <el-option
              :key="index"
              v-for="(j, index) in i.options"
              :value="j[i.config ? i.config.value || 'value' : 'value']"
              :label="j[i.config ? i.config.label || 'label' : 'label']"
            ></el-option>
          </el-select>
          <el-radio-group
            :disabled="i.disabled"
            v-else-if="typeIn[3].includes(i.type)"
            :modelValue="getState(i.prop)"
            @update:modelValue="e => setState(e, i.prop)"
          >
            <template v-if="!i.config || radioCheckIn[0].includes(i.config.style)">
              <!-- vue2不支持 i.config?.value || 'value'/!!i.config?.border -->
              <el-radio
                :border="i.config && i.config.border"
                :key="index"
                v-for="(j, index) in j.array"
                :value="j[i.config ? i.config.value || 'value' : 'value']"
                :label="j[i.config ? i.config.label || 'label' : 'label']"
                >{{ j.label }}
              </el-radio>
            </template>
            <template v-else>
              <el-radio-button
                :key="index"
                v-for="(j, index) in i.options"
                :value="j[i.config ? i.config.value || 'value' : 'value']"
                :label="j[i.config ? i.config.label || 'label' : 'label']"
                >{{ j.label }}
              </el-radio-button>
            </template>
          </el-radio-group>
          <el-checkbox-group
            :disabled="i.disabled"
            v-else-if="typeIn[4].includes(i.type)"
            :modelValue="getArrayState(i.prop, i.dataType)"
            @update:modelValue="e => setArrayState(e, i.prop, i.dataType)"
          >
            <template v-if="!i.config || radioCheckIn[0].includes(i.config.style)">
              <el-checkbox
                :key="index"
                :border="i.config && i.config.border"
                v-for="(j, index) in i.options"
                :value="j[i.config ? i.config.value || 'value' : 'value']"
                :label="j[i.config ? i.config.label || 'label' : 'label']"
                >{{ j.label }}
              </el-checkbox>
            </template>
            <template v-else>
              <el-checkbox-button
                :key="index"
                :value="j[i.config ? i.config.value || 'value' : 'value']"
                :label="j[i.config ? i.config.label || 'label' : 'label']"
                v-for="(j, index) in i.options"
              >
                {{ j.label }}
              </el-checkbox-button>
            </template>
          </el-checkbox-group>
          <!--注意：:value.sync【vue2】，v-model:value【vue3】-->
          <s-image
            :disabled="i.disabled"
            :config="i.config"
            v-model:value="data[i.prop]"
            v-else-if="typeIn[5].includes(i.type)"
          ></s-image>
          <s-editor :disabled="i.disabled" :config="i.config" v-model:value="data[i.prop]" v-else></s-editor>
        </slot>
        <slot v-if="i.append" :name="`${i.prop}_append`"></slot>
      </el-form-item>
    </div>
    <div
      :class="configC.type && 'inlineItem'"
      :style="{
        width: typeof configC.searchBtnWidth === 'number' ? `${configC.searchBtnWidth}px` : configC.searchBtnWidth,
      }"
    >
      <el-form-item class="submit" v-if="configC.submitText || configC.resetText">
        <el-button :loading="loading" v-if="configC.submitText" type="primary" @click="submit"
          >{{ configC.submitText }}
        </el-button>
        <el-button :loading="loading" v-if="configC.resetText" @click="reset">{{ configC.resetText }}</el-button>
      </el-form-item>
    </div>
  </el-form>
</template>
<!--兼容vue2.0,vue3.0-->
<!--UI，数据分离，loading禁用-->
<!--split设置-->
<script>
import get from 'lodash/get'
import set from 'lodash/set'
import isArray from 'lodash/isArray'
import { ElMessage } from 'element-plus'
import bookModel from '@/model/book'
import sEditor from '@/component/base/tinymce'
import sImage from '@/component/base/upload-image'
// const defaultConfig={} 不能在外面声明，路由切换状态值不会刷新，导致值被重复使用
export default {
  components: {
    sEditor,
    sImage,
  },
  data() {
    return {
      defaultConfig: {
        size: 'medium',
        statusIcon: true,
        type: 0,
        searchBtnWidth: '100%',
        submitText: '保 存',
        resetText: '重 置',
        labelWidth: '100px',
        rules: {},
      },
      radioCheckIn: Object.freeze([
        [0, undefined, '0'],
        ['button', 1, '1'],
      ]),
      dataTypeIn: Object.freeze([
        [0, undefined, 'string', '0'],
        ['array', 1, '1'],
      ]),
      typeIn: Object.freeze([
        [0, undefined, 'text', '0'],
        ['textarea', 1, '1'],
        ['select', 2, '2'],
        ['radio', 3, '3'],
        ['checkbox', 4, '4'],
        ['image', 5, '5'],
        ['editor', 6, '6'],
      ]),
    }
  },
  computed: {
    // 防止xss注入和数据处理
    getArrayState() {
      return (prop, dataType) => {
        if (this.dataTypeIn[0].includes(dataType)) {
          const v = get(this.data, prop)
          if (isArray(v)) {
            return v
          }
          return v.split(',')
        }
      }
    },
    setArrayState() {
      return (value, prop, dataType) => set(this.data, prop, value.join(','))
    },
    getState() {
      return prop => get(this.data, prop)
    },
    setState() {
      return (value, prop) => set(this.data, prop, value)
    },
    configC() {
      const { type } = this.config
      if (type) {
        this.defaultConfig.searchBtnWidth = '25%'
      }
      return Object.assign(this.defaultConfig, this.config || {})
    },
  },
  props: {
    // type [0,undefined]
    // type [1,search]
    loading: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: {},
    },
    list: {
      type: Array,
      default: [],
    },
    data: {
      type: Object,
      default: {},
    },
  },
  name: 'index',
  created() {
    console.log(this.data, 'data')
  },
  methods: {
    /* setState(value,prop){
                set(this.data,prop,value)
            }, */
    // 控制显示隐藏
    isShow(conditions, type) {
      if (!conditions) return true
      // ['a=3','b= 1 ']
      if (/\|/.test(conditions) && /&/.test(conditions)) {
        throw 'isShow（默认）,isHide只能同时存在一个；|&不能同时出现,不支持复杂显示隐藏逻辑'
      }
      if (/\|/.test(conditions)) {
        return conditions.split('|').some(i => {
          const k = i.split('=')[0].trim()
          const v = i.split('=')[1].trim()
          return !type ? this.data[k] == v : this.data[k] != v
        })
      }
      if (/&/.test(conditions)) {
        return !conditions
          .split('|')
          .map(i => {
            const k = i.split('=')[0].trim()
            const v = i.split('=')[1].trim()
            return !type ? this.data[k] == v : this.data[k] != v
          })
          .some(i => !i)
      }
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$emit('submit')
          // this.reset()
        } else {
          console.error('error submit!!')
          ElMessage.error('请将信息填写完整')
        }
      })
    },
    reset() {
      this.$emit('reset')
      this.$refs.form.resetFields()
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep [style='width: 0px;'] {
  display: none;
}
.inlineItem {
  display: inline-block;
  &:empty {
    display: none;
  }
}
::v-deep .el-form-item {
  &__content {
    width: 0;
  }
}
</style>

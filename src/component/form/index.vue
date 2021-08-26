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
<!--        inline智能宽度，默认2个-->
        <div v-for="i in list" :key="i.prop" :class="i.inline && 'inlineItem'"
             :style="{width:typeof(i.width)==='number'?`${i.width}px`:i.width || (i.inline && '50%')}">
            <el-form-item
                v-if="isShow(i.isShow || i.isHide,i.isShow?0:1)"
                :label-width="typeof(i.labelWidth)==='number'?`${i.labelWidth}px`:i.labelWidth"
                :label="i.label" :prop="i.prop">
                <slot v-if="i.prepend" :name="`${i.prop}_prepend`"></slot>
                <slot :name="i.prop">
                    <!-- type ,显示隐藏判断

            input:0,undefined
            textarea:1,textarea

            el-radio:2,radio
            必选：options,buttonOptions,
            可选：config{label:'name',value:'id',border,dataType:'string'}

            el-checkbox:3,checkbox
            必选：options,buttonOptions
            可选：config{label:'name',value:'id',border,dataType:'string'}

            s-editor:config {}自行封装扩展
            s-image:config {domain:'',src:'image',dataType:'string'}自行封装扩展，不是绝对路径必传此参数
            -->
                    <!-- dataType [0,'0','string'] [1,'1','array']              -->
                    <el-input
                        v-if="[...typeIn[0], ...typeIn[1]].includes(i.type)"
                        :type="typeIn[0].includes(i.type) ? 'text' : 'textarea'"
                        v-model="data[i.prop]"
                        :placeholder="i.placeholder || `请输入${i.label}`"
                    ></el-input>
                    <el-select
                        :placeholder="i.placeholder || `请选择${i.label}`"
                        clearable v-else-if="typeIn[2].includes(i.type)" v-model="data[i.prop]">
                        <el-option :key="index"
                                   v-for="(j, index) in (i.options || i.buttonOptions)"
                                   :value="j[i.config?i.config.value || 'value':'value']"
                                   :label="j[i.config?i.config.label || 'label':'label']"></el-option>
                    </el-select>
                    <el-radio-group
                        v-else-if="typeIn[3].includes(i.type)" v-model="data[i.prop]">
                        <template v-if="i.options">
                            <!-- vue2不支持 i.config?.value || 'value'/!!i.config?.border -->
                            <el-radio
                                :border="i.config && i.config.border"
                                :key="index"
                                v-for="(j, index) in j.array"
                                :value="j[i.config?i.config.value || 'value':'value']"
                                :label="j[i.config?i.config.label || 'label':'label']"
                            >{{j.label}}
                            </el-radio
                            >
                        </template>
                        <template v-else>
                            <el-radio-button :key="index"
                                             v-for="(j, index) in i.buttonOptions"
                                             :value="j[i.config?i.config.value || 'value':'value']"
                                             :label="j[i.config?i.config.label || 'label':'label']">{{
                                    j.label
                                }}
                            </el-radio-button>
                        </template>
                    </el-radio-group>
                    <el-checkbox-group
                        v-else-if="typeIn[4].includes(i.type)" v-model="data[i.prop]">
                        <template v-if="i.options">
                            <el-checkbox
                                :key="index"
                                :border="i.config && i.config.border"
                                v-for="(j, index) in i.options"
                                :value="j[i.config?i.config.value || 'value':'value']"
                                :label="j[i.config?i.config.label || 'label':'label']"
                            >{{j.label}}
                            </el-checkbox
                            >
                        </template>
                        <template v-else>
                            <el-checkbox-button
                                :key="index"
                                :value="j[i.config?i.config.value || 'value':'value']"
                                :label="j[i.config?i.config.label || 'label':'label']"
                                v-for="(j, index) in i.buttonOptions">
                                {{j.label}}
                            </el-checkbox-button>
                        </template>
                    </el-checkbox-group>
                    <!--
            注意：
            :value.sync【vue2】
            v-model:value【vue3】
            -->
                    <s-image
                        :config="i.config" v-model:value="data[i.prop]"
                        v-else-if="typeIn[5].includes(i.type)"></s-image>
                    <s-editor
                        :config="i.config" v-model:value="data[i.prop]" v-else></s-editor>
                </slot>
                <slot v-if="i.append" :name="`${i.prop}_append`"></slot>
            </el-form-item>
        </div>
        <el-form-item class="submit">
            <el-button :loading="loading" v-if="configC.submitText" type="primary" @click="submit">{{
                    configC.submitText
                }}
            </el-button>
            <el-button :loading="loading" v-if="configC.resetText" @click="reset">{{configC.resetText}}</el-button>
        </el-form-item>
    </el-form>
</template>
<!--兼容vue2.0,vue3.0-->
<!--UI，数据分离，loading禁用-->
<script>

    import bookModel from '@/model/book'
    import sEditor from '@/component/base/tinymce'
    import sImage from '@/component/base/upload-image'
    import {ElMessage} from 'element-plus'

    const defaultConfig = {
        size: 'medium',
        statusIcon: true,
        submitText: '保 存',
        resetText: '重 置',
        labelWidth: '100px',
        rules: {},
    }
    export default {
        components: {
            sEditor,
            sImage,
        },
        data() {
            return {
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
            configC() {
                return Object.assign(defaultConfig, this.config || {})
            },
        },
        props: {
            loading: {
                type: Boolean,
                default: false,
            },
            config: {
                type: Object,
                default: defaultConfig,
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
        },
        methods: {
            //控制显示隐藏
            isShow(conditions, type) {
                if (!conditions) return true;
                //['a=3','b= 1 ']
                if (/\|/.test(conditions) && /&/.test(conditions)) {
                    throw 'isShow（默认）,isHide只能同时存在一个；|&不能同时出现,不支持复杂显示隐藏逻辑'
                }
                if (/\|/.test(conditions)) {
                    return conditions.split('|').some(i => {
                        let k = i.split('=')[0].trim()
                        let v = i.split('=')[1].trim()
                        return !type ? this.data[k] == v : this.data[k] != v
                    })
                }
                if (/&/.test(conditions)) {
                    return !conditions.split('|').map(i => {
                        let k = i.split('=')[0].trim()
                        let v = i.split('=')[1].trim()
                        return !type ? this.data[k] == v : this.data[k] != v
                    }).some(i => !i)
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

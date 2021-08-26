<template>
    <div class="container">
        <div class="title" v-if="!editBookId">新建图书{{editBookId}}</div>
        <div class="title" v-else>
            <span>修改图书</span> <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
        </div>

        <div class="wrap">
            <el-row>
                <el-col :lg="16" :md="20" :sm="24" :xs="24">
                    <s-form
                        :loading="loading"
                        @submit="submitForm" :data="book" :list="list" :config="{ rules }"></s-form>
                </el-col>

            </el-row>
        </div>
    </div>
</template>

<script>
import {reactive, ref, onMounted, defineAsyncComponent} from 'vue'
import {ElMessage} from 'element-plus'
import bookModel from '@/model/book'
import sForm from '@/component/form'

export default {
    props: {
        editBookId: {
            type: Number,
            default: null,
        },
    },

    components: {
        sForm,
    },
    setup(props, context) {
        const list = [
            {
                label: '书名',
                prop: 'title',
            },
            {
                label: '作者',
                prop: 'author'
            },
            {
                label: '封面',
                prop: 'image',
                type: 'image',
                dataType: 'string',
            },
            {
                label: '简介',
                prop: 'summary',
                type: '1',
            },
        ]
        const form = ref(null)
        const loading = ref(false)
        const book = reactive({id: '', title: '', author: '', summary: '', image: ''})

        const listAssign = (a, b) => Object.keys(a).forEach(key => {
            a[key] = b[key] || a[key]
        })

        /**
         * 表单规则验证
         */
        const {rules} = getRules()

        onMounted(() => {
            if (props.editBookId) {
                getBook()
            }
        })

        const getBook = async () => {
            loading.value = true
            const res = await bookModel.getBook(props.editBookId)
            listAssign(book, res)
            loading.value = false
        }
        const submitForm = async formName => {
            loading.value = true
            let res = {}
            if (props.editBookId) {
                res = await bookModel.editBook(props.editBookId, book)
                context.emit('editClose')
            } else {
                res = await bookModel.createBook(book)
            }
            if (res.code < window.MAX_SUCCESS_CODE) {
                ElMessage.success(`${res.message}`)
            }
            loading.value = false
        }

        const back = () => {
            context.emit('editClose')
        }

        return {
            loading,
            list,
            back,
            book,
            form,
            rules,
            submitForm,
        }
    },
}

/**
 * 表单验证规则
 */
function getRules() {
    /**
     * 验证回调函数
     */
    const checkInfo = (rule, value, callback) => {
        if (!value) {
            callback(new Error('信息不能为空'))
        }
        callback()
    }
    const rules = {
        title: [{validator: checkInfo, trigger: 'blur', required: true}],
        author: [{validator: checkInfo, trigger: 'blur', required: true}],
        summary: [{validator: checkInfo, trigger: 'blur', required: true}],
        image: [{validator: checkInfo, trigger: 'blur', required: true}],
    }
    return {rules}
}
</script>

<style lang="scss" scoped>

.container {
    .title {
        height:59px;
        line-height:59px;
        color:$parent-title-color;
        font-size:16px;
        font-weight:500;
        text-indent:40px;
        border-bottom:1px solid #dae1ec;

        .back {
            float:right;
            margin-right:40px;
            cursor:pointer;
        }
    }

    .wrap {
        padding:20px;
    }

    .submit {
        float:left;
    }
}
</style>

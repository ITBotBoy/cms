<template>
    <div>
        <editor id="tinymceEditor" :disabled="disabled" :init="tinymceInit" v-model="content"
                :key="tinymceFlag"></editor>
    </div>
</template>
<script>
import Editor from '@tinymce/tinymce-vue'
import {post} from '@/lin/plugin/axios'

export default {
    name: 'TinymceEditor',
    props: {
        value: {
            type: String,
            default: '',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        height: {
            type: Number,
            default: 500,
        },
        width: {
            type: Number,
            default: undefined,
        },
        showMenubar: {
            type: Boolean,
            default: true,
        },
        toolbar: {
            type: String,
            default: ` undo redo
      | formatselect
      | bold italic strikethrough forecolor backcolor formatpainter
      | link image | alignleft aligncenter alignright alignjustify
      | numlist bullist outdent indent
      | removeformat
      | preview fullscreen code`,
        },
    },
    components: {
        Editor,
    },
    data() {
        return {
            content: '',
            tinymceFlag: 1,
            tinymceInit: {},
        }
    },
    created() {
        this.tinymceInit = {
            language: 'zh_CN',
            height: this.height,
            branding: true, // 去水印
            statusbar: false, // 隐藏编辑器底部的状态栏
            elementpath: false, // 禁用编辑器底部的状态栏
            toolbar: this.toolbar,
            paste_data_images: true, // 允许粘贴图像
            browser_spellcheck: true, // 拼写检查
            menubar: this.showMenubar, // 隐藏最上方menu
            plugins: `print fullpage searchreplace autolink directionality visualblocks
        visualchars template codesample charmap hr pagebreak nonbreaking anchor toc insertdatetime
        wordcount textpattern help advlist table lists paste preview fullscreen image imagetools code link`,
            async images_upload_handler(blobInfo, success, failure) {
                const file = new File([blobInfo.blob()], blobInfo.filename(), {
                    type: 'image/*',
                })
                post('cms/file', {file})
                    .then(res => {
                        if (res.length && res[0]?.url) {
                            success(res[0].url)
                        }
                    })
                    .catch(err => failure(err))
            },
        }
    },
    mounted() {
        if (this.value) {
            this.content = this.value
        }
    },
    watch: {
        content: {
            handler() {
                this.$emit('update:value', this.content)
            },
        },
        value: {
            handler() {
                this.content = this.value
            },
            immediate: true,
        },
    },
    activated() {
        this.tinymceFlag++
    },
}
</script>

<style lang="scss">
.tox-notification {
    display:none !important;
}
</style>

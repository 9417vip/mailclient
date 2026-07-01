<script setup>
import { EditPen } from '@element-plus/icons-vue'
import { computed, reactive, ref } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { marked } from 'marked'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useAccountStore } from '@/store.js'

const loading = ref(false)
const showEditor = ref(false)
const rawContent = ref('')
const accountStore = useAccountStore()

const formData = reactive({
    to: '',
    subject: '',
    plaintext: false,
    content: computed(() => (formData.plaintext ? rawContent.value : marked(rawContent.value)))
})

const openEditor = () => {
    Object.assign(formData, {
        to: '',
        subject: '',
        plaintext: false,
        content: ''
    })

    showEditor.value = true
}

const sendMail = async () => {
    try {
        loading.value = true
        const res = await axios.post(`/api/mail/send?account=${accountStore.account}`, formData)

        ElMessage.success(res.data)
        showEditor.value = false
    } catch (error) {
        ElMessage.error(error.response.data)
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <el-button type="success" size="small" :loading="loading" :icon="EditPen" @click="openEditor">写邮件</el-button>
    <el-dialog v-model="showEditor" title="邮件编辑器" fullscreen>
        <div class="row">
            <el-text>目标</el-text>
            <el-input class="flex-1" v-model="formData.to" placeholder="多个目标用 ',' 分隔" />
            <el-button type="primary" :loading="loading" @click="sendMail">发送</el-button>
        </div>
        <div class="row-gap" />
        <div class="row">
            <el-text>主题</el-text>
            <el-input class="flex-1" v-model="formData.subject" />
            <el-text>富文本</el-text>
            <el-switch v-model="formData.plaintext" />
            <el-text>纯文本</el-text>
        </div>
        <div class="row-gap" />
        <MdEditor v-model="rawContent" theme="dark" />
    </el-dialog>
</template>

<style scoped>
.row {
    display: flex;
    align-items: center;
    column-gap: 5px;
}

.row-gap {
    height: 5px;
}
</style>

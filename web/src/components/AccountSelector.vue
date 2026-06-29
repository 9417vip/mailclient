<script setup>
import { useAccountStore } from '@/store.js'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'

const loading = ref(false)
const accountStore = useAccountStore()

const fetchAccounts = async () => {
    try {
        loading.value = true
        await accountStore.fetchAccounts()
    } catch (error) {
        ElMessage.error(error.response.data)
    } finally {
        loading.value = false
    }
}

watch(
    () => accountStore.account,
    account => {
        if (account === '') return
        ElMessage.info(`切换至 ${account}`)
    }
)

onMounted(fetchAccounts)
</script>

<template>
    <el-scrollbar max-height="400px">
        <el-dropdown-item v-for="account in accountStore.accounts">
            <el-button @click="accountStore.account = account" link>{{ account }}</el-button>
        </el-dropdown-item>
    </el-scrollbar>
</template>

<style scoped></style>

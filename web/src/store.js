import axios from 'axios'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useAccountStore = defineStore('account', () => {
    const account = ref('')
    const accounts = ref([])

    const fetchAccounts = async () => {
        const res = await axios.get('/api/account/list')
        accounts.value = res.data
    }

    return { account, accounts, fetchAccounts }
})

export const useMailboxStore = defineStore('mailbox', () => {
    const folder = ref('')

    const mailData = reactive({
        from: '',
        to: '',
        subject: '',
        date: '',
        body: ''
    })

    const emptyMailData = () => {
        Object.assign(mailData, {
            from: '',
            to: '',
            subject: '',
            date: '',
            body: ''
        })
    }

    return { folder, mailData, emptyMailData }
})

<script setup>
import { useMailboxStore } from '@/store.js'
import { ref, watch } from 'vue'
import PostalMime from 'postal-mime'
import DOMPurify from 'dompurify'

const parsedContent = ref('')
const mailboxStore = useMailboxStore()

watch(
    () => mailboxStore.mailData.body,
    async rawData => {
        if (!rawData) return ''
        let standardizedMime = rawData

        if (rawData.includes('From:') && rawData.includes('Subject:')) {
            const headerIndex = rawData.search(/(From:|Subject:|Date:|Content-Type: multipart)/i)

            if (headerIndex !== -1) {
                let headersPart = rawData.substring(headerIndex)
                let bodyPart = rawData.substring(0, headerIndex)
                headersPart = headersPart.replace(/BODY\[HEADER[\s\S]*?\]\s*\{\d+\}/gi, '')
                standardizedMime = `${headersPart.trim()}\n\n${bodyPart.trim()}`
            }
        }

        const parser = new PostalMime()
        const mail = await parser.parse(standardizedMime)
        let content = mail.html || mail.text || ''
        parsedContent.value = DOMPurify.sanitize(content)
    },
    { immediate: true }
)
</script>

<template>
    <div class="view-container">
        <div class="mail-header">
            <h2 class="mail-subject">{{ mailboxStore.mailData.subject || '(无主题)' }}</h2>
            <div class="mail-meta">
                <p><span>发件人:</span>{{ mailboxStore.mailData.from }}</p>
                <p><span>收件人:</span>{{ mailboxStore.mailData.to }}</p>
                <p><span>时间:</span>{{ new Date(mailboxStore.mailData.date).toLocaleString() }}</p>
            </div>
        </div>
        <iframe :srcdoc="parsedContent" class="mail-iframe" />
    </div>
</template>

<style scoped>
.view-container {
    display: flex;
    flex-direction: column;
    background: #1e1e1ebf;
    backdrop-filter: blur(4px);
    border-radius: 8px;
    padding: 24px;
    color: #f7fafc;
}

.mail-header {
    border-bottom: 1px solid #ffffff1a;
    padding-bottom: 16px;
    margin-bottom: 20px;
}

.mail-subject {
    font-size: 1.25rem;
    color: #ffffff;
    margin: 0 0 12px 0;
    font-weight: 600;
}

.mail-meta p {
    margin: 4px 0;
    font-size: 0.875rem;
    color: #cbd5e0;
}

.mail-meta span {
    color: #a0aec0;
    display: inline-block;
    width: 60px;
}

.mail-iframe {
    width: 100%;
    min-height: 200px;
    display: block;
    border: none;
    background: transparent;
}
</style>

import express from 'express'
const mail = express.Router()

import { needauth } from './auth.js'
mail.use(needauth)

import { getenv } from './cfenv.js'
const env = getenv()

import { CFImap } from 'cf-imap'
import { WorkerMailer } from 'worker-mailer'

mail.use(async (req, res, next) => {
    const { account } = req.query
    if (typeof account !== 'string' || account === '') {
        return res.status(400).send('请求错误')
    }

    const result = await env.data.get(account)
    if (!result) {
        return res.status(404).send('账号不存在')
    }

    const config = JSON.parse(result)

    req.emalAccount = {
        address: account,
        name: config.displayName
    }

    const authCredentials = {
        username: account,
        password: config.password
    }
})

export default mail

import express from 'express'
const mail = express.Router()

import { needauth } from './auth.js'
mail.use(needauth)

import { getenv } from './cfenv.js'
const env = getenv()

import { WorkerMailer } from 'worker-mailer'
import { CFImap } from 'cf-imap'

export default mail

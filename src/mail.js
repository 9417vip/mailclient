import express from 'express'
const mail = express.Router()

import { needauth } from './auth.js'
mail.use(needauth)

import { getenv } from './cfenv.js'
const env = getenv()

export default mail

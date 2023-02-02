const express = require('express')
const router = express.Router()

const userRouter = require('./users')
const visitorRouter = require('./visitor')

router.use('/user', userRouter)
router.use('/visitor', visitorRouter)

module.exports = router
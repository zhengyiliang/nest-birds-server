const express = require('express')
const router = express.Router()

const articlesRouter = require('./articles')
const categoryRouter = require('./category')
const friendRouter = require('./friend')
const messageRouter = require('./message')
const tagRouter = require('./tag')

router.use('/article', articlesRouter)
router.use('/category', categoryRouter)
router.use('/friend', friendRouter)
router.use('/message', messageRouter)
router.use('/tag', tagRouter)

module.exports = router
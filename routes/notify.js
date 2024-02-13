const express = require('express')
const { createNotify,deleteNotify } = require('../controllers/notifycontrollers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.post( '/', createNotify )

router.delete( '/:id', deleteNotify )

module.exports = router
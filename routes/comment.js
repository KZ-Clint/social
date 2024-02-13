const express = require('express')
const { createComment, updateComment, likeComment, unlikeComment, deleteComment } = require('../controllers/commentcontrollers')

const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.post( '/', createComment )

router.patch( '/:id', updateComment )

router.put( '/like/:id', likeComment )

router.put( '/unlike/:id', unlikeComment )

router.delete( '/delete/:id', deleteComment )

module.exports = router
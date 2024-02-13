const express = require('express')
const { searchUser, getUser, getLoggedUser, updateUser, followUser, UnfollowUser, suggestionsUser } = require('../controllers/usercontrollers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.get( '/loggeduser', getLoggedUser )

router.get( '/search', searchUser )

router.get( '/user/:id', getUser )

router.patch( '/update/:id', updateUser )

router.put( '/follow/:id', followUser )

router.put( '/unfollow/:id', UnfollowUser )

router.get( '/suggestion', suggestionsUser )

module.exports = router
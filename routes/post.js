const express = require('express')
const { createPost, getPost, updatePost, likePost, unlikePost, getUserPosts, getSinglePost, getPostsDiscover, deletePost, savePost, unSavePost, getSavedPost } = require('../controllers/postcontrollers')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.post( '/', createPost )

router.get( '/', getPost )

router.patch( '/:id', updatePost )

router.put( '/like/:id', likePost )

router.put( '/unlike/:id', unlikePost )

router.get( '/user_posts/:id', getUserPosts )

router.get( '/get_post/:id', getSinglePost )

router.get( '/post_discover', getPostsDiscover )

router.delete( '/delete_post/:id', deletePost )

router.put( '/save_post/:id', savePost )

router.put( '/unsave_post/:id', unSavePost )

router.get( '/saved_posts', getSavedPost )

module.exports = router
const Post = require('../models/postModel')
const Comments = require('../models/commentModel')
const Suser = require('../models/userModel')

class APIfeatures {
  constructor(query, queryString) { 
  this.query = query;
  this.queryString = queryString;
  }
  paginating(){
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 3
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit)
    return this;
 }
  filtering() {
     const queryObj = {...this.queryString}

     const excludeFields = ['page', 'sort', 'limit']
     excludeFields.forEach( (el) => {
        delete(queryObj[el]) } )

        if( queryObj.category !== 'all' ) {
           this.query.find({ category: queryObj.category })
        }
        if( queryObj.title !== 'all' ) {
           this.query.find({ title: { $regex: queryObj.title } })
        }
      this.query.find()
      return this;
  }
  sorting() {
     if(this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join('')
        this.query = this.query.sort(sortBy)
     }else{
        this.query = this.query.sort('-createdAt')
     }
     return this;
  }
 
}

const createPost = async (req,res) => {
    const { content, images } = req.body  
    try {
      if(images.length === 0) return res.status(500).json({error : "Image is required"})
    const newPost = new Post({
      content, images, user: req.user._id
    })
    const post = await newPost.save();
    res.status(200).json({ post:{...post._doc, user:req.user}, msg: 'Posted Successfully'})
    } catch (err) {
    res.status(500).json({error : err.message})
    }
}

const getPost = async (req,res) => {
  
  try {
     const features = new APIfeatures(Post.find({user: [...req.user.following, req.user._id] }), req.query).paginating()
    const posts = await features.query.sort('-createdAt')
    .populate("user likes", "avatar username fullname followers" )
    .populate({
       path:"comments",
       populate: {
          path: "user likes",
          select: "-password"
       }
    })
  res.status(200).json({ posts, msg: 'Posts gotten successfully', result:posts.length})
  } catch (err) {
  res.status(500).json({error : err.message})
  }
}

const updatePost = async (req,res) => {
  try {
   const post = await Post.findOneAndUpdate({_id:req.params.id}, { $set: req.body }, {new:true} ).populate("user likes", "avatar username fullname" )
  res.status(200).json({ post, msg: 'Updated Successfully'})
  } catch (err) {
  res.status(500).json({error : err.message})
  }
}

const likePost = async (req, res) => {
  
 try{ 
      await Post.updateOne( {_id:req.params.id}, { $push:{ likes: req.user._id } } )
      res.status(200).json({ msg: `Post has been liked`})
   } catch (err) {
       console.log({error: err.message})
       res.status(500).json({ error : err.message })
   }
} 

const unlikePost = async (req, res) => {
  try{ 
      await Post.updateOne( {_id:req.params.id}, { $pull:{ likes: req.user._id } } )
      res.status(200).json({ msg: `Post has been liked`})
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
 } 

const getUserPosts = async(req, res) => {
  try {
    const features = new APIfeatures(Post.find({user: req.params.id }), req.query).paginating()
    console.log(features)
    const posts = await features.query.sort('-createdAt')
    .populate("user likes", "avatar username fullname" )
    .populate({
       path:"comments",
       populate: {
          path: "user likes",
          select: "-password"
       }
    })
    console.log("there")
  res.status(200).json({posts, result:posts.length })
  } catch (err) {
  res.status(500).json({error : err.message})
  }
}

const getSinglePost = async(req, res) => {
  try {
    const post = await Post.findById(req.params.id).sort('-createdAt')
    .populate("user likes", "avatar username fullname" )
    .populate({
       path:"comments",
       populate: {
          path: "user likes",
          select: "-password"
       }
    })
  res.status(200).json({post })
  } catch (err) {
  res.status(500).json({error : err.message})
  }
}

const getPostsDiscover = async(req, res) => {
  try {
    const features = new APIfeatures(Post.find({
      user: { $nin: [...req.user.following, req.user._id] }
    }), req.query).paginating()
    const posts = await features.query.sort('-createdAt')
    .populate("user likes", "avatar username fullname" )
    .populate({
       path:"comments",
       populate: {
          path: "user likes",
          select: "-password"
       }
    })
    
  res.status(200).json({posts, result:posts.length })
  } catch (err) {
  res.status(500).json({error : err.message})
  }
}

const deletePost = async (req, res) => {
   try{ 
     const post = await Post.findOneAndDelete( {_id:req.params.id, user: req.user._id } )
     
      await Comments.deleteMany( {_id: {$in: post.comments} } )
        res.status(200).json({ msg: `Deleted Post`, post:{ ...post, user:req.user }})
     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
  } 

  const savePost = async (req, res) => {
   try{ 
      await Suser.updateOne( {_id:req.user._id}, { $push:{ saved: req.params.id } } )
        res.status(200).json({ msg: `Deleted Post`})
     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
  } 

  const unSavePost = async (req, res) => {
   try{ 
      await Suser.updateOne( {_id:req.user._id}, { $pull:{ saved: req.params.id } } )
        res.status(200).json({ msg: `Deleted Post`})
     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
  } 

  const getSavedPost = async (req, res) => {
   try{ 
      const features = new APIfeatures(Post.find({
         _id: { $in: req.user.saved }
       }), req.query).paginating()

       const savedPosts = await features.query.sort('-createdAt')
     
        res.status(200).json({ savedPosts, result:savedPosts.length })
     } catch (err) {
         console.log({error: err.message})
         res.status(500).json({ error : err.message })
     }
  } 


   module.exports = { createPost, getPost, updatePost, likePost, unlikePost, getUserPosts, getSinglePost, getPostsDiscover, deletePost, savePost, unSavePost, getSavedPost }
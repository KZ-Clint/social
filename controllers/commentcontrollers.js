const Post = require('../models/postModel')
const Comments = require('../models/commentModel')

const createComment = async (req,res) => {
    const { postId, content, tag, reply, postUserId } = req.body

    const post = await Post.findById(postId)
    if(!post) return  res.status(400).json({error :"This post does not exists"}) 
    if(reply) { 
      const cm = await Comments.findById(reply)
      if(!cm) return  res.status(400).json({error :"This comment does not exists"}) 
    }
    try {
      const newComment = new Comments({
        user:req.user._id, content, tag, reply, postUserId, postId
      })
      await Post.findOneAndUpdate({_id:postId}, {
        $push: {comments: newComment._id}
      },{new:true} ) 
      
     const comment = await newComment.save()
     res.status(200).json({comment})
    } catch (err) {
      res.status(500).json({error : err.message})
    }
}

const updateComment = async (req,res) => {
  const { content } = req.body  
  try {
    await Comments.updateOne({_id:req.params.id, user:req.user._id}, { content } ) 
    res.status(200).json({msg: 'Successfull'})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
}

const likeComment = async (req, res) => {
  try{ 
       await Comments.updateOne( {_id:req.params.id}, { $push:{ likes: req.user._id } } )
       res.status(200).json({ msg: `Comment has been liked`})
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
 } 

 const unlikeComment = async (req, res) => {
  try{ 
       await Comments.updateOne( {_id:req.params.id}, { $pull:{ likes: req.user._id } } )
       res.status(200).json({ msg: `Comment has been unliked`})
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
 } 

 const deleteComment = async (req, res) => {
  try{ 
    const comment = await Comments.findOneAndDelete( {_id:req.params.id, $or: [{ user: req.user._id},{postUserId: req.user._id}] } )
    
     await Post.updateOne( {_id:comment.postId}, { $pull:{ comments: req.params.id } } )
       res.status(200).json({ msg: `Comment has been deleted`})
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
 } 



   module.exports = { createComment, updateComment, likeComment, unlikeComment, deleteComment }
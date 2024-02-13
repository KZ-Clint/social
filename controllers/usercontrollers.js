const Suser = require('../models/userModel')

const searchUser = async (req,res) => {
  
  try {
    const users = await Suser.find({username: {$regex: req.query.username}})
    .limit(10).select("fullname username avatar")
      
    res.status(200).json({users})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
}

const getUser = async (req,res) => {
  
  try {
    const user = await Suser.findById(req.params.id).populate( "followers following", "-password").select("-password") 
    if(!user) return res.status(400).json({error : " User does not exists."})
    res.status(200).json({user})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
}

const getLoggedUser = async (req,res) => {
  
  try {      
    const {_id, role} = req.user
     const user = await Suser.findById(_id).populate( "followers following", "-password") 
  
    res.json({user})

  } catch (err) {
    console.log({error: err.message})
    res.status(400).json({error : err.message})
  }
}

const updateUser = async (req,res) => {

  try {
    const { avatar, mobile, website, fullname, username, email, gender,address, story } = req.body
    if(!fullname) return res.status(400).json({error : " Please add your fullname."})

    const user = await Suser.findByIdAndUpdate(req.params.id, {  avatar, mobile, website, fullname,address, username, email, gender,story  }, {new:true} )
    res.status(200).json({user})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
}

const followUser = async(req, res) => {
  const {_id} = req.user
  const {id} = req.params
      try{     
          const userf = await Suser.findById(id).populate( "followers following", "_id").select("_id followers, following") 
          console.log(userf)
          if (!userf ){
               return res.status(400).json({error : "No user like this!!"})   
            }
         if (userf.followers.includes(_id) ){
            return res.status(400).json({error : "You already follow this user!!"})   
         }
          const newUser = await Suser.findByIdAndUpdate(id,  { $push: { followers: _id} }, {new:true} ).populate( "followers following", "-password")    
             
          const usermain = await Suser.findByIdAndUpdate( _id, { $push: { following: id} }, {new:true}) 

      res.status(200).json({ newUser, usermain })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
}

const UnfollowUser = async(req, res) => {
  const {_id} = req.user
  const {id} = req.params
      try{     

          const newUser = await Suser.findByIdAndUpdate(id,  { $pull: { followers: _id} }, {new:true} ).populate( "followers following", "-password")    
             
          const usermain = await Suser.findByIdAndUpdate( _id, { $pull: { following: id} }, {new:true}) 

      res.status(200).json({ newUser, usermain })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
}

const suggestionsUser = async(req, res) => {
      try{     
         const newArr = [...req.user.following, req.user._id]
         const num = req.query.num || 10
         const users = await Suser.aggregate([ 
          { $match: { _id:{ $nin: newArr } } }, 
          { $sample: { size: Number(num) } },
          { $lookup: { from: 'socialuser', localField: 'followers', foreignField: '_id', as: 'followers' } },
          { $lookup: { from: 'socialuser', localField: 'following', foreignField: '_id', as: 'following' } },
        ]).project("-password")

      res.status(200).json({ users, result:users.length })
    } catch (err) {
        console.log({error: err.message})
        res.status(500).json({ error : err.message })
    }
}


   module.exports = { searchUser, getUser, getLoggedUser, updateUser, followUser, UnfollowUser, suggestionsUser }
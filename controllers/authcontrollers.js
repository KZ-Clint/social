const Suser = require('../models/userModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createAccessToken = (_id) => {
    return jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '7d' } )
  }

const registerUser = async (req,res) => {
           const { fullname, username, email, gender, passwords } = req.body
          
           let newUserName = username.toLowerCase().replace(/ /g, '')
    try {
        const user_name = await Suser.findOne({ username: newUserName })
        if(user_name) return  res.status(400).json({error : "This user name already exists."})

        const user_email = await Suser.findOne({email})
        if(user_email) return  res.status(400).json({error : "This email already exists."})

        if(passwords.length < 6 ) return  res.status(400).json({msg : "Password must be at least 6 characters."})
   
          const salt = await bcrypt.genSalt(10)
          const hashedPassword = await bcrypt.hash( passwords, salt )

        const newUser = new Suser({
          fullname, username: newUserName, email, password: hashedPassword, gender
        })
        const user = await newUser.save();
        const {password, updatedAt, ...other} = user._doc

        console.log("USER HAS SIGNED UP")
        res.status(200).json({ other, msg: 'Signed up successfully'})
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}


const loginUser = async (req,res) => {
  
  try {
      const { email, password } = req.body
      const user = await Suser.findOne({ email }).populate( "followers following", "-password" )

      if(!user) return res.status(404).json({error : "This email does not exist"})
      
      const match = await bcrypt.compare(password, user.password)
      if(!match) return res.status(404).json({error : "Password is incorrect"})

      const access_token = createAccessToken(user._id)
  
    res.status(200).json({user, access_token, msg:"Logged in successfully"})
  } catch (err) {
    res.status(500).json({error : err.message})
  }
}


   module.exports = { registerUser, loginUser }
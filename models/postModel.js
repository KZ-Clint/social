const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const postSchema = mongoose.Schema( {
    content: String,
    images: { type:Array, required:true },
    likes: [{type: mongoose.Types.ObjectId, ref: 'socialuser'}],
    comments: [{type: mongoose.Types.ObjectId, ref: 'socialcomment'}],
    user: {type: mongoose.Types.ObjectId, ref: 'socialuser'}
}, { timestamps: true } )


module.exports = mongoose.model('socialpost', postSchema )
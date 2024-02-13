const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const commentSchema = mongoose.Schema( {
    content: {
        type: String,
        required:true
    },
    tag:Object,
    reply:  mongoose.Types.ObjectId,
    likes: [{type: mongoose.Types.ObjectId, ref: 'socialuser'}],
    user: {type: mongoose.Types.ObjectId, ref: 'socialuser'},
    postId:  mongoose.Types.ObjectId,
    postUserId:  mongoose.Types.ObjectId
}, { timestamps: true } )


module.exports = mongoose.model('socialcomment', commentSchema )
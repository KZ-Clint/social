const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema( {
    fullname: {
        type : String,
        required : true,
        trim:true,
        maxlength:25
    },
    username: {
        type : String,
        required : true,
        trim:true,
        maxlength:25,
        unique:true
    },
    email: {
        type: String,
        required: true,
        trim:true,
        unique: true
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user'},
    root: { type: Boolean, default: false},
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/clintdb/image/upload/v1663105424/samples/people/smiling-man.jpg'
    },
    gender: { type: String, default: 'male' },
    mobile: { type: String, default: ''},
    address: { type: String, default: '' },
    story: {
        type: String,
        default: '',
        maxlength:200
    },
    website: {  type: String, default: '' },
    followers: [ {type: mongoose.Types.ObjectId, ref: 'socialuser'} ],
    following: [ {type: mongoose.Types.ObjectId, ref: 'socialuser'} ],
    saved: [ {type: mongoose.Types.ObjectId, ref: 'socialpost'} ],
    verified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true } )


module.exports = mongoose.model('socialuser', userSchema )
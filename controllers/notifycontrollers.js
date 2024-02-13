const Notifies = require('../models/notifyModel')

const createNotify = async (req,res) => {
           const { fullname, username, email, gender, passwords } = req.body
          
    try {
        const { id, recipients, url, text, content, image} = req.body
        const notify = new Notifies({
            id, recipients, url, text, content, image, user: req.user._id
        })
        await notify.save()
        res.status(200).json({notify})
    } catch (err) {
        res.status(500).json({error : err.message})
    }
}

    const deleteNotify = async (req,res) => {
    
        try {
            const notify = await Notifies.findOneAndDelete( {id:req.params.id, url:req.query.url} )
           res.status(200).json({notify})
        } catch (err) {
           res.status(500).json({error : err.message})
        }
    }


   module.exports = { createNotify, deleteNotify }
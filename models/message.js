const mongoose = require('mongoose')
const MessageSchema = new mongoose.Schema({

    content: String,
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: true })
const messageModel = mongoose.model('Messages', MessageSchema)
module.exports = messageModel
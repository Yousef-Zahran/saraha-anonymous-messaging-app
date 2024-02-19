const messageModel = require('../models/message');
const userModel = require('../models/userModel');
const apiError = require('../utils/apiError');
const catchError = require('../utils/catchErrors')


const sendMessage = catchError(async(req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const user = await userModel.findById(id);
    if (!user) return next(new apiError('user not found!', 404))
    await messageModel.create({ content, receiverId: id })
    res.status(201).json({ success: true, results: "message sent successfully" })
})

const userMessages = catchError(async(req, res, next) => {
    const id = req.verifyingUserId
    const messages = await messageModel.find({ receiverId: id })
    res.status(200).json({ success: true, results: messages })
});

module.exports = { sendMessage, userMessages }
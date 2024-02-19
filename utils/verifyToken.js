const jwt = require('jsonwebtoken')
const apiError = require('../utils/apiError')
const userModel = require('../models/userModel')


const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization;
    // console.log(token)

    if (!token) return next(new apiError("Please provide a token", 404));
    try {
        var { id } = jwt.verify(token, process.env.USER_KEY)
            // console.log(id)
    } catch (err) {
        return next(new apiError('Invalid token', 401))
    }
    const userData = await userModel.findById({ _id: id })
    if (!userData) return next(new apiError("Invalid token,user not found", 404));


    req.verifyingUserId = id;
    next()

}
module.exports = verifyToken